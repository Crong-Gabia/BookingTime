# 테스트 가이드라인 (Testing Guidelines)

이 문서는 WhatTime 프론트엔드의 테스트 작성 규칙을 정의합니다.

## 목차

- [기본 원칙](#기본-원칙)
- [테스트 도구 설정](#테스트-도구-설정)
- [테스트 파일 구조](#테스트-파일-구조)
- [테스트 작성 방법](#테스트-작성-방법)
  - [컴포넌트 테스트](#컴포넌트-테스트)
  - [훅 테스트](#훅-테스트)
  - [API 래퍼 테스트](#api-래퍼-테스트)
- [테스트 예시](#테스트-예시)

---

## 기본 원칙

### 1. 테스트 도구
- Vitest를 기본 테스트 러너로 사용합니다.
- React Testing Library(@testing-library/react)로 컴포넌트 테스트를 작성합니다.
- jsdom 환경에서 실행합니다.

### 2. 테스트 커버리지
- 비즈니스 로직은 최소 80% 커버리지를 목표로 합니다.
- UI 컴포넌트는 사용자 상호작용 위주로 테스트합니다 (구현 세부사항 X).

### 3. 테스트 파일 위치
- 컴포넌트/훅/API 래퍼와 동일한 디렉토리에 `*.test.tsx` 파일로 작성합니다.
- 예: `status-chip.test.tsx`, `meeting-card.test.tsx`

---

## 테스트 도구 설정

### Vitest 설정

`apps/web/vite.config.ts`에 이미 Vitest 설정이 포함되어 있습니다.

```tsx
// apps/web/vite.config.ts

/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

### 테스트 설정 파일

`apps/web/src/test/setup.ts`에 `@testing-library/jest-dom` 설정이 포함되어 있습니다.

```tsx
// apps/web/src/test/setup.ts

import '@testing-library/jest-dom';
```

---

## 테스트 파일 구조

### 디렉토리 구조

```
apps/web/src/
├── components/
│   ├── status-chip.tsx
│   ├── status-chip.test.tsx
│   ├── meeting-card.tsx
│   ├── meeting-card.test.tsx
│   └── ...
├── hooks/
│   ├── use-dashboard.ts
│   └── use-dashboard.test.ts
├── api/
│   ├── meeting.ts
│   └── meeting.test.ts
└── pages/
    ├── HomePage.tsx
    ├── HomePage.test.tsx
    ├── DashboardPage.tsx
    ├── DashboardPage.test.tsx
    └── ...
```

---

## 테스트 작성 방법

### 컴포넌트 테스트

**사용자 관점 테스트**:
- 사용자가 보는 것, 클릭하는 것, 입력하는 것을 테스트합니다.
- 구현 세부사항(예: `useState` 내부 상태)은 테스트하지 않습니다.

**주요 검증 방법**:
- `getByText`, `getByRole`으로 엘리먼트 찾기
- `fireEvent.click`, `userEvent.click`으로 이벤트 발생
- `expect(element).toBeInTheDocument()`로 렌더링 확인
- `expect(element).toHaveTextContent()`로 텍스트 확인
- `expect(fn).toHaveBeenCalled()`로 콜백 호출 확인

---

### 훅 테스트

**@testing-library/react-hooks** 없는 경우: 테스트용 컴포넌트 작성

```tsx
import { renderHook, act } from '@testing-library/react';
import { useDashboard } from './use-dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

test('데이터를 로드하고 상태를 업데이트해야 함', async () => {
  const { result } = renderHook(() => useDashboard('req-123'), {
    wrapper: createWrapper(),
  });

  await act(async () => {
    // 비동기 작업 대기
  });

  expect(result.current.data).toBeDefined();
  expect(result.current.isLoading).toBe(false);
});
```

---

### API 래퍼 테스트

**fetch 모킹**:
- `vi.stubGlobal` 또는 `vi.fn()`으로 `fetch`를 모킹합니다.
- 응답 데이터를 설정합니다.

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchDashboard } from './meeting';

describe('fetchDashboard', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('데이터를 가져와야 함', async () => {
    const mockData = { requestId: 'req-123', title: 'Test' };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const data = await fetchDashboard('req-123');

    expect(data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('/api/meetings/req-123/dashboard');
  });

  it('에러 발생 시 예외를 던져야 함', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(fetchDashboard('req-123')).rejects.toThrow('Failed to fetch dashboard');
  });
});
```

---

## 테스트 예시

### 예시 1: StatusChip 테스트

```tsx
// apps/web/src/components/status-chip.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusChip from './status-chip';

describe('StatusChip', () => {
  it('성공 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="success" label="응답 완료" />);

    const chip = screen.getByText('응답 완료');
    expect(chip).toBeInTheDocument();
  });

  it('경고 상태를 올바르게 렌더링해야 함', () => {
    render(<StatusChip status="warning" label="대기 중" />);

    const chip = screen.getByText('대기 중');
    expect(chip).toBeInTheDocument();
  });

  it('onClick 핸들러를 호출해야 함', () => {
    const handleClick = vi.fn();
    render(<StatusChip status="success" label="Test" onClick={handleClick} />);

    const chip = screen.getByText('Test');
    chip.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

### 예시 2: MeetingCard 테스트

```tsx
// apps/web/src/components/meeting-card.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MeetingCard from './meeting-card';

describe('MeetingCard', () => {
  const defaultProps = {
    title: '면접 일정',
    date: '2026-01-15 ~ 2026-01-17',
    responseRate: 66,
    totalParticipants: 3,
    respondedParticipants: 2,
    onClick: vi.fn(),
  };

  it('제목과 기간을 렌더링해야 함', () => {
    render(<MeetingCard {...defaultProps} />);

    expect(screen.getByText('면접 일정')).toBeInTheDocument();
    expect(screen.getByText('2026-01-15 ~ 2026-01-17')).toBeInTheDocument();
  });

  it('응답률을 올바르게 계산하여 표시해야 함', () => {
    render(<MeetingCard {...defaultProps} />);

    expect(screen.getByText('66%')).toBeInTheDocument();
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('클릭 시 onClick 핸들러를 호출해야 함', async () => {
    const user = userEvent.setup();
    render(<MeetingCard {...defaultProps} />);

    const card = screen.getByText('면접 일정').closest('div');
    await user.click(card!);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
});
```

---

### 예시 3: TimeSlot 테스트

```tsx
// apps/web/src/components/time-slot.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeSlot from './time-slot';

describe('TimeSlot', () => {
  it('가능 상태를 녹색으로 렌더링해야 함', () => {
    render(<TimeSlot time="09:00" status="available" onClick={vi.fn()} />);

    const slot = screen.getByText('09:00');
    expect(slot).toBeInTheDocument();
    expect(slot).toHaveStyle({ backgroundColor: '#e8f5e9' });
  });

  it('불가 상태를 빨간색으로 렌더링해야 함', () => {
    render(<TimeSlot time="09:30" status="unavailable" onClick={vi.fn()} />);

    const slot = screen.getByText('09:30');
    expect(slot).toHaveStyle({ backgroundColor: '#ffcdd2' });
  });

  it('비활성 상태를 클릭하지 못하게 해야 함', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<TimeSlot time="10:00" status="blocked" onClick={handleClick} />);

    const slot = screen.getByText('10:00');
    await user.click(slot);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

---

### 예시 4: 페이지 통합 테스트

```tsx
// apps/web/src/pages/HomePage.test.tsx

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('HomePage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    vi.stubGlobal('fetch', vi.fn());
  });

  it('로딩 상태를 표시해야 함', () => {
    (global.fetch as vi.Mock).mockImplementation(() => new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>,
    );

    expect(screen.getByText('서버 확인 중...')).toBeInTheDocument();
  });

  it('서버 정상 상태를 표시해야 함', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', timestamp: '2026-01-12T12:00:00Z' }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>,
    );

    await screen.findByText('✅ 서버 정상');

    expect(screen.getByText('Status: ok')).toBeInTheDocument();
    expect(screen.getByText(/2026-01-12/)).toBeInTheDocument();
  });

  it('에러 상태를 표시해야 함', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>,
    );

    await screen.findByText('서버 연결 실패');

    expect(screen.getByText('서버 연결 실패')).toHaveStyle({ color: 'red' });
  });
});
```

---

## 테스트 실행

### 전체 테스트 실행

```bash
pnpm test
```

### 웹 패키지 테스트만 실행

```bash
pnpm --filter web test
```

### 특정 파일 실행

```bash
pnpm test apps/web/src/components/status-chip.test.tsx
```

### 특정 테스트 이름으로 실행

```bash
pnpm test -t "StatusChip"
```

---

## 참고

- 모든 테스트는 Vitest와 React Testing Library를 사용합니다.
- 테스트 파일은 컴포넌트/훅/API 래퍼와 동일한 디렉토리에 `*.test.tsx`로 작성합니다.
- 사용자 관점 테스트를 지향합니다 (구현 세부사항 테스트 X).
- 비즈니스 로직은 최소 80% 커버리지를 목표로 합니다.
- `vi.fn()`, `vi.stubGlobal`으로 모킹을 수행합니다.
