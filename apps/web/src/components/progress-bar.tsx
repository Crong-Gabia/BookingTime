import { LinearProgress, Typography, Box } from '@mui/material';

interface ProgressBarProps {
  value: number; // 0 ~ 100
  color?: 'primary' | 'success' | 'warning' | 'error';
  label?: string;
}

export default function ProgressBar({ value, color = 'primary', label }: ProgressBarProps) {
  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {value}%
          </Typography>
        </Box>
      )}
      <LinearProgress variant="determinate" value={value} color={color} />
    </Box>
  );
}
