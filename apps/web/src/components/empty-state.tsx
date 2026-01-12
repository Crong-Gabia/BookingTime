import { Typography, Box, Container } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';

interface EmptyStateProps {
  message: string;
  action?: React.ReactNode;
}

export default function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <SentimentDissatisfied sx={{ fontSize: 64, color: 'text.disabled' }} />
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
        {action}
      </Box>
    </Container>
  );
}
