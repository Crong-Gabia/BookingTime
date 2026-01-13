import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface FloatingButtonProps {
  onClick: () => void;
  label?: string;
}

export default function FloatingButton({ onClick, label }: FloatingButtonProps) {
  return (
    <Fab
      color="primary"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        boxShadow: 4,
      }}
      aria-label={label || '새 일정 만들기'}
    >
      <AddIcon />
    </Fab>
  );
}
