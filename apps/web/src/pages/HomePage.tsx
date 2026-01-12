import { useQuery } from '@tanstack/react-query';

interface Meeting {
  id: string;
  title: string;
  status: string;
  responseRate: number;
  createdAt: string;
}

async function checkHealth() {
  const response = await fetch('/api/health');
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  return response.json();
}

export default function HomePage() {
  const { data: healthData, error, isLoading: healthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
  });

  const activeMeetings: Meeting[] = [];
  const completedMeetings: Meeting[] = [];

  const handleCreateMeeting = () => {
    window.location.href = '/requests/new';
  };

  if (healthLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>;
  }

  if (error && !healthData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>WhatTime - 회의 예약 시스템</h1>
        <p style={{ color: 'red' }}>서버 연결 실패</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>WhatTime</h1>
        <button
          onClick={handleCreateMeeting}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          + 새 일정 만들기
        </button>
      </div>

      <div style={{ color: 'green', marginBottom: '1rem' }}>
        ✅ 서버 정상 (Status: {healthData?.status})
      </div>

      <h2 style={{ marginBottom: '1rem' }}>진행 중인 조율</h2>
      {activeMeetings.length === 0 ? (
        <p style={{ color: '#666' }}>진행 중인 조율이 없습니다.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {activeMeetings.map((meeting) => (
            <div
              key={meeting.id}
              style={{
                padding: '1.5rem',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ marginTop: 0 }}>{meeting.title}</h3>
              <p style={{ margin: '0.5rem 0', color: '#666' }}>
                응답률: {meeting.responseRate}%
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  대시보드
                </button>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  확정하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>완료된 조율</h2>
      {completedMeetings.length === 0 ? (
        <p style={{ color: '#666' }}>완료된 조율이 없습니다.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {completedMeetings.map((meeting) => (
            <div
              key={meeting.id}
              style={{
                padding: '1.5rem',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: '#f5f5f5',
              }}
            >
              <h3 style={{ marginTop: 0 }}>{meeting.title}</h3>
              <p style={{ margin: '0.5rem 0', color: '#666' }}>
                상태: {meeting.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
