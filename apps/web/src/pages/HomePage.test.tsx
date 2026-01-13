import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './HomePage';
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

describe('HomePage', () => {
  it('로딩 상태가 올바르게 표시되어야 한다', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'ok', timestamp: '2026-01-13T00:00:00Z', uptime: 100 }),
      })
    );

    renderWithQueryClient(<HomePage />);
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('에러 상태가 올바르게 표시되어야 한다', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    renderWithQueryClient(<HomePage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('서버 연결 실패')).toBeInTheDocument();
  });

  it('성공 상태에서 제목이 표시되어야 한다', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'ok', timestamp: '2026-01-13T00:00:00Z', uptime: 100 }),
      })
    );

    renderWithQueryClient(<HomePage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('WhatTime')).toBeInTheDocument();
  });

  it('서버 상태가 올바르게 표시되어야 한다', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'ok', timestamp: '2026-01-13T00:00:00Z', uptime: 100 }),
      })
    );

    renderWithQueryClient(<HomePage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('✅ 서버 정상 (Status: ok)')).toBeInTheDocument();
  });

  it('진행 중인 조율이 없으면 메시지가 표시되어야 한다', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'ok', timestamp: '2026-01-13T00:00:00Z', uptime: 100 }),
      })
    );

    renderWithQueryClient(<HomePage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('진행 중인 조율이 없습니다.')).toBeInTheDocument();
  });

  it('완료된 조율이 없으면 메시지가 표시되어야 한다', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'ok', timestamp: '2026-01-13T00:00:00Z', uptime: 100 }),
      })
    );

    renderWithQueryClient(<HomePage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('완료된 조율이 없습니다.')).toBeInTheDocument();
  });
});
