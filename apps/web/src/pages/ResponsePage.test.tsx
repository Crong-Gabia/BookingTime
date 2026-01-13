import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResponsePage from './ResponsePage';
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

const renderWithQueryClient = (component: React.ReactElement, id: string = 'test-1') => {
  const queryClient = createMockQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ResponsePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('제목이 올바르게 표시되어야 한다', () => {
    renderWithQueryClient(<ResponsePage />);
    expect(screen.getByText('회의 일정 응답')).toBeInTheDocument();
  });

  it('이름 입력 필드가 있어야 한다', () => {
    renderWithQueryClient(<ResponsePage />);
    expect(screen.getByLabelText('이름 *')).toBeInTheDocument();
  });

  it('시간 슬롯이 표시되어야 한다', () => {
    renderWithQueryClient(<ResponsePage />);
    expect(screen.getByText(/2026년/)).toBeInTheDocument();
  });

  it('이름을 입력할 수 있어야 한다', () => {
    renderWithQueryClient(<ResponsePage />);
    const input = screen.getByLabelText('이름 *');
    fireEvent.change(input, { target: { value: '홍길동' } });
    expect(input).toHaveValue('홍길동');
  });

  it('시간 슬롯을 선택할 수 있어야 한다', () => {
    renderWithQueryClient(<ResponsePage />);
    const timeSlot = screen.getByText('09:00');
    fireEvent.click(timeSlot);
  });

  it('제출하기 버튼이 있어야 한다', () => {
    renderWithQueryClient(<ResponsePage />);
    expect(screen.getByText(/제출하기/)).toBeInTheDocument();
  });
});
