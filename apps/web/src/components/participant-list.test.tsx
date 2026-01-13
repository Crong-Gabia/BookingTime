import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParticipantList from './participant-list';

describe('ParticipantList', () => {
  const mockParticipants = [
    {
      id: 'user-1',
      name: '김철수',
      department: '개발팀',
      status: 'responded' as const,
    },
    {
      id: 'user-2',
      name: '이영희',
      department: '디자인팀',
      status: 'pending' as const,
    },
    {
      id: 'user-3',
      name: '박민수',
      department: '마케팅팀',
      status: 'pending' as const,
    },
  ];

  it('모든 참석자를 올바르게 렌더링해야 함', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        onRemind={vi.fn()}
      />,
    );

    expect(screen.getByText('김철수')).toBeInTheDocument();
    expect(screen.getByText('이영희')).toBeInTheDocument();
    expect(screen.getByText('박민수')).toBeInTheDocument();
    expect(screen.getByText('개발팀')).toBeInTheDocument();
    expect(screen.getByText('디자인팀')).toBeInTheDocument();
    expect(screen.getByText('마케팅팀')).toBeInTheDocument();
  });

  it('응답한 참석자에게 체크 아이콘을 표시해야 함', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        onRemind={vi.fn()}
      />,
    );

    const checkIcon = screen.getByText('김철수').closest('div')?.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  it('대기 중인 참석자에게 시계 아이콘을 표시해야 함', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        onRemind={vi.fn()}
      />,
    );

    const pendingText = screen.getByText('이영희').parentElement?.parentElement;
    expect(pendingText).toContainElement(screen.getByText('디자인팀'));
  });

  it('대기 중인 참석자에게만 재요청 버튼을 표시해야 함', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        onRemind={vi.fn()}
      />,
    );

    const remindButtons = screen.getAllByText('재요청');
    expect(remindButtons).toHaveLength(2);
  });

  it('재요청 버튼 클릭 시 onRemind를 올바른 userId로 호출해야 함', async () => {
    const user = userEvent.setup();
    const handleRemind = vi.fn();

    render(
      <ParticipantList
        participants={mockParticipants}
        onRemind={handleRemind}
      />,
    );

    const remindButtons = screen.getAllByText('재요청');
    await user.click(remindButtons[0]);

    expect(handleRemind).toHaveBeenCalledWith('user-2');
  });
});
