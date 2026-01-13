import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmMeetingDto } from '@shared/dto';
import { confirmMeeting, fetchDashboard, sendReminder } from '@/api';
import ParticipantList from '@/components/participant-list';
import CommonSlots from '@/components/common-slots';
import RoomSelector from '@/components/room-selector';
import SectionHeader from '@/components/section-header';
import { Container, Grid, Box, Button, Typography, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';

const mockRooms = [
  { id: '1', name: '1층 회의실 A', capacity: 10 },
  { id: '2', name: '1층 회의실 B', capacity: 8 },
  { id: '3', name: '2층 대회의실', capacity: 20 },
];

export default function DashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
        alert('독촉 알림을 보냈습니다.');
      } else {
        alert('10분 내에 이미 알림을 보냈습니다.');
      }
    },
    onError: () => {
      alert('알림 전송에 실패했습니다.');
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (dto: ConfirmMeetingDto) => confirmMeeting(dto),
    onSuccess: () => {
      alert('회의가 확정되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['dashboard', id] });
      navigate('/');
    },
    onError: (error: Error) => {
      alert(`확정 실패: ${error.message}`);
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
      alert('확정할 시간을 선택해주세요.');
      return;
    }

    if (!id) {
      return;
    }

    confirmMutation.mutate({
      requestId: id,
      selectedTimeSlot,
      location: mockRooms.find(r => r.id === selectedRoomId)?.name || undefined,
    });
  };

  const handleCopyLink = () => {
    const responseLink = `${window.location.origin}/requests/${id}/respond`;
    navigator.clipboard.writeText(responseLink);
    alert('응답 링크가 복사되었습니다!');
  };

  const handleShare = async () => {
    const responseLink = `${window.location.origin}/requests/${id}/respond`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.title || '회의 일정',
          text: `${data?.title || '회의 일정'}에 참석해주세요.`,
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
    ? Math.round((data.participants.filter((p) => p.responded).length / data.participants.length) * 100)
    : 0;
  const respondedCount = data.participants.filter((p) => p.responded).length;
  const totalCount = data.participants.length;

  const participants = data.participants.map(p => ({
    id: p.userId,
    name: p.name,
    department: '팀',
    status: p.responded ? 'responded' as const : 'pending' as const,
  }));

  const commonSlots = data.commonAvailableSlots.map(slot => {
    const date = new Date(slot);
    return {
      date: date.toISOString().split('T')[0],
      times: [slot],
    };
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SectionHeader title={data.title} subtitle="주최자 대시보드" />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: 'grey.50', p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              응답 현황 ({respondedCount}/{totalCount}, {responseRate}%)
            </Typography>
            <ParticipantList
              participants={participants}
              onRemind={handleRemind}
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                링크 공유
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyLink}
                >
                  링크 복사
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                >
                  공유
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: 'primary.light', p: 3, borderRadius: 2 }}>
            <SectionHeader title="공통 가능 시간" subtitle="시간을 선택하고 확정하세요" />
            
            {commonSlots.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                아직 모든 참석자가 응답하지 않았거나 가능한 시간이 없습니다.
              </Alert>
            ) : (
              <>
                <CommonSlots
                  slots={commonSlots}
                  onSelectSlot={(date, time) => setSelectedTimeSlot(time)}
                />
                
                <Box sx={{ mt: 3 }}>
                  <RoomSelector
                    rooms={mockRooms}
                    selectedRoomId={selectedRoomId}
                    onChange={setSelectedRoomId}
                  />
                  
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleConfirm}
                    disabled={confirmMutation.isPending || !selectedTimeSlot}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {confirmMutation.isPending ? '확정 중...' : '최종 확정'}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
