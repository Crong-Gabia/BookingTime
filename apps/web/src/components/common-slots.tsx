import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Chip } from '@mui/material';
import { useState } from 'react';

interface CommonSlot {
  date: string;
  times: string[];
}

interface CommonSlotsProps {
  slots: CommonSlot[];
  onSelectSlot: (date: string, time: string) => void;
}

export default function CommonSlots({ slots, onSelectSlot }: CommonSlotsProps) {
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatDisplayTime = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        return isoString;
      }
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Seoul',
      });
    } catch {
      return isoString;
    }
  };

  const handleSlotClick = (date: string, time: string) => {
    setSelectedSlot({ date, time });
    onSelectSlot(date, time);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        모두 가능한 시간
      </Typography>
      <List>
        {slots.map((slot) => (
          <Box key={slot.date} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {formatDisplayDate(slot.date)}
            </Typography>
            {slot.times.map((time) => {
              const isSelected =
                selectedSlot?.date === slot.date && selectedSlot?.time === time;
              return (
                <ListItem key={time} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => handleSlotClick(slot.date, time)}
                    sx={{
                      border: '1px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                      },
                    }}
                  >
                    <ListItemText primary={formatDisplayTime(time)} />
                    {isSelected && (
                      <Chip label="선택됨" size="small" color="primary" />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        ))}
        {slots.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            공통 가능한 시간이 없습니다.
          </Typography>
        )}
      </List>
    </Box>
  );
}
