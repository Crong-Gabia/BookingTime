# 타입 정의 (Type Definitions)

이 문서는 WhatTime 프론트엔드의 TypeScript 타입 정의 규칙을 정의합니다.

## 목차

- [기본 원칙](#기본-원칙)
- [타입 위치](#타입-위치)
- [주요 타입 정의](#주요-타입-정의)
  - [일정 관련 (Meeting Types)](#일정-관련-meeting-types)
  - [참석자 관련 (Participant Types)](#참석자-관련-participant-types)
  - [시간 슬롯 관련 (Time Slot Types)](#시간-슬롯-관련-time-slot-types)
  - [회의실 관련 (Room Types)](#회의실-관련-room-types)
  - [API 응답 타입 (API Response Types)](#api-응답-타입-api-response-types)
- [타입 사용 예시](#타입-사용-예시)

---

## 기본 원칙

### 1. 공유 DTO 우선
- 백엔드와 공유하는 타입은 `@shared/dto`에서 import 합니다.
- 프론트엔드 전용 타입만 `apps/web/src/`에 정의합니다.

### 2. 타입 명명 규칙
- Interface/Type: `PascalCase` (예: `MeetingCardProps`, `DashboardData`)
- Enum/Union: `PascalCase` (예: `ResponseStatus`, `TimeSlotStatus`)
- 상수/변수: `SCREAMING_SNAKE_CASE`, `camelCase`

### 3. Strict Mode
- `strict: true`로 설정되어 있습니다.
- `any` 타입 사용은 금지합니다.
- 명시적인 타입 선언을 권장합니다.

---

## 타입 위치

### 디렉토리 구조

```
apps/web/src/
├── types/
│   ├── index.ts           # 전체 export
│   ├── meeting.ts        # 일정 관련 타입
│   ├── participant.ts    # 참석자 관련 타입
│   ├── slot.ts          # 시간 슬롯 관련 타입
│   └── room.ts         # 회의실 관련 타입
└── api/
    └── types.ts        # API 응답 타입 (공유 DTO가 없을 경우)
```

---

## 주요 타입 정의

### 일정 관련 (Meeting Types)

```tsx
// apps/web/src/types/meeting.ts

export type MeetingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  status: MeetingStatus;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingCardProps {
  title: string;
  date: string;
  responseRate: number;
  totalParticipants: number;
  respondedParticipants: number;
  onClick: () => void;
}

export interface CreateMeetingForm {
  title: string;
  description?: string;
  durationMinutes: number;
  startDate: string;
  endDate: string;
  participantIds: string[];
}
```

---

### 참석자 관련 (Participant Types)

```tsx
// apps/web/src/types/participant.ts

export type ResponseStatus = 'responded' | 'pending' | 'error';

export interface Participant {
  id: string;
  name: string;
  department: string;
  status: ResponseStatus;
  respondedAt?: string;
}

export interface ParticipantListProps {
  participants: Participant[];
  onRemind: (userId: string) => void;
}

export interface ParticipantRowProps {
  participant: Participant;
  onRemind: () => void;
}
```

---

### 시간 슬롯 관련 (Time Slot Types)

```tsx
// apps/web/src/types/slot.ts

export type TimeSlotStatus = 'available' | 'unavailable' | 'blocked';

export interface TimeSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: TimeSlotStatus;
}

export interface TimeSlotProps {
  time: string;
  status: TimeSlotStatus;
  onClick: () => void;
}

export interface TimeGridProps {
  date: string;
  slots: TimeSlot[];
  onSlotClick: (time: string) => void;
  onToggleAllAvailable?: () => void;
  onToggleAllUnavailable?: () => void;
}
```

---

### 회의실 관련 (Room Types)

```tsx
// apps/web/src/types/room.ts

export interface Room {
  id: string;
  name: string;
  capacity: number;
  location?: string;
  equipment?: string[];
}

export interface RoomSelectorProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onChange: (roomId: string) => void;
}
```

---

### API 응답 타입 (API Response Types)

```tsx
// apps/web/src/api/types.ts
// 또는 @shared/dto를 사용

export interface DashboardData {
  requestId: string;
  title: string;
  status: MeetingStatus;
  participants: Participant[];
  commonAvailableSlots: Array<{
    date: string;
    times: string[];
  }>;
  createdAt: string;
}

export interface CreateMeetingResponseDto {
  requestId: string;
  title: string;
  status: MeetingStatus;
}

export interface RemindResponseDto {
  userId: string;
  sentAt: string;
}

export interface ConfirmMeetingResponseDto {
  meetingId: string;
  confirmedStart: string;
  confirmedEnd: string;
  roomId: string;
  reservationNo: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}
```

---

## 타입 사용 예시

### 예시 1: 컴포넌트 Props

```tsx
import { MeetingCardProps } from '@/types/meeting';
import { TimeSlotProps } from '@/types/slot';

function MeetingCard({ title, date, responseRate, onClick }: MeetingCardProps) {
  return (
    <Card onClick={onClick}>
      {/* ... */}
    </Card>
  );
}

function TimeSlot({ time, status, onClick }: TimeSlotProps) {
  return (
    <button onClick={onClick}>
      {time}
    </button>
  );
}
```

### 예시 2: API 응답 타입

```tsx
import { useQuery } from '@tanstack/react-query';
import { DashboardData } from '@/api/types';
import { fetchDashboard } from '@/api/meeting';

function DashboardPage() {
  const { data }: { data?: DashboardData } = useQuery({
    queryKey: ['dashboard', requestId],
    queryFn: () => fetchDashboard(requestId),
  });

  return (
    <div>
      {data?.participants.map((p) => (
        <div key={p.id}>
          {p.name} - {p.status}
        </div>
      ))}
    </div>
  );
}
```

### 예시 3: Union 타입 사용

```tsx
import { ResponseStatus } from '@/types/participant';

function StatusChip({ status }: { status: ResponseStatus }) {
  const statusConfig = {
    responded: { color: 'success' as const, label: '응답 완료' },
    pending: { color: 'warning' as const, label: '대기 중' },
    error: { color: 'error' as const, label: '응답 실패' },
  };

  const config = statusConfig[status];

  return <Chip color={config.color} label={config.label} />;
}
```

### 예시 4: 타입 가드

```tsx
function isAvailableSlot(slot: TimeSlot): slot is TimeSlot & { status: 'available' } {
  return slot.status === 'available';
}

function filterAvailableSlots(slots: TimeSlot[]): TimeSlot[] {
  return slots.filter(isAvailableSlot);
}
```

---

## 참고

- 공유 타입은 `@shared/dto`에서 import 합니다.
- 프론트엔드 전용 타입은 `apps/web/src/types/`에 정의합니다.
- 모든 타입은 TypeScript strict mode를 준수합니다.
- `any` 타입 사용은 금지합니다.
- 명시적인 타입 선언을 권장합니다.
