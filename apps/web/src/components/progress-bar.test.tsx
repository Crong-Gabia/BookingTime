import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressBar from './progress-bar';

describe('ProgressBar', () => {
  // 값 렌더링 테스트
  it('0% 값을 올바르게 렌더링해야 함', () => {
    render(<ProgressBar value={0} />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('aria-valuenow', '0');
  });

  it('50% 값을 올바르게 렌더링해야 함', () => {
    render(<ProgressBar value={50} />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
  });

  it('100% 값을 올바르게 렌더링해야 함', () => {
    render(<ProgressBar value={100} />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '100');
  });

  // 라벨 렌더링 테스트
  it('라벨을 렌더링해야 함', () => {
    render(<ProgressBar value={75} label="진행률" />);

    const label = screen.getByText('진행률');
    expect(label).toBeInTheDocument();
  });

  it('라벨과 함께 퍼센트 표시를 렌더링해야 함', () => {
    render(<ProgressBar value={60} label="완료율" />);

    const percentage = screen.getByText('60%');
    expect(percentage).toBeInTheDocument();
  });

  it('라벨이 제공되지 않으면 렌더링하지 않아야 함', () => {
    render(<ProgressBar value={50} />);

    const label = screen.queryByText(/%/);
    expect(label).not.toBeInTheDocument();
  });

  // 색상 변형 테스트
  it('primary 색상을 올바르게 렌더링해야 함', () => {
    render(<ProgressBar value={50} color="primary" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('success 색상을 올바르게 렌더링해야 함', () => {
    render(<ProgressBar value={100} color="success" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('warning 색상을 올바르게 렌더링해야 함', () => {
    render(<ProgressBar value={50} color="warning" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('error 색상을 올바르게 렌더링해야 함', () => {
    render(<ProgressBar value={25} color="error" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  // 기본 색상 테스트
  it('색상이 제공되지 않으면 primary가 기본값이어야 함', () => {
    render(<ProgressBar value={50} />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  // 전체 구조 테스트
  it('모든 요소를 함께 렌더링해야 함', () => {
    render(<ProgressBar value={80} label="완료율" color="success" />);

    const label = screen.getByText('완료율');
    const percentage = screen.getByText('80%');
    const progress = screen.getByRole('progressbar');

    expect(label).toBeInTheDocument();
    expect(percentage).toBeInTheDocument();
    expect(progress).toBeInTheDocument();
  });
});
