import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusChip from './status-chip';

const getChipRoot = (label: string) => {
  const labelNode = screen.getByText(label);
  return labelNode.closest('.MuiChip-root');
};

describe('StatusChip', () => {
  it('성공 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="success" label="응답 완료" />);
    expect(screen.getByText('응답 완료')).toBeInTheDocument();
  });

  it('경고 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="warning" label="대기 중" />);
    expect(screen.getByText('대기 중')).toBeInTheDocument();
  });

  it('에러 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="error" label="거절됨" />);
    expect(screen.getByText('거절됨')).toBeInTheDocument();
  });

  it('기본 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="default" label="기본" />);
    expect(screen.getByText('기본')).toBeInTheDocument();
  });

  it('차단 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="blocked" label="차단됨" />);
    expect(screen.getByText('차단됨')).toBeInTheDocument();
  });

  it('small 사이즈를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="success" label="작은 칩" size="small" />);
    expect(screen.getByText('작은 칩')).toBeInTheDocument();
  });

  it('medium 사이즈를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="success" label="중간 칩" size="medium" />);
    expect(screen.getByText('중간 칩')).toBeInTheDocument();
  });

  it('기본 사이즈가 medium이어야 함', () => {
    render(<StatusChip status="success" label="기본 칩" />);
    expect(screen.getByText('기본 칩')).toBeInTheDocument();
  });

  it('차단 상태일 때 opacity가 0.5여야 함', () => {
    render(<StatusChip status="blocked" label="차단됨" />);

    const chipRoot = getChipRoot('차단됨');
    expect(chipRoot).not.toBeNull();
    expect(chipRoot).toHaveStyle({ opacity: '0.5' });
  });

  it('차단 상태가 아닐 때 opacity가 적용되지 않아야 함', () => {
    render(<StatusChip status="success" label="활성" />);

    const chipRoot = getChipRoot('활성');
    expect(chipRoot).not.toBeNull();
    expect(chipRoot).not.toHaveStyle({ opacity: '0.5' });
  });
});
