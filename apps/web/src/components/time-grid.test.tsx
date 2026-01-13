import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeGrid from './time-grid';

describe('TimeGrid', () => {
  const mockSlots = [
    { time: '09:00', status: 'available' as const },
    { time: '09:30', status: 'unavailable' as const },
    { time: '10:00', status: 'blocked' as const, blockedReason: '점심시간' },
  ];

  it('날짜를 한국어 형식으로 렌더링해야 함', () => {
    render(
      <TimeGrid
        date="2026-01-13"
        slots={mockSlots}
        onSlotClick={vi.fn()}
      />,
    );

    expect(screen.getByText(/1월/)).toBeInTheDocument();
    expect(screen.getByText(/13일/)).toBeInTheDocument();
    expect(screen.getByText(/화요일/)).toBeInTheDocument();
  });

  it('모든 슬롯을 올바르게 렌더링해야 함', () => {
    render(
      <TimeGrid
        date="2026-01-13"
        slots={mockSlots}
        onSlotClick={vi.fn()}
      />,
    );

    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('09:30')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('슬롯 클릭 시 onSlotClick을 올바른 시간으로 호출해야 함', async () => {
    const user = userEvent.setup();
    const handleSlotClick = vi.fn();

    render(
      <TimeGrid
        date="2026-01-13"
        slots={mockSlots}
        onSlotClick={handleSlotClick}
      />,
    );

    await user.click(screen.getByText('09:00'));

    expect(handleSlotClick).toHaveBeenCalledWith('09:00');
  });

  it('전체 가능/불가 버튼을 렌더링해야 함', () => {
    render(
      <TimeGrid
        date="2026-01-13"
        slots={mockSlots}
        onSlotClick={vi.fn()}
        onToggleAllAvailable={vi.fn()}
        onToggleAllUnavailable={vi.fn()}
      />,
    );

    expect(screen.getByText('전체 가능')).toBeInTheDocument();
    expect(screen.getByText('전체 불가')).toBeInTheDocument();
  });

  it('전체 가능 버튼 클릭 시 onToggleAllAvailable을 호출해야 함', async () => {
    const user = userEvent.setup();
    const handleToggleAllAvailable = vi.fn();

    render(
      <TimeGrid
        date="2026-01-13"
        slots={mockSlots}
        onSlotClick={vi.fn()}
        onToggleAllAvailable={handleToggleAllAvailable}
        onToggleAllUnavailable={vi.fn()}
      />,
    );

    await user.click(screen.getByText('전체 가능'));

    expect(handleToggleAllAvailable).toHaveBeenCalledTimes(1);
  });
});
