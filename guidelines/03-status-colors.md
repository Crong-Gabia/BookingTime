# 상태 색상 (Status Colors)

이 문서는 WhatTime 프론트엔드의 상태별 색상 사용 규칙을 정의합니다.

## 목차

- [기본 원칙](#기본-원칙)
- [상태별 색상](#상태별-색상)
  - [응답 상태 (Response Status)](#응답-상태-response-status)
  - [시간 슬롯 상태 (Time Slot Status)](#시간-슬롯-상태-time-slot-status)
  - [일정 상태 (Meeting Status)](#일정-상태-meeting-status)
- [MUI 테마 설정](#mui-테마-설정)
- [사용 예시](#사용-예시)

---

## 기본 원칙

### 1. MUI 팔레트 사용
- 모든 색상은 MUI의 `palette`를 기반으로 사용합니다.
- 커스텀 색상은 최소화하고 필요한 경우 `theme.palette.extend`로 확장합니다.

### 2. 접근성 고려
- 텍스트와 배경색 간의 대비율은 WCAG 2.1 AA 기준을 충족합니다 (최소 4.5:1).
- 색상만으로 의미를 전달하지 않고 아이콘 또는 텍스트와 함께 사용합니다.

### 3. 일관성 유지
- 동일한 상태는 전체 앱에서 동일한 색상을 사용합니다.
- `StatusChip` 컴포넌트를 사용하여 색상을 중앙 관리합니다.

---

## 상태별 색상

### 응답 상태 (Response Status)

참석자의 응답 상태를 나타냅니다.

| 상태 | 색상 | 색상 코드 | 아이콘 | 설명 |
|------|------|----------|--------|------|
| `responded` | 녹색 | `success.main` (#2e7d32) | ✅ | 응답 완료 |
| `pending` | 노란색 | `warning.main` (#f57c00) | ⏳ | 대기 중 (미응답) |
| `error` | 빨간색 | `error.main` (#d32f2f) | ❌ | 응답 실패 |

**사용 예시**:
```tsx
<StatusChip status="success" label="응답 완료" />
<StatusChip status="warning" label="대기 중" />
<StatusChip status="error" label="응답 실패" />
```

---

### 시간 슬롯 상태 (Time Slot Status)

응답 페이지의 시간 슬롯 상태를 나타냅니다.

| 상태 | 색상 | 색상 코드 | 배경색 | 텍스트색 | 설명 |
|------|------|----------|--------|---------|------|
| `available` | 녹색 | `success.main` (#2e7d32) | 밝은 녹색 (`#e8f5e9`) | 녹색 (`#2e7d32`) | 가능 (기본) |
| `unavailable` | 빨간색 | `error.main` (#d32f2f) | 빨간색 (`#ffcdd2`) | 빨간색 (`#d32f2f`) + 취소선 | 불가 (선택) |
| `blocked` | 회색 | `action.disabled` (#e0e0e0) | 회색 (`#eeeeee`) | 회색 (`#9e9e9e`) | 제외 (시스템: 연차, 점심, 주말) |

**사용 예시**:
```tsx
<TimeSlot time="09:00" status="available" onClick={handleClick} />
<TimeSlot time="09:30" status="unavailable" onClick={handleClick} />
<TimeSlot time="10:00" status="blocked" />
```

---

### 일정 상태 (Meeting Status)

일정의 전체 상태를 나타냅니다.

| 상태 | 색상 | 색상 코드 | 설명 |
|------|------|----------|------|
| `pending` | 노란색 | `warning.main` (#f57c00) | 조율 진행 중 |
| `confirmed` | 녹색 | `success.main` (#2e7d32) | 확정 완료 |
| `cancelled` | 빨간색 | `error.main` (#d32f2f) | 취소됨 |

**사용 예시**:
```tsx
<StatusChip status="warning" label="조율 진행 중" />
<StatusChip status="success" label="확정 완료" />
<StatusChip status="error" label="취소됨" />
```

---

## MUI 테마 설정

`apps/web/src/main.tsx`에서 테마를 설정합니다.

```tsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // MUI 기본 프라이머리
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#f57c00',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
```

---

## 사용 예시

### 예시 1: StatusChip 사용

```tsx
import StatusChip from '@/components/status-chip';

function ParticipantRow({ participant }) {
  const { name, status } = participant;

  const statusConfig = {
    responded: { status: 'success' as const, label: '응답 완료' },
    pending: { status: 'warning' as const, label: '대기 중' },
  };

  const config = statusConfig[status];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography>{name}</Typography>
      <StatusChip status={config.status} label={config.label} />
    </Box>
  );
}
```

### 예시 2: TimeSlot 사용

```tsx
import TimeSlot from '@/components/time-slot';

function ResponsePage() {
  const slots = [
    { time: '09:00', status: 'available' as const },
    { time: '09:30', status: 'unavailable' as const },
    { time: '10:00', status: 'blocked' as const },
  ];

  return (
    <Box>
      {slots.map((slot) => (
        <TimeSlot key={slot.time} time={slot.time} status={slot.status} onClick={handleClick} />
      ))}
    </Box>
  );
}
```

### 예시 3: 테마 색상 직접 사용

```tsx
import { Box, Typography, useTheme } from '@mui/material';

function StatusCard({ status }) {
  const theme = useTheme();

  const colorMap = {
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
  };

  return (
    <Box
      sx={{
        backgroundColor: colorMap[status] || theme.palette.grey[100],
        p: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="text.primary">
        {status.toUpperCase()}
      </Typography>
    </Box>
  );
}
```

---

## 참고

- 모든 색상은 MUI의 `palette`를 기반으로 사용합니다.
- 필요한 경우 `theme.palette.extend`로 커스텀 색상을 추가합니다.
- `StatusChip` 및 `TimeSlot` 컴포넌트를 사용하여 색상을 중앙 관리합니다.
- 텍스트와 배경색 간의 대비율을 확인하여 접근성을 보장합니다.
