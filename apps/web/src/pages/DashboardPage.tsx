import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmMeetingDto } from '@shared/dto';
import { confirmMeeting, fetchDashboard, sendReminder } from '@/api';
import { useToast } from '@/hooks/useToast';
import ParticipantList from '@/components/participant-list';
import CommonSlots from '@/components/common-slots';
import RoomSelector from '@/components/room-selector';
import SectionHeader from '@/components/section-header';
import { Container, Grid, Box, Button, Typography, AppBar, Toolbar, IconButton, Chip, Paper } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const mockRooms = [
  { id: '1', name: '1층 공간 A', capacity: 10 },
  { id: '2', name: '1층 공간 B', capacity: 8 },
  { id: '3', name: '2층 대공간', capacity: 20 },
];

export default function DashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, error, isLoading } = useQuery({
    queryKey: ['dashboard', id],
    queryFn: () => fetchDashboard(id || ''),
    enabled: !!id,
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const remindMutation = useMutation({
    mutationFn: (userId: string) => sendReminder(id || '', userId),
    onSuccess: (result) => {
      if (result.sent) {
        toast.success('독촉 알림을 보냈습니다.');
      } else {
        toast.info('10분 내에 이미 알림을 보냈습니다.');
      }
    },
    onError: () => {
      toast.error('알림 전송에 실패했습니다.');
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (dto: ConfirmMeetingDto) => confirmMeeting(dto),
    onSuccess: () => {
      toast.success('만남이 확정되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['dashboard', id] });
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(`확정 실패: ${error.message}`);
    },
  });

  const handleRemind = (userId: string) => {
    if (!id) {
      return;
    }

    remindMutation.mutate(userId);
  };

  const handleConfirm = async () => {
    if (!selectedTimeSlot) {
      toast.error('확정할 시간을 선택해주세요.');
      return;
    }

    if (!id) {
      return;
    }

    confirmMutation.mutate({
      requestId: id,
      selectedTimeSlot,
      location: mockRooms.find(r => r.id === selectedRoomId)?.name || '',
    });
  };

  const handleCopyLink = async () => {
    const responseLink = `${window.location.origin}/requests/${id}/respond`;
    try {
      await navigator.clipboard.writeText(responseLink);
      toast.success('응답 링크가 복사되었습니다!');
    } catch {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  const handleShare = async () => {
    const responseLink = `${window.location.origin}/requests/${id}/respond`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.title || '만남 일정',
          text: `${data?.title || '만남 일정'}에 참석해주세요.`,
          url: responseLink,
        });
      } catch (_error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography>로딩 중...</Typography>
    </Box>
  );
  
  if (error) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography color="error">에러 발생</Typography>
    </Box>
  );
  
  if (!data) return null;

  const responseRate = data.participants.length > 0
    ? Math.round((data.participants.filter((p: { responded: boolean }) => p.responded).length / data.participants.length) * 100)
    : 0;
  const respondedCount = data.participants.filter((p: { responded: boolean }) => p.responded).length;
  const totalCount = data.participants.length;

  const participants = data.participants.map((p: { userId: string; name: string; responded: boolean }) => ({
    id: p.userId,
    name: p.name,
    department: '팀',
    status: p.responded ? 'responded' as const : 'pending' as const,
  }));

  const commonSlots = data.commonAvailableSlots;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => navigate('/')} color="inherit">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {data.title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<ShareIcon />}
              variant="outlined"
              size="small"
              onClick={handleShare}
            >
              공유하기
            </Button>
            <Button
              startIcon={<ContentCopyIcon />}
              variant="outlined"
              size="small"
              onClick={handleCopyLink}
            >
              링크 복사
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Grid container spacing={3}>
          {/* Meeting Info */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h4" gutterBottom fontWeight={600}>
                {data.title}
              </Typography>
              {data.description && (
                <Typography variant="body1" color="text.secondary">
                  {data.description}
                </Typography>
              )}
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`참석자: ${respondedCount}/${totalCount}`}
                  color={respondedCount === totalCount ? 'success' : 'default'}
                  variant="outlined"
                />
                <Chip
                  label={`응답률: ${responseRate}%`}
                  color={responseRate >= 80 ? 'success' : responseRate >= 50 ? 'warning' : 'error'}
                  variant="outlined"
                />
              </Box>
            </Paper>
          </Grid>

          {/* Participants */}
          <Grid item xs={12} md={6}>
            <SectionHeader
              title={`참석자 (${totalCount}명)`}
              subtitle={`${respondedCount}명 응답 완료`}
            />
            <ParticipantList
              participants={participants}
              onRemind={handleRemind}
            />
          </Grid>

          {/* Common Slots */}
          <Grid item xs={12} md={6}>
            <SectionHeader
              title="가능한 시간"
              subtitle="모든 참석자가 가능한 시간대"
            />
            <CommonSlots
              slots={commonSlots}
              onSelectSlot={(_date: string, time: string) => {
                setSelectedTimeSlot(time);
              }}
            />
          </Grid>

          {/* Room Selection */}
          <Grid item xs={12}>
            <SectionHeader
          title="공간 선택"
          subtitle="확정할 시간을 선택한 후 공간을 선택하세요"
            />
            <RoomSelector
              rooms={mockRooms}
              selectedRoomId={selectedRoomId}
              onChange={setSelectedRoomId}
            />
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={confirmMutation.isPending}
              >
                취소
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={!selectedTimeSlot || !selectedRoomId || confirmMutation.isPending}
                startIcon={<ShareIcon />}
              >
                {confirmMutation.isPending ? '확정 중...' : '만남 확정'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
