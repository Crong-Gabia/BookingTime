import { Card, CardContent, CardActions, Typography, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from '@mui/material';
import ProgressBar from './progress-bar';

interface MeetingCardProps {
  title: string;
  date: string;
  responseRate: number;
  totalParticipants: number;
  respondedParticipants: number;
  onClick: () => void;
}

export default function MeetingCard({
  title,
  date,
  responseRate,
  totalParticipants,
  respondedParticipants,
  onClick,
}: MeetingCardProps) {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {date}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <ProgressBar
            value={responseRate}
            label="응답률"
            color={responseRate === 100 ? 'success' : responseRate >= 50 ? 'primary' : 'warning'}
          />
        </Box>
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            참석자:
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {respondedParticipants}/{totalParticipants}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button endIcon={<ArrowForwardIcon />} size="small">
          상세 보기
        </Button>
      </CardActions>
    </Card>
  );
}
