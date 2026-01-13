import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, TextField, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <IconButton onClick={() => navigate('/')} color="inherit">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            새 회의 일정 만들기
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        <TextField
          fullWidth
          label="제목 *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 팀 주간회의"
          sx={{ mb: 3 }}
          disabled={isSubmitting}
        />

        <TextField
          fullWidth
          label="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="회의에 대한 간단한 설명"
          multiline
          rows={3}
          sx={{ mb: 3 }}
          disabled={isSubmitting}
        />

        <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
          참석자 *
        </Typography>
        <Box sx={{ mb: 3 }}>
          {participants.map((participant, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                type="email"
                label="이메일"
                value={participant.email}
                onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                sx={{ flex: 1 }}
                disabled={isSubmitting}
              />
              <TextField
                type="text"
                label="이름"
                value={participant.name}
                onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                sx={{ flex: 1 }}
                disabled={isSubmitting}
              />
              {participants.length > 1 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveParticipant(index)}
                  disabled={isSubmitting}
                >
                  삭제
                </Button>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddParticipant}
            startIcon={<span>+</span>}
            disabled={isSubmitting}
          >
            참석자 추가
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
          <TextField
            type="date"
            label="시작일 *"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={isSubmitting}
          />
          <TextField
            type="date"
            label="종료일 *"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={isSubmitting}
          />
          <TextField
            select
            label="소요시간 *"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            disabled={isSubmitting}
          >
            <option value={30}>30분</option>
            <option value={60}>1시간</option>
            <option value={90}>1시간 30분</option>
            <option value={120}>2시간</option>
            <option value={180}>3시간</option>
          </TextField>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        >
          {isSubmitting ? '생성 중...' : '회의 요청 생성'}
        </Button>

        <Box sx={{ p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            💡 참고
          </Typography>
          <Typography variant="body2" component="div">
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>회의 시간은 09:00-18:00 사이 30분 단위로만 가능합니다.</li>
              <li>점심시간(12:00-13:00)은 자동으로 제외됩니다.</li>
              <li>생성 후 대시보드에서 참석자들에게 응답 링크를 공유하세요.</li>
              <li>주말은 제외됩니다.</li>
            </ul>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
