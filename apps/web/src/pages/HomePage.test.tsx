import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from './HomePage';
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

type HealthPayload = { status: string; timestamp: string; uptime: number };

type MeetingsPayload = { meetings: unknown[] };

const okJsonResponse = (payload: unknown): Response => {
  return {
    ok: true,
    statusText: 'OK',
    json: () => Promise.resolve(payload),
  } as unknown as Response;
};

const okTextResponse = (payload: unknown): Response => {
  return {
    ok: true,
    statusText: 'OK',
    text: () => Promise.resolve(JSON.stringify(payload)),
  } as unknown as Response;
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createMockQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={component} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('로딩 상태가 올바르게 표시되어야 한다', async () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<HomePage />);
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('에러 상태가 올바르게 표시되어야 한다', async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/health')) {
        return Promise.reject(new Error('Network error'));
      }
      return new Promise(() => {});
    });

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('서버 연결 실패')).toBeInTheDocument();
    });
  });

  it('성공 상태에서 제목이 표시되어야 한다', async () => {
    const health: HealthPayload = { status: 'ok', timestamp: '2026-01-13T00:00:00Z', uptime: 100 };
    const meetings: MeetingsPayload = { meetings: [] };

    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/health')) {
        return Promise.resolve(okJsonResponse(health));
      }
      if (url.includes('/api/meetings')) {
        return Promise.resolve(okTextResponse(meetings));
      }
      return Promise.reject(new Error(`Unexpected request: ${url}`));
    });

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('WhatTime')).toBeInTheDocument();
    });
  });

  it('진행 중인 회의가 없으면 메시지가 표시되어야 한다', async () => {
    const health: HealthPayload = { status: 'ok', timestamp: '2026-01-13T00:00:00Z', uptime: 100 };
    const meetings: MeetingsPayload = { meetings: [] };

    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/health')) {
        return Promise.resolve(okJsonResponse(health));
      }
      if (url.includes('/api/meetings')) {
        return Promise.resolve(okTextResponse(meetings));
      }
      return Promise.reject(new Error(`Unexpected request: ${url}`));
    });

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('진행 중인 회의가 없습니다.')).toBeInTheDocument();
    });
  });

  it('완료된 회의가 없으면 메시지가 표시되어야 한다', async () => {
    const health: HealthPayload = { status: 'ok', timestamp: '2026-01-13T00:00:00Z', uptime: 100 };
    const meetings: MeetingsPayload = { meetings: [] };

    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/health')) {
        return Promise.resolve(okJsonResponse(health));
      }
      if (url.includes('/api/meetings')) {
        return Promise.resolve(okTextResponse(meetings));
      }
      return Promise.reject(new Error(`Unexpected request: ${url}`));
    });

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('완료된 회의가 없습니다.')).toBeInTheDocument();
    });
  });
});
