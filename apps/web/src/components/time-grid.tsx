import { Box, Typography, Button, Stack } from '@mui/material';
import TimeSlot from './time-slot';

interface Slot {
  time: string;
  status: 'available' | 'unavailable' | 'blocked';
  blockedReason?: string;
}

interface TimeGridProps {
  date: string;
  slots: Slot[];
  onSlotClick: (time: string) => void;
  onToggleAllAvailable?: () => void;
  onToggleAllUnavailable?: () => void;
}

export default function TimeGrid({
  date,
  slots,
  onSlotClick,
  onToggleAllAvailable,
  onToggleAllUnavailable,
}: TimeGridProps) {
  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {formatDisplayDate(date)}
        </Typography>
        {onToggleAllAvailable && onToggleAllUnavailable && (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={onToggleAllAvailable}
            >
              전체 가능
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={onToggleAllUnavailable}
            >
              전체 불가
            </Button>
          </Stack>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          p: 2,
          backgroundColor: 'grey.50',
          borderRadius: 2,
        }}
      >
        {slots.map((slot) => (
          <TimeSlot
            key={slot.time}
            time={slot.time}
            status={slot.status}
            blockedReason={slot.blockedReason}
            onClick={() => onSlotClick(slot.time)}
          />
        ))}
      </Box>
    </Box>
  );
}
