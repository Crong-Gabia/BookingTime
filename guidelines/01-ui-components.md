# UI 컴포넌트 규칙

이 문서는 WhatTime 프론트엔드의 재사용 가능한 UI 컴포넌트에 대한 규칙과 사용법을 정의합니다.

## 목차

- [기본 원칙](#기본-원칙)
- [컴포넌트 목록](#컴포넌트-목록)
- [사용 예시](#사용-예시)

---

## 기본 원칙

### 0. 사용자 알림(Toast) 사용
- `window.alert`, `confirm`, `prompt` 사용은 금지합니다.
- 사용자 피드백(성공/실패/진행중)은 **토스트 알림(Snackbar/Toast)** 으로 통일합니다.
- 라이브러리 사용 가능. MUI 기반 프로젝트이므로 기본 추천은 `notistack`(MUI Snackbar 기반)입니다.

**권장 UX 규칙**:
- 성공: 짧게(1–2초), 자동 닫힘
- 에러: 3–5초, 사용자가 읽을 시간 제공
- 서버 에러는 코드(`message`)가 아니라 사람이 읽을 문장으로 매핑해서 표시

### 1. MUI 기반
- 모든 컴포넌트는 MUI(Material UI) 컴포넌트를 기반으로 작성합니다.
- 인라인 스타일은 최소화하고 `sx` prop을 사용합니다.
- 전역 테마(`main.tsx`의 `createTheme`)를 따릅니다.

### 2. 재사용성
- 반복되는 UI 패턴은 반드시 재사용 컴포넌트로 추출합니다.
- 컴포넌트는 `apps/web/src/components/` 디렉토리에 kebab-case로 저장합니다.
- 예: `status-chip.tsx`, `meeting-card.tsx`

### 3. Props 타입 명시
- 모든 컴포넌트는 TypeScript 인터페이스로 Props를 정의합니다.
- 선택적 Props는 `?`를 사용하고, 기본값은 `defaultProps` 또는 비구조화 할당에서 설정합니다.

### 4. 반응형 지원
- 모든 컴포넌트는 모바일 우선(Mobile First)으로 설계합니다.
- `xs`, `sm`, `md`, `lg`, `xl` 브레이크포인트를 고려하여 `Grid` 또는 `Box`의 `sx` prop으로 처리합니다.

---

## 컴포넌트 목록

### 1. StatusChip (상태 칩)

**설명**: 응답 상태, 시간 슬롯 상태 등을 시각적으로 표시하는 칩 컴포넌트

**Props**:
```typescript
interface StatusChipProps {
  status: 'success' | 'warning' | 'error' | 'default' | 'blocked';
  label: string;
  size?: 'small' | 'medium';
}
```

**상태별 색상**:
- `success`: 녹색 (응답 완료, 가능)
- `warning`: 노란색 (대기 중)
- `error`: 빨간색 (응답 실패, 불가)
- `default`: 회색 (기본)
- `blocked`: 회색 비활성 (점심, 연차, 주말)

**위치**: `apps/web/src/components/status-chip.tsx`

---

### 2. MeetingCard (일정 카드)

**설명**: 대시보드에서 일정 요약 정보를 표시하는 카드 컴포넌트

**Props**:
```typescript
interface MeetingCardProps {
  title: string;
  date: string;
  responseRate: number;
  totalParticipants: number;
  respondedParticipants: number;
  onClick: () => void;
}
```

**구성**:
- 제목, 기간
- 응답률 Progress Bar
- 참석자 현황 (예: 2/3)
- 클릭 시 상세 페이지 이동

**위치**: `apps/web/src/components/meeting-card.tsx`

---

### 3. ParticipantList (참석자 리스트)

**설명**: 참석자 목록을 리스트 형태로 표시

**Props**:
```typescript
interface ParticipantListProps {
  participants: Array<{
    id: string;
    name: string;
    department: string;
    status: 'responded' | 'pending';
  }>;
  onRemind: (userId: string) => void;
}
```

**구성**:
- 각 항목: 이름 | 부서 | 상태 아이콘 | [재요청] 버튼 (미응답자만)
- 응답 완료자: 녹색 체크(✅)
- 미응답자: 회색 시계(⏳)

**위치**: `apps/web/src/components/participant-list.tsx`

---

### 4. TimeSlot (시간 슬롯)

**설명**: 응답 페이지의 시간 선택 슬롯 (30분 단위)

**Props**:
```typescript
interface TimeSlotProps {
  time: string;
  status: 'available' | 'unavailable' | 'blocked';
  onClick: () => void;
}
```

**상태별 스타일**:
- `available`: 밝은 녹색 배경
- `unavailable`: 붉은색 배경 + 취소선
- `blocked`: 흐리게 처리, 클릭 불가 ("연차", "점심" 텍스트 추가)

**위치**: `apps/web/src/components/time-slot.tsx`

---

### 5. TimeGrid (시간 그리드)

**설명**: 날짜별 시간 슬롯을 그리드로 표시

**Props**:
```typescript
interface TimeGridProps {
  date: string;
  slots: Array<{
    time: string;
    status: 'available' | 'unavailable' | 'blocked';
  }>;
  onSlotClick: (time: string) => void;
  onToggleAllAvailable?: () => void;
  onToggleAllUnavailable?: () => void;
}
```

**구성**:
- 날짜 헤더
- [전체 가능] / [전체 불가] 토글 버튼
- 가로 스크롤 가능한 시간 슬롯 그리드

**위치**: `apps/web/src/components/time-grid.tsx`

---

### 6. ProgressBar (진행률 바)

**설명**: 응답률을 시각적으로 표시

**Props**:
```typescript
interface ProgressBarProps {
  value: number; // 0 ~ 100
  color?: 'primary' | 'success' | 'warning' | 'error';
  label?: string; // 예: "응답률: 66%"
}
```

**위치**: `apps/web/src/components/progress-bar.tsx`

---

### 7. SectionHeader (섹션 헤더)

**설명**: 카드나 섹션의 제목과 부제목 표시

**Props**:
```typescript
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}
```

**위치**: `apps/web/src/components/section-header.tsx`

---

### 8. StickyActionBar (고정 하단 액션바)

**설명**: 모바일 응답 페이지의 하단 고정 버튼 영역

**Props**:
```typescript
interface StickyActionBarProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}
```

**구성**:
- 하단 고정 (`position: fixed`, `bottom: 0`)
- 그림자 (`box-shadow: 0 -2px 10px rgba(0,0,0,0.1)`)
- [제출하기 (N개 선택)] 버튼

**위치**: `apps/web/src/components/sticky-action-bar.tsx`

---

### 9. EmptyState (빈 상태)

**설명**: 데이터가 없을 때 표시

**Props**:
```typescript
interface EmptyStateProps {
  message: string;
  action?: React.ReactNode;
}
```

**위치**: `apps/web/src/components/empty-state.tsx`

---

### 10. LoadingState (로딩 상태)

**설명**: 로딩 중일 때 표시

**Props**:
```typescript
interface LoadingStateProps {
  message?: string; // 기본: "로딩 중..."
}
```

**위치**: `apps/web/src/components/loading-state.tsx`

---

### 11. RoomSelector (회의실 선택)

**설명**: 확정 페이지에서 회의실 선택 드롭다운

**Props**:
```typescript
interface RoomSelectorProps {
  rooms: Array<{
    id: string;
    name: string;
    capacity: number;
  }>;
  selectedRoomId: string | null;
  onChange: (roomId: string) => void;
}
```

**위치**: `apps/web/src/components/room-selector.tsx`

---

### 12. CommonSlots (공통 가능 시간 리스트)

**설명**: 확정 페이지에서 공통 가능 시간 리스트 표시

**Props**:
```typescript
interface CommonSlotsProps {
  slots: Array<{
    date: string;
    times: string[];
  }>;
  onSelectSlot: (date: string, time: string) => void;
}
```

**구성**:
- 날짜별로 그룹핑
- 시간 클릭 시 회의실 선택 활성화

**위치**: `apps/web/src/components/common-slots.tsx`

---

### 13. FloatingButton (플로팅 버튼)

**설명**: 새 일정 만들기 버튼

**Props**:
```typescript
interface FloatingButtonProps {
  onClick: () => void;
  label?: string; // 기본: "새 일정 만들기"
}
```

**위치**: `apps/web/src/components/floating-button.tsx`

---

### 14. ConfirmDialog (확인 다이얼로그)

**설명**: 최종 확정 전 확인 다이얼로그

**Props**:
```typescript
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

**위치**: `apps/web/src/components/confirm-dialog.tsx`

---

## 사용 예시

### 예시 1: MeetingCard 사용

```tsx
import MeetingCard from '@/components/meeting-card';

function DashboardPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <MeetingCard
          title="면접 일정"
          date="2026-01-15 ~ 2026-01-17"
          responseRate={66}
          totalParticipants={3}
          respondedParticipants={2}
          onClick={() => console.log('상세 페이지 이동')}
        />
      </Grid>
    </Grid>
  );
}
```

### 예시 2: ParticipantList 사용

```tsx
import ParticipantList from '@/components/participant-list';

function DetailPage() {
  const participants = [
    { id: '1', name: '홍길동', department: '인사팀', status: 'responded' as const },
    { id: '2', name: '김철수', department: '개발팀', status: 'pending' as const },
  ];

  return (
    <ParticipantList
      participants={participants}
      onRemind={(userId) => console.log('독촉:', userId)}
    />
  );
}
```

### 예시 3: TimeGrid 사용

```tsx
import TimeGrid from '@/components/time-grid';

function ResponsePage() {
  const slots = [
    { time: '09:00', status: 'available' as const },
    { time: '09:30', status: 'unavailable' as const },
    { time: '10:00', status: 'blocked' as const },
  ];

  return (
    <TimeGrid
      date="2026-01-15"
      slots={slots}
      onSlotClick={(time) => console.log('클릭:', time)}
      onToggleAllAvailable={() => console.log('전체 가능')}
      onToggleAllUnavailable={() => console.log('전체 불가')}
    />
  );
}
```

---

## 참고

- 모든 컴포넌트는 MUI 컴포넌트를 기반으로 작성합니다.
- `sx` prop을 사용하여 스타일을 적용합니다.
- 반응형은 `Grid` 또는 `Box`의 `sx` prop에서 브레이크포인트를 사용합니다.
- 테스트 파일은 각 컴포넌트와 동일한 디렉토리에 `*.test.tsx`로 작성합니다.
