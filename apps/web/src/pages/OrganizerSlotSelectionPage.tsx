import { useState, useEffect, useCallback } from 'react';
import { generateTimeSlots, formatDateDisplay } from '../utils/timeSlot';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { alpha } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';

// Temporary blocking logic - can be enhanced with external adapters later
const isBlockedSlot = (_date: string, time: string, meetingType?: 'general' | 'company_dinner') => {
  if (meetingType === 'company_dinner') return false;
  if (time.startsWith('12:')) return true;
  return false;
};

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
  responseDeadlineAt?: string | null;
  meetingType?: 'general' | 'company_dinner';
  mealTime?: 'lunch' | 'dinner' | '';
}

export default function OrganizerSlotSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const meetingData = location.state?.meetingData as MeetingFormData;

  const [selectedSlots, setSelectedSlots] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const meetingType = meetingData?.meetingType ?? 'general';
  const mealTime = meetingData?.mealTime ?? '';

  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getMealTimeRange = useCallback((value: typeof mealTime) => {
    if (value === 'lunch') {
      return { start: 12 * 60, end: 13 * 60 };
    }

    if (value === 'dinner') {
      return { start: 18 * 60, end: 20 * 60 };
    }

    return null;
  }, []);

  const filterSlotsForMealTime = useCallback((slots: string[]) => {
    if (meetingType !== 'company_dinner' || !mealTime) {
      return slots;
    }

    const range = getMealTimeRange(mealTime);
    if (!range) {
      return [];
    }

    return slots.filter((slot) => {
      const [, time] = slot.split('|');
      if (!time) return false;
      const minutes = toMinutes(time);
      return minutes >= range.start && minutes < range.end;
    });
  }, [meetingType, mealTime, getMealTimeRange]);

  const buildTimeSlotData = useCallback(() => {
    const baseSlots = generateTimeSlots(meetingData?.startDate || '', meetingData?.endDate || '');

    if (meetingType !== 'company_dinner') {
      return baseSlots;
    }

    return baseSlots
      .map((dateSlot) => ({
        ...dateSlot,
        slots: filterSlotsForMealTime(dateSlot.slots),
      }))
      .filter((dateSlot) => dateSlot.slots.length > 0);
  }, [meetingData?.startDate, meetingData?.endDate, meetingType, filterSlotsForMealTime]);

  useEffect(() => {
    if (!meetingData || !meetingData.title || !meetingData.startDate || !meetingData.endDate) {
      toast.error('만남 정보가 없습니다. 다시 생성해주세요.');
      navigate('/new');
      return;
    }

    if (meetingType === 'company_dinner' && !mealTime) {
      toast.error('회식인 경우 식사 시간을 선택해주세요.');
      navigate('/requests/new');
      return;
    }

    const timeSlotData = buildTimeSlotData();
    if (timeSlotData.length > 0 && !selectedDate) {
      setSelectedDate(timeSlotData[0].date);
    }
  }, [meetingData, meetingType, mealTime, navigate, selectedDate, buildTimeSlotData, toast]);

  const timeSlotData = buildTimeSlotData();

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
        if (isBlockedSlot(date, time, meetingType)) return;
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
      toast.error('최소 하나 이상의 시간을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const mappedMeetingType = meetingType === 'company_dinner' ? 'COMPANY_DINNER' : 'GENERAL';
      const mappedMealTime = mealTime === 'lunch' ? 'LUNCH' : mealTime === 'dinner' ? 'DINNER' : null;

      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...meetingData,
          meetingType: mappedMeetingType,
          mealTime: mappedMealTime,
          organizerAvailableSlots: Object.keys(selectedSlots),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create meeting');
      }

      const data = await response.json();
      toast.success('만남 요청이 생성되었습니다!');
      navigate(`/requests/${data.id}/dashboard`);
    } catch {
      toast.error('만남 요청 생성에 실패했습니다.');
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

  const formatRangeDisplay = (startDateIso: string, endDateIso: string) => {
    const startDate = new Date(startDateIso);
    const endDate = new Date(endDateIso);

    const startStr = startDate.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
    const endStr = endDate.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });

    if (startStr === endStr) {
      return startStr;
    }

    return `${startStr} - ${endStr}`;
  };

  const getSelectedCountForDate = (date: string) => {
    const dateSlots = timeSlotData.find((ds) => ds.date === date);
    if (!dateSlots) return 0;

    return dateSlots.slots.filter((slot) => {
      const [slotIso] = slot.split('|');
      return slotIso && selectedSlots[slotIso];
    }).length;
  };

  const selectedDateSlots = selectedDate ? timeSlotData.find((ds) => ds.date === selectedDate) : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
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

      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
          가능한 시간 선택
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          만남을 진행할 수 있는 시간을 모두 선택해주세요.
        </Typography>

        <Grid container spacing={2.5} sx={{ mb: 8 }}>
          <Grid item xs={12} md={2.5}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                height: 'fit-content',
                position: 'sticky',
                top: 80,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                만남 정보
              </Typography>
              <Divider sx={{ mb: 2, borderColor: 'divider' }} />

              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <EventIcon sx={{ mr: 1.25, mt: 0.25, color: 'primary.main', fontSize: 18 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      일정 기간
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatRangeDisplay(meetingData.startDate, meetingData.endDate)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <AccessTimeIcon sx={{ mr: 1.25, mt: 0.25, color: 'primary.main', fontSize: 18 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      소요 시간
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {meetingData.durationMinutes}분
                    </Typography>
                  </Box>
                </Box>

                {meetingData.description && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <DescriptionIcon sx={{ mr: 1.25, mt: 0.25, color: 'primary.main', fontSize: 18 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        설명
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {meetingData.description}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <PeopleIcon sx={{ mr: 1.25, mt: 0.25, color: 'primary.main', fontSize: 18 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      참석자 ({meetingData.participantIds.length}명)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {meetingData.participantIds.map((participant, idx) => (
                        <Chip
                          key={idx}
                          label={participant}
                          size="small"
                          variant="outlined"
                          sx={{ height: 24, fontSize: '0.75rem', '& .MuiChip-label': { px: 0.75 } }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  borderRadius: 1.5,
                  p: 2,
                  border: '1px solid',
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                }}
              >
                <Typography variant="body2" color="primary.dark" fontWeight={600}>
                  {Object.keys(selectedSlots).length}개 시간 선택됨
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                날짜 선택
              </Typography>
              <Divider sx={{ mb: 2, borderColor: 'divider' }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                시간을 선택할 날짜를 클릭하세요.
              </Typography>

              <Grid container spacing={1.25}>
                {timeSlotData.map((dateSlot) => {
                  const selectedCount = getSelectedCountForDate(dateSlot.date);
                  const isSelected = selectedDate === dateSlot.date;

                  return (
                    <Grid item xs={4} sm={3} key={dateSlot.date}>
                      <Paper
                        elevation={0}
                        onClick={() => setSelectedDate(dateSlot.date)}
                        sx={{
                          p: 1.25,
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'primary.main' : 'grey.50',
                          color: isSelected ? 'primary.contrastText' : 'text.primary',
                          border: '1.5px solid',
                          borderColor: isSelected ? 'primary.main' : selectedCount > 0 ? 'success.main' : 'transparent',
                          borderRadius: 1.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: isSelected ? 'primary.dark' : 'grey.100',
                            transform: 'scale(1.03)',
                          },
                          position: 'relative',
                        }}
                      >
                        <Typography
                          variant="caption"
                          display="block"
                          fontWeight={500}
                          sx={{ opacity: 0.9 }}
                        >
                          {new Date(dateSlot.date).toLocaleDateString('ko-KR', { weekday: 'short' })}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
                          {new Date(dateSlot.date).getDate()}
                        </Typography>
                        {selectedCount > 0 && (
                          <Chip
                            size="small"
                            label={selectedCount}
                            sx={{
                              position: 'absolute',
                              top: -6,
                              right: -6,
                              height: 18,
                              minWidth: 18,
                              fontSize: '0.625rem',
                              fontWeight: 700,
                              backgroundColor: 'success.main',
                              color: 'primary.contrastText',
                              boxShadow: 4,
                              '& .MuiChip-label': { px: 0.5 },
                            }}
                          />
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4.5}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                minHeight: 400,
              }}
            >
              {selectedDateSlots ? (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {formatDateDisplay(selectedDateSlots.date)}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleSetAll(selectedDateSlots.date, true)}
                        disabled={isSubmitting}
                        sx={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          height: 32,
                          borderColor: 'divider',
                          '&:hover': { borderColor: 'primary.main' },
                        }}
                      >
                        전체 선택
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleSetAll(selectedDateSlots.date, false)}
                        disabled={isSubmitting}
                        sx={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          height: 32,
                          borderColor: 'divider',
                          '&:hover': { borderColor: 'primary.main' },
                        }}
                      >
                        전체 해제
                      </Button>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2, borderColor: 'divider' }} />

                  <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
                    {selectedDateSlots.slots.map((slot) => {
                      const [slotIso, time] = slot.split('|');
                      if (!slotIso || !time) return null;

                      const isSelected = selectedSlots[slotIso];
                      const isBlocked = isBlockedSlot(selectedDateSlots.date, time, meetingType);

                      return (
                        <Button
                          key={slotIso}
                          disabled={isBlocked || isSubmitting}
                          onClick={() => !isBlocked && toggleSlot(slotIso)}
                          variant="outlined"
                          sx={{
                            height: 52,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            border: '2px solid',
                            borderColor: isSelected ? 'success.main' : 'divider',
                            backgroundColor: isSelected ? 'success.main' : 'background.paper',
                            color: isSelected ? 'success.contrastText' : 'text.primary',
                            opacity: isBlocked ? 0.3 : 1,
                            transition: 'all 0.2s ease',
                            borderRadius: 1.5,
                            '&:hover': {
                              transform: isBlocked ? 'none' : 'translateY(-1px)',
                              backgroundColor: isBlocked ? undefined : isSelected ? 'success.dark' : 'grey.50',
                              boxShadow: isBlocked ? 'none' : 3,
                              color: isBlocked ? undefined : isSelected ? 'success.contrastText' : 'text.primary',
                              borderColor: isBlocked ? undefined : isSelected ? 'success.dark' : 'primary.main',
                            },
                          }}
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <EventIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    날짜를 선택해주세요.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            zIndex: 1000,
          }}
        >
        <Container maxWidth="xl">
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(selectedSlots).length === 0}
            sx={{
              height: 56,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            {isSubmitting ? '생성 중...' : `만남 생성 (${Object.keys(selectedSlots).length}개 선택)`}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
