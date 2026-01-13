import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreatePage from './CreatePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock fetch
global.fetch = vi.fn();

const createMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createMockQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('CreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('제목이 올바르게 표시되어야 한다', () => {
    renderWithQueryClient(<CreatePage />);
    expect(screen.getByText('새 회의 일정 만들기')).toBeInTheDocument();
  });

  it('제목 입력 필드가 있어야 한다', () => {
    renderWithQueryClient(<CreatePage />);
    expect(screen.getByLabelText('제목 *')).toBeInTheDocument();
  });

  it('설명 입력 필드가 있어야 한다', () => {
    renderWithQueryClient(<CreatePage />);
    expect(screen.getByLabelText('설명')).toBeInTheDocument();
  });

  it('참석자 섹션이 있어야 한다', () => {
    renderWithQueryClient(<CreatePage />);
    expect(screen.getByText('참석자 *')).toBeInTheDocument();
  });

  it('참석자 추가 버튼이 있어야 한다', () => {
    renderWithQueryClient(<CreatePage />);
    expect(screen.getByText('+ 참석자 추가')).toBeInTheDocument();
  });

  it('시작일 입력 필드가 있어야 한다', () => {
    renderWithQueryClient(<CreatePage />);
    expect(screen.getByLabelText('시작일 *')).toBeInTheDocument();
  });

  it('종료일 입력 필드가 있어야 한다', () => {
    renderWithQueryClient(<CreatePage />);
    expect(screen.getByLabelText('종료일 *')).toBeInTheDocument();
  });

  it('소요시간 선택 필드가 있어야 한다', () => {
    renderWithQueryClient(<CreatePage />);
    expect(screen.getByLabelText('소요시간 *')).toBeInTheDocument();
  });

  it('회의 요청 생성 버튼이 있어야 한다', () => {
    renderWithQueryClient(<CreatePage />);
    expect(screen.getByText('회의 요청 생성')).toBeInTheDocument();
  });

  it('제목을 입력할 수 있어야 한다', () => {
    renderWithQueryClient(<CreatePage />);
    const input = screen.getByLabelText('제목 *');
    fireEvent.change(input, { target: { value: '팀 회의' } });
    expect(input).toHaveValue('팀 회의');
  });
});
