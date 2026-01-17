import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionHeader from './section-header';

describe('SectionHeader', () => {
  // 제목 렌더링 테스트
  it('제목을 렌더링해야 함', () => {
    render(<SectionHeader title="면접 일정" />);

    const title = screen.getByRole('heading', { name: '면접 일정' });
    expect(title).toBeInTheDocument();
  });

  it('제목을 h2 요소로 렌더링해야 함', () => {
    render(<SectionHeader title="면접 일정" />);

    const title = screen.getByRole('heading', { level: 2, name: '면접 일정' });
    expect(title).toBeInTheDocument();
  });

  // 서브타이틀 렌더링 테스트
  it('서브타이틀을 렌더링해야 함', () => {
    render(
      <SectionHeader
        title="면접 일정"
        subtitle="2026년 1월 13일 ~ 1월 15일"
      />,
    );

    const subtitle = screen.getByText('2026년 1월 13일 ~ 1월 15일');
    expect(subtitle).toBeInTheDocument();
  });

  it('서브타이틀이 제공되지 않으면 렌더링하지 않아야 함', () => {
    render(<SectionHeader title="면접 일정" />);

    const subtitle = screen.queryByText(/2026/);
    expect(subtitle).not.toBeInTheDocument();
  });

  // 액션 버튼 렌더링 테스트
  it('액션 버튼을 렌더링해야 함', () => {
    const action = <button type="button">버튼</button>;
    render(<SectionHeader title="면접 일정" action={action} />);

    const button = screen.getByRole('button', { name: '버튼' });
    expect(button).toBeInTheDocument();
  });

  it('액션이 제공되지 않으면 렌더링하지 않아야 함', () => {
    render(<SectionHeader title="면접 일정" />);

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  // 레이아웃 구조 테스트
  it('제목과 액션을 같은 행에 렌더링해야 함', () => {
    const action = <button type="button">액션</button>;
    render(<SectionHeader title="제목" action={action} />);

    const title = screen.getByRole('heading');
    const button = screen.getByRole('button');
    expect(title).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  // 모든 요소 통합 테스트
  it('제목, 서브타이틀, 액션을 모두 렌더링해야 함', () => {
    const action = <button type="button">새로 만들기</button>;
    render(
      <SectionHeader
        title="만남 목록"
        subtitle="총 5개의 만남"
        action={action}
      />,
    );

    expect(screen.getByRole('heading', { name: '만남 목록' })).toBeInTheDocument();
    expect(screen.getByText('총 5개의 만남')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '새로 만들기' })).toBeInTheDocument();
  });
});
