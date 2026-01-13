async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

const API_BASE_URL = 'http://localhost:3000';

export async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await parseJson<T>(response);

  if (!response.ok) {
    let message = response.statusText || '요청에 실패했습니다.';
    if (payload && typeof payload === 'object' && 'message' in payload) {
      const maybeMessage = (payload as { message?: unknown }).message;
      if (typeof maybeMessage === 'string') {
        message = maybeMessage;
      }
    }
    throw new Error(message);
  }

  const normalized = payload === null ? undefined : payload;
  return normalized as T;
}

export interface Meeting {
  id: string;
  title: string;
  status: string;
  responseRate: number;
  createdAt: string;
}

export async function getAllMeetings(): Promise<{ meetings: Meeting[] }> {
  return requestJson(`${API_BASE_URL}/api/meetings`);
}

