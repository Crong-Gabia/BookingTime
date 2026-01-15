import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { generateTimeSlots, isBlockedSlot } from '../utils/timeSlot';

export default function ResponsePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState('');
  const [slotSelections, setSlotSelections] = useState<Record<string, 'available' | 'unavailable' | undefined>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseJsonBody = (value: string) => {
    if (!value) return null;
    try {
      return JSON.parse(value) as { message?: string } | null;
    } catch (error) {
      return null;
    }
  };

  const readResponseBody = async (response: Response) => {
    if (typeof response.text === 'function') {
      const text = await response.text();
      return { text, data: parseJsonBody(text) };
    }

    if (typeof response.json === 'function') {
      const data = (await response.json()) as { message?: string } | null;
      return { text: '', data };
    }

    return { text: '', data: null };
  };

  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['meeting-dashboard', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await fetch(`/api/meetings/${id}/dashboard`);
      const { text, data } = await readResponseBody(response);

      if (!response.ok) {
        let message = 'Failed to load dashboard';
        if (data && typeof data.message === 'string') {
          message = data.message;
        } else if (text) {
          message = text;
        }
        throw new Error(message);
      }

      if (!data) {
        throw new Error('Failed to load dashboard');
      }

      return data as {
        requestId: string;
        title: string;
        status: string;
        participants: Array<{ userId: string; name: string; responded: boolean }>;
        startDate: string;
        endDate: string;
        organizerAvailableSlots?: string[];
      };
    },
  });

  const participants = dashboardData?.participants ?? [];
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    if (!selectedUserId && participants.length > 0) {
      setSelectedUserId(participants[0].userId);
      setName(participants[0].name);
    }
  }, [participants, selectedUserId]);

  const startDateString = dashboardData?.startDate;
  const endDateString = dashboardData?.endDate;

  const timeSlotData = useMemo(() => generateTimeSlots(startDateString || '', endDateString || ''), [startDateString, endDateString]);

  const isOrganizerUnavailable = (slotIso: string): boolean => {
    if (!dashboardData?.organizerAvailableSlots) return false;
    return !dashboardData.organizerAvailableSlots.includes(slotIso);
  };

  const getSlotStatus = (slotIso: string) => {
    return slotSelections[slotIso] ?? 'none';
  };

  const toggleSlot = (slotIso: string) => {
    const key = slotIso;
    setSlotSelections((prev) => {
      const next = { ...prev };
      const current = next[key];

      if (!current) {
        next[key] = 'available';
        return next;
      }

      if (current === 'available') {
        next[key] = 'unavailable';
        return next;
      }

      delete next[key];
      return next;
    });
  };

  const handleSetAllAvailable = (date: string) => {
    const dateSlots = timeSlotData.find((ds) => ds.date === date);
    if (!dateSlots) return;

    setSlotSelections((prev) => {
      const next = { ...prev };

      dateSlots.slots.forEach((slot) => {
        const [slotIso, time] = slot.split('|');
        if (!slotIso || !time) return;
        if (isBlockedSlot(date, time)) return;
        next[slotIso] = 'available';
      });

      return next;
    });
  };

  const handleSetAllUnavailable = (date: string) => {
    const dateSlots = timeSlotData.find((ds) => ds.date === date);
    if (!dateSlots) return;

    setSlotSelections((prev) => {
      const next = { ...prev };

      dateSlots.slots.forEach((slot) => {
        const [slotIso, time] = slot.split('|');
        if (!slotIso || !time) return;
        if (isBlockedSlot(date, time)) return;
        next[slotIso] = 'unavailable';
      });

      return next;
    });
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUserId) {
        throw new Error('참여자를 선택해주세요.');
      }

      const selectedParticipant = participants.find((p) => p.userId === selectedUserId);
      if (!selectedParticipant) {
        throw new Error('참여자를 다시 선택해주세요.');
      }

      const participantName = name || selectedParticipant.name;
      if (!participantName) {
        throw new Error('이름을 입력해주세요.');
      }

      const response = await fetch(`/api/meetings/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          name: participantName,
          availableSlots: Object.entries(slotSelections)
            .filter(([, status]) => status === 'available')
            .map(([key]) => key),
          unavailableSlots: Object.entries(slotSelections)
            .filter(([, status]) => status === 'unavailable')
            .map(([key]) => key),
        }),
      });

      const { text, data } = await readResponseBody(response);

      if (!response.ok) {
        if (data && typeof data.message === 'string') {
          throw new Error(data.message);
        }
        if (text) {
          throw new Error(text);
        }
        throw new Error('제출 실패');
      }

      return data ?? text ?? null;
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error: Error) => {
      toast.error(`제출 실패: ${error.message}`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = () => {
    if (Object.keys(slotSelections).length === 0) {
      toast.error('최소 하나 이상의 시간을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    submitMutation.mutate();
  };


  if (isSubmitted) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <IconButton onClick={() => navigate('/')} color="inherit">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              응답 완료
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <Typography variant="h4" sx={{ color: '#4caf50', marginBottom: '1rem' }}>
            ✅ 응답 완료!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            소중한 시간을 내어주셔서 감사합니다.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ marginTop: '2rem' }}
          >
            홈으로 이동
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <IconButton onClick={() => navigate('/')} color="inherit">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            회의 일정 응답
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: '1rem', paddingBottom: '8rem', flex: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          회의 일정 응답
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '1.5rem' }}>
          가능한 시간을 선택하세요 (불가능한 시간은 자동으로 표시됩니다)
        </Typography>

        {dashboardLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              참여자 목록 불러오는 중...
            </Typography>
          </Box>
        ) : dashboardError ? (
          <Box sx={{ marginBottom: '1.5rem' }}>
            <Typography variant="body2" color="error">
              참여자 목록을 불러오지 못했습니다. ({String(dashboardError)})
            </Typography>
          </Box>
        ) : (
          <Box sx={{ marginBottom: '1.5rem' }}>
            <FormControl fullWidth size="small" disabled={isSubmitting || participants.length === 0}>
              <InputLabel id="participant-select-label">참여자</InputLabel>
              <Select
                labelId="participant-select-label"
                value={selectedUserId}
                label="참여자"
                onChange={(e) => {
                  const userId = String(e.target.value);
                  setSelectedUserId(userId);
                  const selected = participants.find((p) => p.userId === userId);
                  if (selected) {
                    setName(selected.name);
                  }
                }}
              >
                {participants.map((p) => (
                  <MenuItem key={p.userId} value={p.userId}>
                    {p.name} ({p.userId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Box sx={{ marginBottom: '1.5rem' }}>
          <Typography sx={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            이름 *
          </Typography>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
        </Box>

        {timeSlotData.map((dateSlot) => (
          <Box key={dateSlot.date} sx={{ marginBottom: '1.5rem' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ margin: 0 }}>
                {new Date(dateSlot.date).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', weekday: 'long' })}
              </Typography>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => handleSetAllAvailable(dateSlot.date)}
                  disabled={isSubmitting}
                >
                  전체 가능
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => handleSetAllUnavailable(dateSlot.date)}
                  disabled={isSubmitting}
                >
                  전체 불가
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
              {dateSlot.slots.map((slot) => {
                const [slotIso, time] = slot.split('|');
                if (!slotIso || !time) return null;

                const status = getSlotStatus(slotIso);
                const isAvailable = status === 'available';
                const isUnavailable = status === 'unavailable';
                const isHolidayBlocked = isBlockedSlot(dateSlot.date, time);
                const isOrganizerBlocked = isOrganizerUnavailable(slotIso);
                const isBlocked = isHolidayBlocked || isOrganizerBlocked;
                const isUnselected = status === 'none';

                return (
                  <Button
                    key={slotIso}
                    disabled={isBlocked || isSubmitting}
                    onClick={() => !isBlocked && toggleSlot(slotIso)}
                    variant={isUnselected ? 'outlined' : 'contained'}
                    sx={{
                      padding: '0.75rem',
                      border: isAvailable
                        ? '3px solid #4caf50'
                        : isUnavailable
                          ? '3px solid #f44336'
                          : isOrganizerBlocked
                            ? '2px dashed #ff9800'
                            : '2px solid #e0e0e0',
                      borderRadius: '8px',
                      backgroundColor: isAvailable
                        ? '#e8f5e9'
                        : isUnavailable
                          ? '#ffebee'
                          : isOrganizerBlocked
                            ? '#fff3e0'
                            : 'white',
                      color: isAvailable ? '#2e7d32' : isUnavailable ? '#c62828' : isOrganizerBlocked ? '#e65100' : '#333',
                      fontWeight: 'bold',
                      opacity: isHolidayBlocked ? 0.4 : isOrganizerBlocked ? 0.6 : 1,
                      fontSize: '0.875rem',
                      position: 'relative',
                    }}
                  >
                    {time}
                  </Button>
                );
              })}
            </Box>
          </Box>
        ))}

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1rem',
            backgroundColor: 'white',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(slotSelections).length === 0}
          >
            {isSubmitting ? '제출 중...' : `제출하기 (${Object.keys(slotSelections).length}개 선택)`}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
