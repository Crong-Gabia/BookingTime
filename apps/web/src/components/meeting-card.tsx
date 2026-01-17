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
  meetingType?: 'GENERAL' | 'COMPANY_DINNER';
  mealTime?: 'LUNCH' | 'DINNER' | null;
  onClick: () => void;
}

export default function MeetingCard({
  title,
  date,
  responseRate,
  totalParticipants,
  respondedParticipants,
  meetingType,
  mealTime,
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
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {meetingType && (
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {meetingType === 'COMPANY_DINNER' ? '회식' : '일반'}
            </Typography>
          )}
          {mealTime && (
            <Typography variant="caption" color="text.secondary">
              {mealTime === 'LUNCH' ? '점심 12~13시' : '저녁 18~20시'}
            </Typography>
          )}
        </Box>
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
