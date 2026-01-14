import { useState, useEffect } from 'react';
import { generateTimeSlots, isBlockedSlot, type TimeSlotData } from '../utils/timeSlot';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface MeetingFormData {
  title: string;
  description?: string;
  organizerId: string;
  participantIds: string[];
  requiredParticipantIds: string[];
  startDate: string;
  endDate: string;
  durationMinutes: number;
  location?: string;
}

export default function OrganizerSlotSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const meetingData = location.state?.meetingData as MeetingFormData;

  const [selectedSlots, setSelectedSlots] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!meetingData || !meetingData.title || !meetingData.startDate || !meetingData.endDate) {
      alert('회의 정보가 없습니다. 다시 생성해주세요.');
      navigate('/new');
      return;
    }
  }, [meetingData, navigate]);

  const startDateString = meetingData?.startDate;
  const endDateString = meetingData?.endDate;

  const timeSlotData = generateTimeSlots(startDateString || '', endDateString || '');

  const toggleSlot = (slotIso: string) => {
    setSelectedSlots((prev) => {
      const next = { ...prev };
      if (next[slotIso]) {
        delete next[slotIso];
      } else {
        next[slotIso] = true;
      }
      return next;
    });
  };

  const handleSetAll = (date: string, value: boolean) => {
    const dateSlots = timeSlotData.find((ds) => ds.date === date);
    if (!dateSlots) return;

    setSelectedSlots((prev) => {
      const next = { ...prev };

      dateSlots.slots.forEach((slot) => {
        const [slotIso, time] = slot.split('|');
        if (!slotIso || !time) return;
        if (isBlockedSlot(date, time)) return;
        if (value) {
          next[slotIso] = true;
        } else {
          delete next[slotIso];
        }
      });

      return next;
    });
  };

  const handleSubmit = async () => {
    if (!meetingData) return;

    const selectedCount = Object.keys(selectedSlots).length;
    if (selectedCount === 0) {
      alert('최소 하나 이상의 시간을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...meetingData,
          organizerAvailableSlots: Object.keys(selectedSlots),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create meeting');
      }

      const data = await response.json();
      alert(`회의 요청이 생성되었습니다!\n\n대시보드 링크:\n${window.location.origin}/requests/${data.id}/dashboard`);
      navigate(`/requests/${data.id}/dashboard`);
    } catch (_error) {
      alert('회의 요청 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!meetingData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <IconButton onClick={() => navigate('/')} color="inherit">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              시간 선택
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <IconButton onClick={() => navigate('/new')} color="inherit">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            시간 선택
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: '1rem', paddingBottom: '8rem', flex: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          가능한 시간 선택
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '1.5rem' }}>
          회의를 진행할 수 있는 시간을 모두 선택해주세요.
        </Typography>

        <Box sx={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {meetingData.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(meetingData.startDate).toLocaleDateString('ko-KR')} - {new Date(meetingData.endDate).toLocaleDateString('ko-KR')} · {meetingData.durationMinutes}분
          </Typography>
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
                  onClick={() => handleSetAll(dateSlot.date, true)}
                  disabled={isSubmitting}
                >
                  전체 선택
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => handleSetAll(dateSlot.date, false)}
                  disabled={isSubmitting}
                >
                  전체 해제
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
              {dateSlot.slots.map((slot) => {
                const [slotIso, time] = slot.split('|');
                if (!slotIso || !time) return null;

                const isSelected = selectedSlots[slotIso];
                const isBlocked = isBlockedSlot(dateSlot.date, time);

                return (
                  <Button
                    key={slotIso}
                    disabled={isBlocked || isSubmitting}
                    onClick={() => !isBlocked && toggleSlot(slotIso)}
                    variant={isSelected ? 'contained' : 'outlined'}
                    sx={{
                      padding: '0.75rem',
                      border: isSelected ? '3px solid #4caf50' : '2px solid #e0e0e0',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#e8f5e9' : 'white',
                      color: isSelected ? '#2e7d32' : '#333',
                      fontWeight: 'bold',
                      opacity: isBlocked ? 0.4 : 1,
                      fontSize: '0.875rem',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: isBlocked ? 'none' : 'scale(1.05)',
                      },
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
            disabled={isSubmitting || Object.keys(selectedSlots).length === 0}
          >
            {isSubmitting ? '생성 중...' : `회의 생성 (${Object.keys(selectedSlots).length}개 선택)`}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
