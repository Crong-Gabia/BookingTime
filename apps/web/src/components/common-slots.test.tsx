import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommonSlots from './common-slots';

describe('CommonSlots', () => {
  const mockSlots = [
    {
      date: '2026-01-15',
      times: ['09:00', '10:00', '11:00'],
    },
    {
      date: '2026-01-16',
      times: ['14:00', '15:00'],
    },
  ];

  it('날짜별 슬롯이 올바르게 표시되어야 함', () => {
    const onSelectSlot = vi.fn();
    render(<CommonSlots slots={mockSlots} onSelectSlot={onSelectSlot} />);

    expect(screen.getByText('모두 가능한 시간')).toBeInTheDocument();
    expect(screen.getByText('1월 15일 목요일')).toBeInTheDocument();
    expect(screen.getByText('1월 16일 금요일')).toBeInTheDocument();
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('날짜가 한국어 형식으로 올바르게 표시되어야 함', () => {
    const onSelectSlot = vi.fn();
    render(<CommonSlots slots={mockSlots} onSelectSlot={onSelectSlot} />);

    expect(screen.getByText('1월 15일 목요일')).toBeInTheDocument();
    expect(screen.getByText('1월 16일 금요일')).toBeInTheDocument();
  });

  it('슬롯 선택 시 선택 상태가 표시되어야 함', async () => {
    const user = userEvent.setup();
    const onSelectSlot = vi.fn();
    render(<CommonSlots slots={mockSlots} onSelectSlot={onSelectSlot} />);

    const slot = screen.getByText('09:00');
    await user.click(slot);

    expect(screen.getByText('선택됨')).toBeInTheDocument();
    expect(onSelectSlot).toHaveBeenCalledWith('2026-01-15', '09:00');
  });

  it('다른 슬롯 클릭 시 선택 상태가 변경되어야 함', async () => {
    const user = userEvent.setup();
    const onSelectSlot = vi.fn();
    render(<CommonSlots slots={mockSlots} onSelectSlot={onSelectSlot} />);

    const firstSlot = screen.getByText('09:00');
    await user.click(firstSlot);

    expect(screen.getByText('선택됨')).toBeInTheDocument();

    const secondSlot = screen.getByText('10:00');
    await user.click(secondSlot);

    expect(screen.getAllByText('선택됨')).toHaveLength(1);
    expect(onSelectSlot).toHaveBeenLastCalledWith('2026-01-15', '10:00');
  });

  it('슬롯이 없을 경우 빈 상태 메시지가 표시되어야 함', () => {
    const onSelectSlot = vi.fn();
    render(<CommonSlots slots={[]} onSelectSlot={onSelectSlot} />);

    expect(screen.getByText('공통 가능한 시간이 없습니다.')).toBeInTheDocument();
    expect(screen.queryByText('09:00')).not.toBeInTheDocument();
  });
});
