import { Box, Button } from '@mui/material';

interface StickyActionBarProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  selectedCount?: number;
}

export default function StickyActionBar({
  label,
  disabled = false,
  onClick,
  selectedCount,
}: StickyActionBarProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'background.paper',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        p: 2,
        zIndex: 1000,
      }}
    >
      <Button
        variant="contained"
        fullWidth
        disabled={disabled}
        onClick={onClick}
        size="large"
        sx={{
          py: 1.5,
          fontSize: '1rem',
        }}
      >
        {selectedCount !== undefined && selectedCount > 0
          ? `${label} (${selectedCount}개 선택)`
          : label}
      </Button>
    </Box>
  );
}
