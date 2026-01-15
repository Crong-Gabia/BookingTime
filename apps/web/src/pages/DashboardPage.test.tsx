import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from './DashboardPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const createMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

const fetchMock = vi.fn();

const okJsonResponse = (payload: unknown): Response => {
  return {
    ok: true,
    statusText: 'OK',
    json: () => Promise.resolve(payload),
  } as unknown as Response;
};

const renderWithProviders = (component: React.ReactElement, id = 'test-1') => {
  const queryClient = createMockQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/requests/${id}/dashboard`]}>
        <Routes>
          <Route path="/requests/:id/dashboard" element={component} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('로딩 상태가 올바르게 표시되어야 한다', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('에러 상태가 올바르게 표시되어야 한다', async () => {
    fetchMock.mockImplementation(() => Promise.reject(new Error('Network error')));

    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('에러 발생')).toBeInTheDocument();
    });
  });

  it('데이터 로드 후 제목이 표시되어야 한다', async () => {
    const mockData = {
      requestId: 'req-1',
      title: '팀 회의',
      status: 'OPEN',
      participants: [{ userId: 'user-1', name: '홍길동', responded: true }],
      commonAvailableSlots: [
        {
          date: '2026-01-20',
          times: ['2026-01-20T09:00:00.000Z'],
        },
      ],
      organizerAvailableSlots: ['2026-01-20T09:00:00.000Z'],
      createdAt: '2026-01-13T00:00:00Z',
      startDate: '2026-01-20T00:00:00.000Z',
      endDate: '2026-01-21T00:00:00.000Z',
      durationMinutes: 60,
    };

    fetchMock.mockResolvedValue(okJsonResponse(mockData));

    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '팀 회의' })).toBeInTheDocument();
    });
  });
});
