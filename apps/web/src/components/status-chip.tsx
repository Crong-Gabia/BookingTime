import { Chip } from '@mui/material';

interface StatusChipProps {
  status: 'success' | 'warning' | 'error' | 'default' | 'blocked';
  label: string;
  size?: 'small' | 'medium';
}

export default function StatusChip({
  status,
  label,
  size = 'medium',
}: StatusChipProps) {
  const colorMap = {
    success: 'success' as const,
    warning: 'warning' as const,
    error: 'error' as const,
    default: 'default' as const,
    blocked: 'default' as const,
  };

  return (
    <Chip
      label={label}
      color={colorMap[status]}
      size={size}
      sx={{
        fontWeight: 500,
        ...(status === 'blocked' && {
          opacity: 0.5,
        }),
      }}
    />
  );
}
