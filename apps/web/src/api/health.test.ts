import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { checkHealth } from './health';

describe('checkHealth', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  // 성공 케이스: HealthResponse를 반환해야 함
  it('성공 시 HealthResponse를 반환해야 함', async () => {
    const mockData = {
      status: 'ok',
      timestamp: '2026-01-13T10:00:00Z',
      uptime: 3600,
    };
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await checkHealth();

    expect(result).toEqual(mockData);
    expect(result.status).toBe('ok');
    expect(result.timestamp).toBe('2026-01-13T10:00:00Z');
    expect(result.uptime).toBe(3600);
  });

  // 에러 케이스: fetch 실패 시 에러를 던져야 함
  it('fetch 실패 시 에러를 던져야 함', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
    });

    await expect(checkHealth()).rejects.toThrow('Health check failed');
  });

  // 네트워크 에러 처리
  it('네트워크 에러 발생 시 예외를 던져야 함', async () => {
    (global.fetch as Mock).mockRejectedValue(new Error('Network error'));

    await expect(checkHealth()).rejects.toThrow('Network error');
  });

  // 응답 파싱 검증
  it('응답 JSON을 올바르게 파싱해야 함', async () => {
    const mockData = {
      status: 'healthy',
      timestamp: '2026-01-13T12:30:45Z',
      uptime: 86400,
    };
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await checkHealth();

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('/api/health');
  });

  // 엔드포인트 URL 검증
  it('올바른 엔드포인트를 호출해야 함', async () => {
    const mockData = { status: 'ok', timestamp: '2026-01-13T10:00:00Z', uptime: 100 };
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await checkHealth();

    expect(global.fetch).toHaveBeenCalledWith('/api/health');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
