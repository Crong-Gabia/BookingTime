import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Box, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';

interface Participant {
  id: string;
  name: string;
  department: string;
  status: 'responded' | 'pending';
}

interface ParticipantListProps {
  participants: Participant[];
  onRemind: (userId: string) => void;
}

export default function ParticipantList({ participants, onRemind }: ParticipantListProps) {
  return (
    <List>
      {participants.map((participant) => (
        <ListItem
          key={participant.id}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            mb: 1,
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={participant.name}
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{participant.department}</span>
                {participant.status === 'responded' ? (
                  <CheckCircleIcon
                    color="success"
                    fontSize="small"
                    sx={{ verticalAlign: 'middle' }}
                  />
                ) : (
                  <ScheduleIcon
                    color="disabled"
                    fontSize="small"
                    sx={{ verticalAlign: 'middle' }}
                  />
                )}
              </Box>
            }
          />
          {participant.status === 'pending' && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => onRemind(participant.id)}
            >
              재요청
            </Button>
          )}
        </ListItem>
      ))}
    </List>
  );
}
