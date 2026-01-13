import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface TimeSlotData {
  date: string;
  slots: string[];
}

export default function ResponsePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [availableSlots, setAvailableSlots] = useState<Set<string>>(new Set());
  const [unavailableSlots, setUnavailableSlots] = useState<Set<string>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startDate = new Date('2026-01-20');
  const endDate = new Date('2026-01-24');

  const generateDateRange = (): string[] => {
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(current.toISOString());
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const generateSlots = (): TimeSlotData[] => {
    const dates = generateDateRange();
    const result: TimeSlotData[] = [];

    for (const date of dates) {
      const slots: string[] = [];

      for (let hour = 9; hour < 18; hour++) {
        if (hour === 12) continue;

        for (let minute = 0; minute < 60; minute += 30) {
          const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          slots.push(timeStr);
        }
      }

      result.push({ date, slots });
    }

    return result;
  };

  const isBlockedSlot = (date: string, time: string): boolean => {
    const hour = parseInt(time.split(':')[0]);
    const dayOfWeek = new Date(date).getDay();
    return hour === 12 || dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isSlotAvailable = (date: string, time: string): boolean => {
    const key = `${date}-${time}`;
    if (availableSlots.has(key)) {
      return true;
    }
    if (unavailableSlots.has(key)) {
      return false;
    }
    return true;
  };

  const toggleSlot = (date: string, time: string) => {
    const key = `${date}-${time}`;

    if (availableSlots.has(key)) {
      setAvailableSlots(new Set([...availableSlots].filter((k) => k !== key)));
    } else if (unavailableSlots.has(key)) {
      setUnavailableSlots(new Set([...unavailableSlots].filter((k) => k !== key)));
    } else {
      setAvailableSlots(new Set([...availableSlots, key]));
    }
  };

  const handleSetAllAvailable = (date: string) => {
    const dateSlots = generateSlots().find((ds) => ds.date === date);
    if (!dateSlots) return;

    dateSlots.slots.forEach((time) => {
      const key = `${date}-${time}`;
      if (!isBlockedSlot(date, time)) {
        setAvailableSlots(new Set([...availableSlots, key]));
        setUnavailableSlots(new Set([...unavailableSlots].filter((k) => k !== key)));
      }
    });
  };

  const handleSetAllUnavailable = (date: string) => {
    const dateSlots = generateSlots().find((ds) => ds.date === date);
    if (!dateSlots) return;

    dateSlots.slots.forEach((time) => {
      const key = `${date}-${time}`;
      if (!isBlockedSlot(date, time)) {
        setUnavailableSlots(new Set([...unavailableSlots, key]));
        setAvailableSlots(new Set([...availableSlots].filter((k) => k !== key)));
      }
    });
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!name) {
        throw new Error('이름을 입력해주세요.');
      }

      const response = await fetch(`/api/meetings/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: `user-${id}`,
          name,
          availableSlots: Array.from(availableSlots),
          unavailableSlots: Array.from(unavailableSlots),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit');
      }

      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error: Error) => {
      alert(`제출 실패: ${error.message}`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = () => {
    if (availableSlots.size === 0 && unavailableSlots.size === 0) {
      alert('최소 하나 이상의 시간을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    submitMutation.mutate();
  };

  const timeSlotData = generateSlots();

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
              {dateSlot.slots.map((time) => {
                const isAvailable = isSlotAvailable(dateSlot.date, time);
                const isUnavailable = !isAvailable;
                const isBlocked = isBlockedSlot(dateSlot.date, time);

                return (
                  <Button
                    key={time}
                    disabled={isBlocked || isSubmitting}
                    onClick={() => !isBlocked && toggleSlot(dateSlot.date, time)}
                    variant={isAvailable ? 'contained' : isUnavailable ? 'contained' : 'outlined'}
                    sx={{
                      padding: '0.75rem',
                      border: isAvailable ? '3px solid #4caf50' : isUnavailable ? '3px solid #f44336' : '2px solid #e0e0e0',
                      borderRadius: '8px',
                      backgroundColor: isAvailable ? '#e8f5e9' : isUnavailable ? '#ffebee' : 'white',
                      color: isAvailable ? '#2e7d32' : isUnavailable ? '#c62828' : '#333',
                      fontWeight: 'bold',
                      opacity: isBlocked ? 0.4 : 1,
                      fontSize: '0.875rem',
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
            disabled={isSubmitting || (availableSlots.size === 0 && unavailableSlots.size === 0)}
          >
            {isSubmitting ? '제출 중...' : `제출하기 (${availableSlots.size}개 선택)`}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
