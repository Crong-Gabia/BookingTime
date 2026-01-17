import { Box, TextField, MenuItem, Typography } from '@mui/material';

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onChange: (roomId: string) => void;
  disabled?: boolean;
}

export default function RoomSelector({
  rooms,
  selectedRoomId,
  onChange,
  disabled = false,
}: RoomSelectorProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom fontWeight={500}>
        공간 선택
      </Typography>
      <TextField
        select
        fullWidth
        value={selectedRoomId || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        helperText="확정할 공간을 선택하세요"
      >
        <MenuItem value="">
          <em>선택 안함</em>
        </MenuItem>
        {rooms.map((room) => (
          <MenuItem key={room.id} value={room.id}>
            {room.name} (최대 {room.capacity}인)
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
