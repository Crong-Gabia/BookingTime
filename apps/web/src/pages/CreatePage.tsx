import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, TextField, Container, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ParticipantInput {
  email: string;
  name: string;
}

const DURATION_OPTIONS = [
  { value: 30, label: '30분' },
  { value: 60, label: '1시간' },
  { value: 90, label: '1시간 30분' },
  { value: 120, label: '2시간' },
  { value: 180, label: '3시간' },
];

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

  const handleSubmit = () => {
    if (!title || !startDate || !endDate) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    const validParticipants = participants.filter((p) => p.email && p.name);
    if (validParticipants.length === 0) {
      alert('최소 1명 이상의 참석자를 입력해주세요.');
      return;
    }

    const meetingData = {
      title,
      description,
      organizerId: 'organizer-1',
      participantIds: validParticipants.map((p) => p.email),
      requiredParticipantIds: [],
      startDate,
      endDate,
      durationMinutes,
      location: '',
    };

      navigate('/requests/new/slots', {
        state: { meetingData },
      });
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
              />
              <TextField
                type="text"
                label="이름"
                value={participant.name}
                onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                sx={{ flex: 1 }}
              />
              {participants.length > 1 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveParticipant(index)}
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
          />
          <TextField
            type="date"
            label="종료일 *"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="소요시간 *"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
          >
            {DURATION_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          sx={{ mb: 2 }}
        >
          회의 요청 생성
        </Button>

        <Box sx={{ p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            💡 참고
          </Typography>
          <Typography variant="body2" component="div">
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>회의 시간은 30분 단위로 생성됩니다.</li>
              <li>시간/요일 제한은 추후 옵션으로 제공할 수 있습니다.</li>
              <li>생성 후 대시보드에서 참석자들에게 응답 링크를 공유하세요.</li>
            </ul>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
