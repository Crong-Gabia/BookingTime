import { useQuery } from '@tanstack/react-query';
import { getAllMeetings, type Meeting } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import MeetingCard from '@/components/meeting-card';
import FloatingButton from '@/components/floating-button';
import { checkHealth } from '@/api';

export default function HomePage() {
  const navigate = useNavigate();

  const { data: healthData, error, isLoading: healthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
  });

  const { data: meetingsData, isLoading: meetingsLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: getAllMeetings,
    retry: false,
  });

  const activeMeetings = meetingsData?.meetings?.filter(m => m.status !== 'CONFIRMED') || [];
  const completedMeetings = meetingsData?.meetings?.filter(m => m.status === 'CONFIRMED') || [];

  const handleCreateMeeting = () => {
    navigate('/requests/new');
  };

  if (healthLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  if (error && !healthData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          WhatTime - 회의 예약 시스템
        </Typography>
        <Typography color="error">서버 연결 실패</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          WhatTime
        </Typography>
      </Box>

      {healthData && (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600}>
          빠른 시작
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/requests/new')}
            startIcon={<span>+</span>}
          >
            새 회의 일정 만들기
          </Button>
        </Box>
      </Box>
      )}

      <Typography variant="h6" gutterBottom fontWeight={600}>
        진행 중인 회의
      </Typography>
      {activeMeetings.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          진행 중인 회의가 없습니다.
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {activeMeetings.map((meeting) => (
            <Grid item xs={12} md={6} key={meeting.id}>
              <MeetingCard
                title={meeting.title}
                date={new Date(meeting.createdAt).toLocaleDateString('ko-KR')}
                responseRate={meeting.responseRate}
                totalParticipants={5}
                respondedParticipants={Math.round(5 * meeting.responseRate / 100)}
                onClick={() => navigate(`/requests/${meeting.id}/dashboard`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="h6" gutterBottom fontWeight={600}>
        완료된 회의
      </Typography>
      {completedMeetings.length === 0 ? (
        <Typography color="text.secondary">
          완료된 회의가 없습니다.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {completedMeetings.map((meeting) => (
            <Grid item xs={12} md={6} key={meeting.id}>
              <MeetingCard
                title={meeting.title}
                date={new Date(meeting.createdAt).toLocaleDateString('ko-KR')}
                responseRate={100}
                totalParticipants={5}
                respondedParticipants={5}
                onClick={() => navigate(`/requests/${meeting.id}/dashboard`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <FloatingButton onClick={handleCreateMeeting} />
    </Container>
  );
}
