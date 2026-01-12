# 데이터 패칭 (Data Fetching)

이 문서는 WhatTime 프론트엔드의 데이터 패칭 규칙과 TanStack Query 사용 방법을 정의합니다.

## 목차

- [기본 원칙](#기본-원칙)
- [TanStack Query 사용](#tanstack-query-사용)
  - [GET 요청 (useQuery)](#get-요청-usequery)
  - [POST/PUT/DELETE 요청 (useMutation)](#postputdelete-요청-usemutation)
- [API 래퍼 구조](#api-래퍼-구조)
- [캐시 전략](#캐시-전략)
- [에러 처리](#에러-처리)

---

## 기본 원칙

### 1. TanStack Query 사용
- 모든 데이터 패칭은 TanStack Query(`@tanstack/react-query`)를 사용합니다.
- `useQuery`는 GET 요청에, `useMutation`은 POST/PUT/DELETE 요청에 사용합니다.
- 직접 `fetch`를 사용하는 것은 지양합니다 (API 래퍼를 통해서만 호출).

### 2. API 래퍼 중앙화
- API 호출 로직은 `apps/web/src/api/` 디렉토리에 모듈화합니다.
- 각 모듈별로 파일을 분리합니다 (예: `meeting.ts`, `health.ts`).
- 타입은 `@shared/dto` 또는 `api/` 내부에서 정의합니다.

### 3. 타입 안전성
- 모든 API 응답은 TypeScript 타입으로 정의합니다.
- `useQuery`의 `generic`을 사용하여 타입을 명시합니다.

---

## TanStack Query 사용

### GET 요청 (useQuery)

데이터 조회에는 `useQuery`를 사용합니다.

**기본 사용법**:
```tsx
import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '@/api/meeting';

function DashboardPage() {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['dashboard', requestId],
    queryFn: () => fetchDashboard(requestId),
    staleTime: 5 * 60 * 1000, // 5분
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="데이터를 불러오는데 실패했습니다." />;

  return (
    <div>
      {/* 데이터 렌더링 */}
    </div>
  );
}
```

**queryKey 규칙**:
- 항상 배열 형태로 작성합니다.
- 첫 번째 요소는 리소스 이름, 두 번째 요소부터는 파라미터입니다.
- 예: `['dashboard', 'req-123']`, `['participants', 'req-123']`

**주요 옵션**:
- `enabled`: 조건부 쿼리 (예: 로그인 여부)
- `staleTime`: 데이터 유효 시간 (기본: 0)
- `refetchOnWindowFocus`: 윈도우 포커스 시 재조회 여부 (기본: false, 프로젝트 기본 설정)
- `retry`: 실패 시 재시도 횟수 (기본: 1, 프로젝트 기본 설정)

---

### POST/PUT/DELETE 요청 (useMutation)

데이터 생성, 수정, 삭제에는 `useMutation`을 사용합니다.

**기본 사용법**:
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitResponse } from '@/api/meeting';

function ResponsePage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitResponse,
    onSuccess: () => {
      // 성공 시 캐시 무효화 및 리다이렉트
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      alert('응답이 제출되었습니다!');
    },
    onError: (error) => {
      console.error('제출 실패:', error);
      alert('제출에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleSubmit = () => {
    mutation.mutate({
      requestId,
      userId,
      availableSlots,
      unavailableSlots,
    });
  };

  return (
    <Button onClick={handleSubmit} disabled={mutation.isPending}>
      {mutation.isPending ? '제출 중...' : '제출하기'}
    </Button>
  );
}
```

**mutationFn**:
- API 래퍼 함수를 전달합니다.
- 파라미터는 `mutate` 또는 `mutateAsync` 호출 시 전달합니다.

**onSuccess**:
- 성공 후 실행할 로직을 작성합니다.
- 캐시 무효화(`invalidateQueries`) 또는 리다이렉트를 수행합니다.

**onError**:
- 실패 시 에러 처리를 수행합니다.
- 사용자에게 에러 메시지를 표시합니다.

---

## API 래퍼 구조

### 파일 구조

```
apps/web/src/api/
├── index.ts          # API 래퍼 전체 export
├── health.ts         # 헬스체크 API
├── meeting.ts        # 회의 관련 API
└── types.ts         # API 타입 정의 (공유 DTO가 없을 경우)
```

---

### health.ts 예시

```tsx
// apps/web/src/api/health.ts

export async function checkHealth() {
  const response = await fetch('/api/health');
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  return response.json();
}

export type HealthResponse = {
  status: string;
  timestamp: string;
  uptime: number;
};
```

---

### meeting.ts 예시

```tsx
// apps/web/src/api/meeting.ts

export async function fetchDashboard(requestId: string) {
  const response = await fetch(`/api/meetings/${requestId}/dashboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard');
  }
  return response.json();
}

export async function submitResponse(payload: {
  requestId: string;
  userId: string;
  name: string;
  availableSlots: string[];
  unavailableSlots: string[];
}) {
  const response = await fetch(`/api/meetings/${payload.requestId}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to submit response');
  }
  return response.json();
}

export async function sendReminder(requestId: string, userId: string) {
  const response = await fetch(`/api/meetings/${requestId}/remind/${userId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to send reminder');
  }
  return response.json();
}

export async function confirmMeeting(payload: {
  requestId: string;
  confirmedStart: string;
  confirmedEnd: string;
  roomId: string;
}) {
  const response = await fetch('/api/meetings/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to confirm meeting');
  }
  return response.json();
}

// 공유 DTO가 있으면 import (예: @shared/dto)
// 그렇지 않으면 여기서 타입 정의
export type DashboardData = {
  requestId: string;
  title: string;
  status: string;
  participants: Array<{
    userId: string;
    name: string;
    department: string;
    responded: boolean;
  }>;
  commonAvailableSlots: Array<{
    date: string;
    times: string[];
  }>;
  createdAt: string;
};

export type CreateMeetingRequestDto = {
  title: string;
  description?: string;
  durationMinutes: number;
  startDate: string;
  endDate: string;
  participantIds: string[];
  organizerId: string;
};

export type ConfirmMeetingDto = {
  requestId: string;
  confirmedStart: string;
  confirmedEnd: string;
  roomId: string;
};
```

---

### index.ts 예시

```tsx
// apps/web/src/api/index.ts

export * from './health';
export * from './meeting';
```

---

## 캐시 전략

### 캐시 무효화 (Invalidate Queries)

데이터 변경 후 관련 쿼리를 무효화하여 최신 데이터를 다시 가져옵니다.

```tsx
import { useQueryClient } from '@tanstack/react-query';

function SomeComponent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitResponse,
    onSuccess: () => {
      // 대시보드 데이터 무효화
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });

      // 특정 파라미터로 무효화
      queryClient.invalidateQueries({ queryKey: ['dashboard', requestId] });

      // 전체 대시보드 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
```

---

### 캐시 업데이트 (Set Query Data)

서버 요청 없이 로컬 캐시를 즉시 업데이트합니다 (Optimistic Update).

```tsx
import { useQueryClient } from '@tanstack/react-query';

function SomeComponent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitResponse,
    onMutate: async (newData) => {
      // 이전 캐시 백업
      const previousData = queryClient.getQueryData(['dashboard', requestId]);

      // 캐시 업데이트 (Optimistic)
      queryClient.setQueryData(['dashboard', requestId], (old) => ({
        ...old,
        participants: old.participants.map((p) =>
          p.userId === newData.userId ? { ...p, responded: true } : p,
        ),
      }));

      // 백업 반환 (onError에서 복원용)
      return { previousData };
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 이전 캐지 복원
      queryClient.setQueryData(['dashboard', requestId], context.previousData);
    },
    onSettled: () => {
      // 성공/실패 상관없이 서버 데이터 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['dashboard', requestId] });
    },
  });
}
```

---

## 에러 처리

### 글로벌 에러 핸들러

`QueryClient` 설정에서 글로벌 에러 핸들러를 등록합니다.

```tsx
// apps/web/src/main.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5분
    },
    mutations: {
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Query error:', error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Mutation error:', error);
      alert('작업에 실패했습니다. 다시 시도해주세요.');
    },
  }),
});
```

---

### 개별 에러 처리

각 쿼리/뮤테이션에서 에러 처리를 수행합니다.

```tsx
const { data, error, isError } = useQuery({
  queryKey: ['dashboard', requestId],
  queryFn: () => fetchDashboard(requestId),
});

if (isError) {
  return <ErrorState message={error.message} />;
}

const mutation = useMutation({
  mutationFn: submitResponse,
  onError: (error) => {
    console.error('제출 실패:', error);
    alert(error.message || '제출에 실패했습니다.');
  },
});
```

---

## 참고

- 모든 데이터 패칭은 TanStack Query를 사용합니다.
- API 호출 로직은 `apps/web/src/api/` 디렉토리에 모듈화합니다.
- 타입은 `@shared/dto` 또는 `api/` 내부에서 정의합니다.
- 캐시 전략은 `invalidateQueries`와 `setQueryData`를 적절히 활용합니다.
- 에러 처리는 글로벌 핸들러와 개별 핸들러를 조합하여 수행합니다.
