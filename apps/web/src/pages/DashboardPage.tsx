import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface DashboardData {
  requestId: string;
  title: string;
  status: string;
  participants: Array<{ userId: string; name: string; responded: boolean; }>;
  commonAvailableSlots: string[];
  createdAt: string;
  durationMinutes: number;
}

interface ConfirmMeetingDto {
  requestId: string;
  selectedTimeSlot: string;
  location?: string;
}

async function fetchDashboard(requestId: string): Promise<DashboardData> {
  const response = await fetch(`/api/meetings/${requestId}/dashboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard');
  }
  return response.json();
}

async function sendRemind(requestId: string, userId: string): Promise<{ userId: string; sent: boolean; }> {
  const response = await fetch(`/api/meetings/${requestId}/remind/${userId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to send reminder');
  }
  return response.json();
}

async function confirmMeeting(dto: ConfirmMeetingDto) {
  const response = await fetch('/api/meetings/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to confirm meeting');
  }
  return response.json();
}

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
  const [selectedLocation, setSelectedLocation] = useState('');

  const remindMutation = useMutation({
    mutationFn: (userId: string) => sendRemind(id || '', userId),
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
    remindMutation.mutate(userId);
  };

  const handleConfirm = async () => {
    if (!selectedTimeSlot) {
      alert('확정할 시간을 선택해주세요.');
      return;
    }

    confirmMutation.mutate({
      requestId: id || '',
      selectedTimeSlot,
      location: selectedLocation || undefined,
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

  if (isLoading) return <div style={{ padding: '2rem' }}>로딩 중...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>에러 발생</div>;
  if (!data) return null;

  const responseRate = data.participants.length > 0
    ? Math.round((data.participants.filter((p) => p.responded).length / data.participants.length) * 100)
    : 0;
  const respondedCount = data.participants.filter((p) => p.responded).length;
  const totalCount = data.participants.length;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>{data.title}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>응답 현황</h2>
          <div style={{ marginBottom: '1rem' }}>
            <strong>응답률:</strong> {respondedCount}/{totalCount} ({responseRate}%)
          </div>
          <ul style={{ listStyle: 'none', padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
            {data.participants.map((participant) => (
              <li
                key={participant.userId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: 'white',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                }}
              >
                <div>
                  <strong>{participant.name}</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#666' }}>
                    ({participant.userId})
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {participant.responded ? (
                    <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✅ 응답 완료</span>
                  ) : (
                    <>
                      <span style={{ color: '#f44336' }}>⏳ 대기 중</span>
                      <button
                        onClick={() => handleRemind(participant.userId)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#2196f3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        독촉
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '1rem' }}>
            <strong>공유:</strong>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={handleCopyLink}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                링크 복사
              </button>
              <button
                onClick={handleShare}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                공유
              </button>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#e3f2fd', padding: '1.5rem', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>공통 가능 시간</h2>
          {data.commonAvailableSlots.length === 0 ? (
            <p style={{ color: '#666' }}>
              아직 모든 참석자가 응답하지 않았거나 가능한 시간이 없습니다.
            </p>
          ) : (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  ※ {data.durationMinutes}분 동안 가능한 시간만 표시됩니다.
                </p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
                {data.commonAvailableSlots.map((slot) => (
                  <li
                    key={slot}
                    onClick={() => setSelectedTimeSlot(slot)}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: selectedTimeSlot === slot ? '#1976d2' : 'white',
                      border: selectedTimeSlot === slot ? '2px solid #1976d2' : '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: selectedTimeSlot === slot ? 'bold' : 'normal' }}>
                      {new Date(slot).toLocaleString('ko-KR', {
                        month: 'numeric',
                        day: 'numeric',
                        weekday: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  회의실 선택 (선택사항)
                </label>
                <input
                  type="text"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  placeholder="예: 1층 회의실 A"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                />

                <button
                  onClick={handleConfirm}
                  disabled={confirmMutation.isPending || !selectedTimeSlot}
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    cursor: confirmMutation.isPending || !selectedTimeSlot ? 'not-allowed' : 'pointer',
                    opacity: confirmMutation.isPending || !selectedTimeSlot ? 0.7 : 1,
                    fontWeight: 'bold',
                  }}
                >
                  {confirmMutation.isPending ? '확정 중...' : '최종 확정'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
