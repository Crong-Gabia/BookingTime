import { Button, useTheme } from '@mui/material';

type TimeSlotStatus = 'available' | 'unavailable' | 'blocked';

interface TimeSlotProps {
  time: string;
  status: TimeSlotStatus;
  onClick: () => void;
  blockedReason?: string;
}

export default function TimeSlot({ time, status, onClick, blockedReason }: TimeSlotProps) {
  const theme = useTheme();
  const isBlocked = status === 'blocked';

  const getStatusStyle = () => {
    switch (status) {
      case 'available':
        return {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.dark,
          border: `2px solid ${theme.palette.success.main}`,
        };
      case 'unavailable':
        return {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.dark,
          border: `2px solid ${theme.palette.error.main}`,
          textDecoration: 'line-through',
        };
      case 'blocked':
        return {
          backgroundColor: theme.palette.action.disabledBackground,
          color: theme.palette.text.disabled,
          border: `2px solid ${theme.palette.divider}`,
          opacity: 0.5,
          cursor: 'not-allowed',
        };
      default:
        return {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `2px solid ${theme.palette.divider}`,
        };
    }
  };

  return (
    <Button
      onClick={isBlocked ? undefined : onClick}
      disabled={isBlocked}
      sx={{
        minWidth: 80,
        minHeight: 50,
        m: 0.5,
        fontWeight: 'bold',
        borderRadius: 1,
        ...getStatusStyle(),
        ...(!isBlocked && {
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s',
          },
        }),
      }}
    >
      <div>
        <div>{time}</div>
        {isBlocked && blockedReason && (
          <div style={{ fontSize: '0.7rem', color: theme.palette.text.disabled }}>
            {blockedReason}
          </div>
        )}
      </div>
    </Button>
  );
}
