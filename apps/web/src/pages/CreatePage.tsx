import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ParticipantInput {
  email: string;
  name: string;
}

export default function CreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState<ParticipantInput[]>([
    { email: '', name: '' },
  ]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddParticipant = () => {
    setParticipants([...participants, { email: '', name: '' }]);
  };

  const handleRemoveParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const handleParticipantChange = (index: number, field: keyof ParticipantInput, value: string) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  const handleSubmit = async () => {
    if (!title || !startDate || !endDate) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    const validParticipants = participants.filter((p) => p.email && p.name);
    if (validParticipants.length === 0) {
      alert('최소 1명 이상의 참석자를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          organizerId: 'organizer-1',
          participantIds: validParticipants.map((p) => p.email),
          requiredParticipantIds: validParticipants.map((p) => p.email),
          startDate,
          endDate,
          durationMinutes,
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

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>새 회의 일정 만들기</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          제목 *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 팀 주간회의"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          설명
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="회의에 대한 간단한 설명"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          참석자 *
        </label>
        {participants.map((participant, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="email"
              value={participant.email}
              onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
              placeholder="이메일"
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
            <input
              type="text"
              value={participant.name}
              onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
              placeholder="이름"
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
            {participants.length > 1 && (
              <button
                onClick={() => handleRemoveParticipant(index)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                삭제
              </button>
            )}
          </div>
        ))}
        <button
          onClick={handleAddParticipant}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          + 참석자 추가
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            시작일 *
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            종료일 *
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            소요시간 *
          </label>
          <select
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            <option value={30}>30분</option>
            <option value={60}>1시간</option>
            <option value={90}>1시간 30분</option>
            <option value={120}>2시간</option>
            <option value={180}>3시간</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.7 : 1,
          fontWeight: 'bold',
        }}
      >
        {isSubmitting ? '생성 중...' : '회의 요청 생성'}
      </button>

      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1rem' }}>💡 참고</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>회의 시간은 09:00-18:00 사이 30분 단위로만 가능합니다.</li>
          <li>점심시간(12:00-13:00)은 자동으로 제외됩니다.</li>
          <li>생성 후 대시보드에서 참석자들에게 응답 링크를 공유하세요.</li>
          <li>주말은 제외됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
