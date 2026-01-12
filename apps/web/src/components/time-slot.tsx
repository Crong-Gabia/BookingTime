import { Button } from '@mui/material';

type TimeSlotStatus = 'available' | 'unavailable' | 'blocked';

interface TimeSlotProps {
  time: string;
  status: TimeSlotStatus;
  onClick: () => void;
  blockedReason?: string;
}

export default function TimeSlot({ time, status, onClick, blockedReason }: TimeSlotProps) {
  const isBlocked = status === 'blocked';

  const getStatusStyle = () => {
    switch (status) {
      case 'available':
        return {
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          border: '2px solid #4caf50',
        };
      case 'unavailable':
        return {
          backgroundColor: '#ffcdd2',
          color: '#d32f2f',
          border: '2px solid #f44336',
          textDecoration: 'line-through',
        };
      case 'blocked':
        return {
          backgroundColor: '#eeeeee',
          color: '#9e9e9e',
          border: '2px solid #e0e0e0',
          opacity: 0.5,
          cursor: 'not-allowed',
        };
      default:
        return {
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '2px solid #ddd',
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
          <div style={{ fontSize: '0.7rem', color: '#9e9e9e' }}>
            {blockedReason}
          </div>
        )}
      </div>
    </Button>
  );
}
