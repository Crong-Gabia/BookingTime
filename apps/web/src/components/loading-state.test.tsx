import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingState from './loading-state';

describe('LoadingState', () => {
  // CircularProgress 렌더링 테스트
  it('CircularProgress를 렌더링해야 함', () => {
    render(<LoadingState />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  // 기본 메시지 테스트
  it('기본 메시지 "로딩 중..."을 렌더링해야 함', () => {
    render(<LoadingState />);

    const message = screen.getByText('로딩 중...');
    expect(message).toBeInTheDocument();
  });

  // 커스텀 메시지 테스트
  it('커스텀 메시지를 렌더링해야 함', () => {
    render(<LoadingState message="데이터를 불러오는 중..." />);

    const message = screen.getByText('데이터를 불러오는 중...');
    expect(message).toBeInTheDocument();
  });

  it('커스텀 메시지가 제공되면 기본 메시지를 덮어써야 함', () => {
    render(<LoadingState message="저장 중..." />);

    const defaultMessage = screen.queryByText('로딩 중...');
    const customMessage = screen.getByText('저장 중...');

    expect(defaultMessage).not.toBeInTheDocument();
    expect(customMessage).toBeInTheDocument();
  });

  // 레이아웃 구조 테스트
  it('메시지와 CircularProgress가 함께 렌더링되어야 함', () => {
    render(<LoadingState message="처리 중..." />);

    const progress = screen.getByRole('progressbar');
    const message = screen.getByText('처리 중...');

    expect(progress).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });

  it('중앙 정렬 레이아웃을 가지고 있어야 함', () => {
    const { container } = render(<LoadingState />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({
      minHeight: '50vh',
    });
  });

  // 다양한 메시지 시나리오 테스트
  it('긴 메시지도 올바르게 렌더링해야 함', () => {
    const longMessage = '서버에서 데이터를 가져오는 중입니다. 잠시만 기다려 주세요.';
    render(<LoadingState message={longMessage} />);

    const message = screen.getByText(longMessage);
    expect(message).toBeInTheDocument();
  });

  it('비어 있는 메시지를 처리해야 함', () => {
    render(<LoadingState message="" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });
});
