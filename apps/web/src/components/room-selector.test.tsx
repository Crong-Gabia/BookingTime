import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoomSelector from './room-selector';

describe('RoomSelector', () => {
  const mockRooms = [
    { id: 'room-1', name: '회의실 A', capacity: 10 },
    { id: 'room-2', name: '회의실 B', capacity: 20 },
    { id: 'room-3', name: '회의실 C', capacity: 8 },
  ];

  it('모든 회의실 옵션을 올바르게 렌더링해야 함', async () => {
    const user = userEvent.setup();

    render(
      <RoomSelector
        rooms={mockRooms}
        selectedRoomId={null}
        onChange={vi.fn()}
      />,
    );

    const select = screen.getByRole('combobox');
    await user.click(select);

    expect(screen.getByText('회의실 A (최대 10인)')).toBeInTheDocument();
    expect(screen.getByText('회의실 B (최대 20인)')).toBeInTheDocument();
    expect(screen.getByText('회의실 C (최대 8인)')).toBeInTheDocument();
  });

  it('회의실 선택 시 onChange를 올바른 roomId로 호출해야 함', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RoomSelector
        rooms={mockRooms}
        selectedRoomId={null}
        onChange={handleChange}
      />,
    );

    const select = screen.getByRole('combobox');
    await user.click(select);

    const option = screen.getByText('회의실 A (최대 10인)');
    await user.click(option);

    expect(handleChange).toHaveBeenCalledWith('room-1');
  });

  it('disabled 상태일 때 선택이 불가해야 함', () => {
    render(
      <RoomSelector
        rooms={mockRooms}
        selectedRoomId={null}
        onChange={vi.fn()}
        disabled
      />,
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-disabled', 'true');
  });

  it('helper text를 올바르게 표시해야 함', () => {
    render(
      <RoomSelector
        rooms={mockRooms}
        selectedRoomId={null}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('확정할 회의실을 선택하세요')).toBeInTheDocument();
  });

  it('선택된 회의실이 올바르게 표시되어야 함', () => {
    render(
      <RoomSelector
        rooms={mockRooms}
        selectedRoomId="room-2"
        onChange={vi.fn()}
      />,
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveTextContent('회의실 B');
  });
});
