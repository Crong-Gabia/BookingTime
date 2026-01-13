import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from './DashboardPage';
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

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('로딩 상태가 올바르게 표시되어야 한다', () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {}));
    renderWithQueryClient(<DashboardPage />);
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('에러 상태가 올바르게 표시되어야 한다', async () => {
    (global.fetch as any).mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    );

    renderWithQueryClient(<DashboardPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('에러 발생')).toBeInTheDocument();
  });

  it('데이터 로드 후 제목이 표시되어야 한다', async () => {
    const mockData = {
      requestId: 'req-1',
      title: '팀 회의',
      status: 'OPEN',
      participants: [
        { userId: 'user-1', name: '홍길동', responded: true },
      ],
      commonAvailableSlots: ['2026-01-20T09:00:00Z'],
      createdAt: '2026-01-13T00:00:00Z',
    };

    (global.fetch as any).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    renderWithQueryClient(<DashboardPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('팀 회의')).toBeInTheDocument();
  });
});
