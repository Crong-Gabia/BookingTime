import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MeetingCard from './meeting-card';

describe('MeetingCard', () => {
  const defaultProps = {
    title: '면접 일정',
    date: '2026-01-15 ~ 2026-01-17',
    responseRate: 66,
    totalParticipants: 3,
    respondedParticipants: 2,
    onClick: vi.fn(),
  };

  it('모든 props가 올바르게 렌더링되어야 함', () => {
    render(<MeetingCard {...defaultProps} />);

    expect(screen.getByText('면접 일정')).toBeInTheDocument();
    expect(screen.getByText('2026-01-15 ~ 2026-01-17')).toBeInTheDocument();
    expect(screen.getByText('응답률')).toBeInTheDocument();
    expect(screen.getByText('66%')).toBeInTheDocument();
    expect(screen.getByText('참석자:')).toBeInTheDocument();
    expect(screen.getByText('2/3')).toBeInTheDocument();
    expect(screen.getByText('상세 보기')).toBeInTheDocument();
  });

  it('ProgressBar의 응답률이 올바르게 표시되어야 함', () => {
    render(<MeetingCard {...defaultProps} />);

    expect(screen.getByText('응답률')).toBeInTheDocument();
    expect(screen.getByText('66%')).toBeInTheDocument();
  });

  it('응답률에 따른 참석자 비율이 올바르게 계산되어 표시되어야 함', () => {
    const props = {
      ...defaultProps,
      responseRate: 100,
      totalParticipants: 5,
      respondedParticipants: 5,
    };

    render(<MeetingCard {...props} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('5/5')).toBeInTheDocument();
  });

  it('카드 클릭 시 onClick 핸들러가 호출되어야 함', async () => {
    const user = userEvent.setup();
    render(<MeetingCard {...defaultProps} />);

    const card = screen.getByText('면접 일정').closest('[role="button"]') || screen.getByText('면접 일정').closest('.MuiCard-root');
    await user.click(card!);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('날짜 범위가 올바르게 표시되어야 함', () => {
    const props = {
      ...defaultProps,
      date: '2026-02-01 ~ 2026-02-05',
    };

    render(<MeetingCard {...props} />);

    expect(screen.getByText('2026-02-01 ~ 2026-02-05')).toBeInTheDocument();
  });
});
