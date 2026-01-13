import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchDashboard,
  createMeeting,
  submitResponse,
  sendReminder,
  confirmMeeting,
} from './meeting';

describe('fetchDashboard', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  // 성공 케이스: 대시보드 데이터를 반환해야 함
  it('성공 시 대시보드 데이터를 반환해야 함', async () => {
    const mockData = {
      requestId: 'req-123',
      title: '회의 제목',
      status: 'pending',
      participants: [],
      commonAvailableSlots: [],
      createdAt: '2026-01-13T10:00:00Z',
      startDate: '2026-01-15',
      endDate: '2026-01-17',
      durationMinutes: 60,
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchDashboard('req-123');

    expect(result).toEqual(mockData);
  });

  // GET 메서드 검증
  it('GET 메서드로 요청해야 함', async () => {
    const mockData = { requestId: 'req-123', title: 'Test' };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await fetchDashboard('req-123');

    expect(global.fetch).toHaveBeenCalledWith('/api/meetings/req-123/dashboard');
  });

  // 에러 케이스: fetch 실패 시 에러를 던져야 함
  it('fetch 실패 시 에러를 던져야 함', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(fetchDashboard('req-123')).rejects.toThrow('Failed to fetch dashboard');
  });
});

describe('createMeeting', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  // 성공 케이스: 회의 생성 응답을 반환해야 함
  it('성공 시 회의 생성 응답을 반환해야 함', async () => {
    const payload = {
      title: '면접 회의',
      description: '1차 면접',
      durationMinutes: 60,
      startDate: '2026-01-15',
      endDate: '2026-01-17',
      participantIds: ['user-1', 'user-2'],
      organizerId: 'org-1',
    };
    const mockResponse = {
      requestId: 'req-new',
      meetingUrl: 'https://example.com/meetings/req-new',
      responseUrl: 'https://example.com/meetings/req-new/respond',
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await createMeeting(payload);

    expect(result).toEqual(mockResponse);
  });

  // POST 메서드 검증
  it('POST 메서드로 요청해야 함', async () => {
    const payload = {
      title: 'Test',
      durationMinutes: 60,
      startDate: '2026-01-15',
      endDate: '2026-01-17',
      participantIds: ['user-1'],
      organizerId: 'org-1',
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ requestId: 'req-1' }),
    });

    await createMeeting(payload);

    expect(global.fetch).toHaveBeenCalledWith('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });

  // 페이로드 검증: 올바른 body 전송
  it('올바른 페이로드를 전송해야 함', async () => {
    const payload = {
      title: '제목',
      description: '설명',
      durationMinutes: 90,
      startDate: '2026-01-20',
      endDate: '2026-01-22',
      participantIds: ['p1', 'p2', 'p3'],
      organizerId: 'org-1',
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ requestId: 'req-2' }),
    });

    await createMeeting(payload);

    const callArgs = (global.fetch as vi.Mock).mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body).toEqual(payload);
  });

  // 엔드포인트 URL 검증
  it('올바른 엔드포인트를 호출해야 함', async () => {
    const payload = {
      title: 'Test',
      durationMinutes: 60,
      startDate: '2026-01-15',
      endDate: '2026-01-17',
      participantIds: ['user-1'],
      organizerId: 'org-1',
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ requestId: 'req-1' }),
    });

    await createMeeting(payload);

    expect(global.fetch).toHaveBeenCalledWith('/api/meetings', expect.any(Object));
  });

  // 에러 케이스: fetch 실패 시 에러를 던져야 함
  it('fetch 실패 시 에러를 던져야 함', async () => {
    const payload = {
      title: 'Test',
      durationMinutes: 60,
      startDate: '2026-01-15',
      endDate: '2026-01-17',
      participantIds: ['user-1'],
      organizerId: 'org-1',
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(createMeeting(payload)).rejects.toThrow('Failed to create meeting');
  });
});

describe('submitResponse', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  // 성공 케이스: 응답 제출 성공
  it('성공 시 응답 제출 결과를 반환해야 함', async () => {
    const payload = {
      requestId: 'req-123',
      userId: 'user-1',
      name: '홍길동',
      availableSlots: ['2026-01-15T09:00', '2026-01-15T10:00'],
      unavailableSlots: ['2026-01-15T11:00'],
    };
    const mockResponse = { success: true };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await submitResponse(payload);

    expect(result).toEqual(mockResponse);
  });

  // POST 메서드 검증
  it('POST 메서드로 요청해야 함', async () => {
    const payload = {
      requestId: 'req-123',
      userId: 'user-1',
      name: '홍길동',
      availableSlots: [],
      unavailableSlots: [],
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await submitResponse(payload);

    expect(global.fetch).toHaveBeenCalledWith('/api/meetings/req-123/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });

  // 페이로드 검증
  it('올바른 페이로드를 전송해야 함', async () => {
    const payload = {
      requestId: 'req-456',
      userId: 'user-2',
      name: '김철수',
      availableSlots: ['slot1', 'slot2'],
      unavailableSlots: ['slot3'],
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await submitResponse(payload);

    const callArgs = (global.fetch as vi.Mock).mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body).toEqual(payload);
  });

  // 에러 케이스: fetch 실패 시 에러를 던져야 함
  it('fetch 실패 시 에러를 던져야 함', async () => {
    const payload = {
      requestId: 'req-123',
      userId: 'user-1',
      name: '홍길동',
      availableSlots: [],
      unavailableSlots: [],
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(submitResponse(payload)).rejects.toThrow('Failed to submit response');
  });
});

describe('sendReminder', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  // 성공 케이스: 리마인더 전송 성공
  it('성공 시 리마인더 전송 결과를 반환해야 함', async () => {
    const mockResponse = { sent: true };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await sendReminder('req-123', 'user-1');

    expect(result).toEqual(mockResponse);
  });

  // POST 메서드 검증
  it('POST 메서드로 요청해야 함', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ sent: true }),
    });

    await sendReminder('req-123', 'user-1');

    expect(global.fetch).toHaveBeenCalledWith('/api/meetings/req-123/remind/user-1', {
      method: 'POST',
    });
  });

  // 엔드포인트 URL 검증
  it('올바른 엔드포인트를 호출해야 함', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ sent: true }),
    });

    await sendReminder('req-456', 'user-2');

    expect(global.fetch).toHaveBeenCalledWith('/api/meetings/req-456/remind/user-2', {
      method: 'POST',
    });
  });

  // 에러 케이스: fetch 실패 시 에러를 던져야 함
  it('fetch 실패 시 에러를 던져야 함', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(sendReminder('req-123', 'user-1')).rejects.toThrow(
      'Failed to send reminder',
    );
  });
});

describe('confirmMeeting', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  // 성공 케이스: 회의 확정 성공
  it('성공 시 회의 확정 결과를 반환해야 함', async () => {
    const payload = {
      requestId: 'req-123',
      selectedTimeSlot: '2026-01-16T10:00:00',
      location: 'room-1',
    };
    const mockResponse = { confirmed: true, meetingId: 'm-123' };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await confirmMeeting(payload);

    expect(result).toEqual(mockResponse);
  });

  // POST 메서드 검증
  it('POST 메서드로 요청해야 함', async () => {
    const payload = {
      requestId: 'req-123',
      selectedTimeSlot: '2026-01-16T10:00:00',
      location: 'room-1',
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ confirmed: true }),
    });

    await confirmMeeting(payload);

    expect(global.fetch).toHaveBeenCalledWith('/api/meetings/req-123/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });

  // 페이로드 검증
  it('올바른 페이로드를 전송해야 함', async () => {
    const payload = {
      requestId: 'req-456',
      selectedTimeSlot: '2026-01-17T14:00:00',
      location: 'room-2',
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ confirmed: true }),
    });

    await confirmMeeting(payload);

    const callArgs = (global.fetch as vi.Mock).mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body).toEqual(payload);
  });

  // 엔드포인트 URL 검증
  it('올바른 엔드포인트를 호출해야 함', async () => {
    const payload = {
      requestId: 'req-123',
      selectedTimeSlot: '2026-01-16T10:00:00',
      location: 'room-1',
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ confirmed: true }),
    });

    await confirmMeeting(payload);

    expect(global.fetch).toHaveBeenCalledWith('/api/meetings/req-123/confirm', expect.any(Object));
  });

  // 에러 케이스: fetch 실패 시 에러를 던져야 함
  it('fetch 실패 시 에러를 던져야 함', async () => {
    const payload = {
      requestId: 'req-123',
      selectedTimeSlot: '2026-01-16T10:00:00',
      location: 'room-1',
    };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(confirmMeeting(payload)).rejects.toThrow('Failed to confirm meeting');
  });
});
