import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResponsePage from './ResponsePage';
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
      <MemoryRouter initialEntries={[`/requests/${id}/respond`]}>
        <Routes>
          <Route path="/requests/:id/respond" element={component} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('ResponsePage', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;

    const mockDashboard = {
      requestId: 'req-1',
      title: '팀 회의',
      status: 'OPEN',
      participants: [{ userId: 'user-1', name: '홍길동', responded: false }],
      startDate: '2026-01-20',
      endDate: '2026-01-20',
    };

    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/dashboard')) {
        return Promise.resolve(okJsonResponse(mockDashboard));
      }
      return Promise.reject(new Error(`Unexpected request: ${url}`));
    });
  });

  it('제목이 올바르게 표시되어야 한다', () => {
    renderWithProviders(<ResponsePage />);
    expect(screen.getAllByText('회의 일정 응답')[0]).toBeInTheDocument();
  });

  it('이름 입력 필드가 있어야 한다', () => {
    renderWithProviders(<ResponsePage />);
    expect(screen.getByPlaceholderText('홍길동')).toBeInTheDocument();
  });

  it('시간 슬롯이 표시되어야 한다', async () => {
    renderWithProviders(<ResponsePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '09:00' })).toBeInTheDocument();
    });
  });

  it('이름을 입력할 수 있어야 한다', () => {
    renderWithProviders(<ResponsePage />);

    const input = screen.getByPlaceholderText('홍길동');
    fireEvent.change(input, { target: { value: '홍길동' } });
    expect(input).toHaveValue('홍길동');
  });

  it('시간 슬롯을 선택할 수 있어야 한다', async () => {
    renderWithProviders(<ResponsePage />);

    const timeSlot = await screen.findByRole('button', { name: '09:00' });
    fireEvent.click(timeSlot);

    expect(screen.getByRole('button', { name: /제출하기/ })).toBeEnabled();
  });

  it('제출하기 버튼이 있어야 한다', () => {
    renderWithProviders(<ResponsePage />);
    expect(screen.getByRole('button', { name: /제출하기/ })).toBeInTheDocument();
  });
});
