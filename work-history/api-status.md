# API 연결 상태 문서

**최종 업데이트**: 2026-01-13 (v2)
**기준 브랜치**: `feature/navigation-bars`

---

## 최신 업데이트 (2026-01-13 v3)

- ✅ ERROR_CODES 중복 제거 완료
- ✅ ConfirmMeetingDto 통일 완료 (selectedTimeSlot, location)
- ✅ 회의 확정 경로 수정 완료 (`/api/meetings/:id/confirm`)
- ✅ getAllMeetings API 래퍼 추가 완료
- ✅ DashboardDto department 필드 제거 완료 (DTO에서 제거, 백엔드에서 department 참조 제거)
- ✅ ResponsePage 동적 날짜 처리 확인 (하드코딩 없음, dashboard 데이터에서 동적으로 받음)
- 🟝 중간 우선순위 이슈: CreateMeetingRequestDto participantIds 중복 제거 필요

---

## 개요

프론트엔드와 백엔드 API의 연결 상태 및 불일치 문제를 기록합니다.

---

## API 엔드포인트 목록

### 1. 회의 목록 조회

| 속성 | 값 |
|------|-----|
| **엔드포인트** | `GET /api/meetings` |
| **백엔드 구현** | ✅ 완료 |
| **프론트엔드 래퍼** | ✅ 완료 (2026-01-13) |
| **사용 페이지** | HomePage |
| **상태** | ✅ 정상 |

### 2. 회의 생성

| 속성 | 값 |
|------|-----|
| **엔드포인트** | `POST /api/meetings` |
| **백엔드 구현** | ✅ 완료 |
| **프론트엔드 래퍼** | ✅ 완료 |
| **사용 페이지** | CreatePage |
| **상태** | 🟡 DTO 불일치 확인 필요 (participantIds 중복) |

#### DTO 불일치 사항

**CreateMeetingRequestDto** (백엔드)
```typescript
{
  title: string;
  description?: string;
  organizerId: string;
  participantIds: string[];
  requiredParticipantIds: string[];  // ⚠️ 프론트엔드 미사용 (삭제 필요)
  startDate: string;
  endDate: string;
  durationMinutes: number;
  location?: string;
}
```

**CreatePage 전송 데이터**
```typescript
{
  title: string;
  description: string;
  organizerId: 'organizer-1';
  participantIds: string[];  // ⚠️ requiredParticipantIds도 같은 값으로 중복 전송 중 (제거 필요)
  requiredParticipantIds: string[];
  startDate: string;
  endDate: string;
  durationMinutes: number;
}
```

### 3. 대시보드 조회

| 속성 | 값 |
|------|-----|
| **엔드포인트** | `GET /api/meetings/:id/dashboard` |
| **백엔드 구현** | ✅ 완료 |
| **프론트엔드 래퍼** | ✅ 완료 |
| **사용 페이지** | DashboardPage |
| **상태** | ✅ 정상 |

#### DTO 상태

**DashboardDto** (shared)
```typescript
{
  requestId: string;
  title: string;
  description?: string;
  status: MeetingRequestStatus;
  participants: Array<{
    userId: string;
    name: string;
    responded: boolean;
  }>;
  commonAvailableSlots: Array<{
    date: string;
    times: string[];
  }>;
  createdAt: string;
  startDate: string;
  endDate: string;
  durationMinutes: number;
}
```

**백엔드 실제 반환 데이터**
```typescript
{
  requestId: string;
  title: string;
  status: MeetingRequestStatus;
  participants: Array<{
    userId: string;
    name: string;
    responded: boolean;
  }>;
  commonAvailableSlots: Array<{date: string, times: string[]}>; // ✅ 올바른 형식
  createdAt: string;
  startDate: string; // ✅ 반환됨
  endDate: string; // ✅ 반환됨
  durationMinutes: number; // ✅ 반환됨
}
```

### 4. 응답 제출

| 속성 | 값 |
|------|-----|
| **엔드포인트** | `POST /api/meetings/:id/respond` |
| **백엔드 구현** | ✅ 완료 |
| **프론트엔드 래퍼** | ✅ 완료 |
| **사용 페이지** | ResponsePage |
| **상태** | ✅ 정상 |

### 5. 독촉 알림 전송

| 속성 | 값 |
|------|-----|
| **엔드포인트** | `POST /api/meetings/:id/remind/:userId` |
| **백엔드 구현** | ✅ 완료 |
| **프론트엔드 래퍼** | ✅ 완료 |
| **사용 페이지** | DashboardPage |
| **상태** | ✅ 정상 |

### 6. 회의 확정

| 속성 | 값 |
|------|-----|
| **엔드포인트** | `POST /api/meetings/:id/confirm` |
| **백엔드 구현** | ✅ 완료 |
| **프론트엔드 래퍼** | ✅ 완료 (2026-01-13 수정) |
| **사용 페이지** | DashboardPage |
| **상태** | ✅ 정상 |

#### 수정 내용 (2026-01-13)

- **DTO 통일**: `{ requestId, selectedTimeSlot, location }` 형태로 통일
- **경로 수정**: 프론트엔드에서 `/api/meetings/:id/confirm`으로 변경

---

## 해결된 이슈 (Resolved Issues)

### ✅ ERROR_CODES 중복 정의 (해결 완료 - 2026-01-13)

**위치**: `packages/shared/src/dto.ts`

**문제**: ERROR_CODES 객체에 중복된 정의가 존재

**조치**: 중복된 부분 제거

**현재 상태**:
```typescript
export const ERROR_CODES = {
  ROOM_TAKEN: 'ROOM_TAKEN',
  VERSION_MISMATCH: 'VERSION_MISMATCH',
  REQUEST_CLOSED: 'REQUEST_CLOSED',
  INVALID_TIME_RANGE: 'INVALID_TIME_RANGE',
  NO_COMMON_SLOTS: 'NO_COMMON_SLOTS',
  PARTICIPANT_NOT_FOUND: 'PARTICIPANT_NOT_FOUND',
} as const;
```

### ✅ DashboardDto department 필드 제거 (해결 완료 - 2026-01-13)

**위치**: `packages/shared/src/dto.ts`, `apps/api/src/modules/meeting/meeting.service.ts`

**문제**: department 필드가 데이터베이스에 없지만 DTO에 포함되어 있음

**조치**: DTO에서 department 필드 제거, 백엔드에서 department 참조 제거

**현재 상태**:
```typescript
// shared DTO - department 제거됨
export interface DashboardDto {
  participants: Array<{
    userId: string;
    name: string;
    responded: boolean;
  }>;
  // ...
}
```

---

## 해결 필요 사항 (Action Items)

### 높은 우선순위

| 이슈 | 조치 | 상태 |
|------|------|------|
| ERROR_CODES 중복 제거 | dto.ts에서 중복 부분 삭제 | ✅ 완료 |
| 회의 확정 API 경로 수정 | 프론트엔드를 `/api/meetings/:id/confirm`로 변경 | ✅ 완료 |
| ConfirmMeetingDto 통일 | 프론트엔드/백엔드/DTO 동기화 | ✅ 완료 |
| getAllMeetings API 래퍼 추가 | 프론트엔드 API 래퍼 구현 | ✅ 완료 |

### 중간 우선순위

| 이슈 | 조치 | 예상 시간 |
|------|------|----------|
| CreateMeetingRequestDto 정리 | 프론트엔드에서 requiredParticipantIds 제거 | 10분 |

### 낮은 우선순위

| 이슈 | 조치 | 예상 시간 |
|------|------|----------|
| 없음 | - | - |

---

## API 연결 상태 요약 (2026-01-13)

| 엔드포인트 | 백엔드 | 프론트엔드 | 상태 |
|------------|---------|-----------|------|
| GET /api/meetings | ✅ | ✅ | ✅ 정상 |
| POST /api/meetings | ✅ | ✅ | 🟡 DTO 확인 필요 (participantIds 중복) |
| GET /api/meetings/:id/dashboard | ✅ | ✅ | ✅ 정상 |
| POST /api/meetings/:id/respond | ✅ | ✅ | ✅ 정상 |
| POST /api/meetings/:id/remind/:userId | ✅ | ✅ | ✅ 정상 |
| POST /api/meetings/:id/confirm | ✅ | ✅ | ✅ 정상 |

---

## 테스트 체크리스트

- [ ] 회의 목록 정상 조회
- [ ] 회의 생성 후 대시보드 정상 이동
- [ ] 응답 제출 후 대시보드에 반영
- [ ] 독촉 알림 전송 (10분 쿨다운 확인)
- [ ] 회의 확정 기능 동작

---

## 참고

- [백엔드 API Controller](../../apps/api/src/modules/meeting/meeting.controller.ts)
- [백엔드 API Service](../../apps/api/src/modules/meeting/meeting.service.ts)
- [프론트엔드 API 래퍼](../../apps/web/src/api/meeting.ts)
- [Shared DTO](../../packages/shared/src/dto.ts)
