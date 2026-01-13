import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeSlot from './time-slot';

describe('TimeSlot', () => {
  it('가능 상태를 올바른 스타일로 렌더링해야 함', () => {
    render(<TimeSlot time="09:00" status="available" onClick={vi.fn()} />);

    const slot = screen.getByText('09:00');
    expect(slot).toBeInTheDocument();
    expect(slot.closest('button')).toHaveStyle({
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      border: '2px solid #4caf50',
    });
  });

  it('불가 상태를 올바른 스타일로 렌더링해야 함', () => {
    render(<TimeSlot time="09:30" status="unavailable" onClick={vi.fn()} />);

    const slot = screen.getByText('09:30');
    expect(slot).toBeInTheDocument();
    expect(slot.closest('button')).toHaveStyle({
      backgroundColor: '#ffcdd2',
      color: '#d32f2f',
      border: '2px solid #f44336',
    });
  });

  it('차단 상태를 올바르게 렌더링해야 함', () => {
    render(
      <TimeSlot
        time="10:00"
        status="blocked"
        onClick={vi.fn()}
        blockedReason="점심시간"
      />,
    );

    const slot = screen.getByText('10:00');
    const button = slot.closest('button');

    expect(button).not.toBeNull();
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ opacity: '0.5' });
    expect(screen.getByText('점심시간')).toBeInTheDocument();
  });

  it('가능/불가 상태에서 클릭 시 onClick 핸들러를 호출해야 함', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<TimeSlot time="09:00" status="available" onClick={handleClick} />);

    const slot = screen.getByText('09:00');
    await user.click(slot);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('차단 상태에서는 클릭이 작동하지 않아야 함', () => {
    const handleClick = vi.fn();

    render(<TimeSlot time="10:00" status="blocked" onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /10:00/ });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
