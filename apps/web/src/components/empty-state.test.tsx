import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from './empty-state';

describe('EmptyState', () => {
  // 아이콘 렌더링 테스트
  it('SentimentDissatisfied 아이콘을 렌더링해야 함', () => {
    render(<EmptyState message="데이터가 없습니다" />);

    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  // 메시지 렌더링 테스트
  it('메시지를 렌더링해야 함', () => {
    render(<EmptyState message="등록된 일정이 없습니다" />);

    const message = screen.getByText('등록된 일정이 없습니다');
    expect(message).toBeInTheDocument();
  });

  it('메시지를 h6 요소로 렌더링해야 함', () => {
    render(<EmptyState message="데이터 없음" />);

    const message = screen.getByRole('heading', { level: 6, name: '데이터 없음' });
    expect(message).toBeInTheDocument();
  });

  // 액션 버튼 렌더링 테스트
  it('액션 버튼을 렌더링해야 함', () => {
    const action = <button type="button">새로 만들기</button>;
    render(<EmptyState message="데이터 없음" action={action} />);

    const button = screen.getByRole('button', { name: '새로 만들기' });
    expect(button).toBeInTheDocument();
  });

  it('액션이 제공되지 않으면 렌더링하지 않아야 함', () => {
    render(<EmptyState message="데이터 없음" />);

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  // Container 및 레이아웃 구조 테스트
  it('Container 컴포넌트로 감싸져 있어야 함', () => {
    render(<EmptyState message="데이터 없음" />);

    const message = screen.getByText('데이터 없음');
    const container = message.closest('.MuiContainer-root');

    expect(container).toBeInTheDocument();
  });

  it('중앙 정렬 레이아웃을 가지고 있어야 함', () => {
    const { container } = render(<EmptyState message="데이터 없음" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('MuiContainer-root');
  });

  // 통합 테스트
  it('모든 요소를 함께 렌더링해야 함', () => {
    const action = <button type="button">일정 추가</button>;
    render(
      <EmptyState
        message="아직 만남 일정이 없습니다"
        action={action}
      />,
    );

    const icon = document.querySelector('svg');
    const message = screen.getByText('아직 만남 일정이 없습니다');
    const button = screen.getByRole('button', { name: '일정 추가' });

    expect(icon).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  // 다양한 메시지 시나리오 테스트
  it('긴 메시지도 올바르게 렌더링해야 함', () => {
    const longMessage = '현재 표시할 데이터가 없습니다. 새로운 일정을 생성해주세요.';
    render(<EmptyState message={longMessage} />);

    const message = screen.getByText(longMessage);
    expect(message).toBeInTheDocument();
  });

  it('다양한 액션 요소를 렌더링할 수 있어야 함', () => {
    const action = (
      <div>
        <button type="button">버튼 1</button>
        <button type="button">버튼 2</button>
      </div>
    );
    render(<EmptyState message="데이터 없음" action={action} />);

    const button1 = screen.getByRole('button', { name: '버튼 1' });
    const button2 = screen.getByRole('button', { name: '버튼 2' });

    expect(button1).toBeInTheDocument();
    expect(button2).toBeInTheDocument();
  });
});
