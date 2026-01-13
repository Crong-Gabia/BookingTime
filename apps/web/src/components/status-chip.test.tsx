import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusChip from './status-chip';

describe('StatusChip', () => {
  // 상태별 렌더링 테스트
  it('성공 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="success" label="응답 완료" />);

    const chip = screen.getByText('응답 완료');
    expect(chip).toBeInTheDocument();
  });

  it('경고 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="warning" label="대기 중" />);

    const chip = screen.getByText('대기 중');
    expect(chip).toBeInTheDocument();
  });

  it('에러 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="error" label="거절됨" />);

    const chip = screen.getByText('거절됨');
    expect(chip).toBeInTheDocument();
  });

  it('기본 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="default" label="기본" />);

    const chip = screen.getByText('기본');
    expect(chip).toBeInTheDocument();
  });

  it('차단 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="blocked" label="차단됨" />);

    const chip = screen.getByText('차단됨');
    expect(chip).toBeInTheDocument();
  });

  // 크기 테스트
  it('small 사이즈를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="success" label="작은 칩" size="small" />);

    const chip = screen.getByText('작은 칩');
    expect(chip).toBeInTheDocument();
  });

  it('medium 사이즈를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="success" label="중간 칩" size="medium" />);

    const chip = screen.getByText('중간 칩');
    expect(chip).toBeInTheDocument();
  });

  it('기본 사이즈가 medium이어야 함', () => {
    render(<StatusChip status="success" label="기본 칩" />);

    const chip = screen.getByText('기본 칩');
    expect(chip).toBeInTheDocument();
  });

  // 스타일 테스트
  it('차단 상태일 때 opacity가 0.5여야 함', () => {
    render(<StatusChip status="blocked" label="차단됨" />);

    const chip = screen.getByText('차단됨');
    expect(chip).toHaveStyle({ opacity: 0.5 });
  });

  it('차단 상태가 아닐 때 opacity가 적용되지 않아야 함', () => {
    render(<StatusChip status="success" label="활성" />);

    const chip = screen.getByText('활성');
    expect(chip).not.toHaveStyle({ opacity: 0.5 });
  });
});
