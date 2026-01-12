# 레이아웃 패턴

이 문서는 WhatTime 프론트엔드의 페이지별 레이아웃 패턴을 정의합니다.

## 목차

- [기본 원칙](#기본-원칙)
- [페이지별 레이아웃](#페이지별-레이아웃)
  - [Home (Dashboard)](#home-dashboard)
  - [일정 생성 (Create)](#일정-생성-create)
  - [응답 페이지 (Response)](#응답-페이지-response)
  - [주최자 상세/확정 (Detail & Confirm)](#주최자-상세확정-detail--confirm)
- [공통 레이아웃 구조](#공통-레이아웃-구조)

---

## 기본 원칙

### 1. 모바일 우선 (Mobile First)
- 모든 레이아웃은 모바일 화면 기준으로 설계합니다.
- 데스크톱에서는 `Grid` 또는 `Box`의 `sx` prop에서 브레이크포인트(`sm`, `md`, `lg`, `xl`)를 사용하여 반응형을 적용합니다.

### 2. MUI Grid 시스템 사용
- 12열 기반의 `Grid` 시스템을 사용합니다.
- `Grid container` + `Grid item` 패턴을 따릅니다.
- 간격은 `spacing` prop으로 제어합니다.

### 3. 카드 기반 레이아웃
- 대부분의 콘텐츠는 `Card` 컴포넌트 안에 배치합니다.
- `CardHeader`, `CardContent`, `CardActions`를 적절히 사용합니다.

### 4. 스티키 액션바 (모바일)
- 모바일 화면에서는 주요 액션 버튼을 하단에 고정(`position: fixed`, `bottom: 0`)합니다.

---

## 페이지별 레이아웃

### Home (Dashboard)

**목적**: 진행 중인 조율 목록과 완료된 조율 히스토리 표시

**구조**:
```
┌─────────────────────────────────┐
│  헤더: "WhatTime - 회의 예약"   │
├─────────────────────────────────┤
│  진행 중인 조율 섹션           │
│  ┌───────────────────────────┐ │
│  │ MeetingCard (반복)        │ │
│  │ - 제목                    │ │
│  │ - 기간                    │ │
│  │ - 응답률 (ProgressBar)    │ │
│  │ - 참석자 현황             │ │
│  │ [상세 보기]               │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  완료된 조율 섹션             │
│  ┌───────────────────────────┐ │
│  │ MeetingCard (반복)        │ │
│  │ - 제목                    │ │
│  │ - 기간                    │ │
│  │ - 확정 시간               │ │
│  │ - 회의실                  │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│         [+] FAB (새 일정)      │
└─────────────────────────────────┘
```

**구성 요소**:
- `SectionHeader`: "진행 중인 조율", "완료된 조율"
- `MeetingCard`: 반복되는 카드
- `ProgressBar`: 응답률 표시
- `FloatingButton`: 새 일정 만들기

**반응형**:
- 모바일: 한 열 (`xs={12}`)
- 태블릿: 두 열 (`sm={6}`)
- 데스크톱: 세 열 (`md={4}`)

**예시 코드**:
```tsx
<Container maxWidth="lg" sx={{ py: 2 }}>
  <SectionHeader title="진행 중인 조율" />
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={4}>
      <MeetingCard ... />
    </Grid>
  </Grid>

  <SectionHeader title="완료된 조율" />
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={4}>
      <MeetingCard ... />
    </Grid>
  </Grid>

  <FloatingButton onClick={handleCreate} />
</Container>
```

---

### 일정 생성 (Create)

**목적**: 새로운 회의 일정을 생성하는 페이지

**구조**:
```
┌─────────────────────────────────┐
│  [←]  새 일정 만들기           │
├─────────────────────────────────┤
│  기본 정보 섹션               │
│  ┌───────────────────────────┐ │
│  │ 제목 입력                 │ │
│  │ 설명 입력                 │ │
│  │ 소요 시간 선택            │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  참석자 선택 섹션             │
│  ┌───────────────────────────┐ │
│  │ 조직도 검색               │ │
│  │ 선택된 참석자 리스트       │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  시간/기간 설정 섹션          │
│  ┌───────────────────────────┐ │
│  │ 날짜 범위 선택           │ │
│  │ 시간대 필터              │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│        [생성하기] 버튼         │
└─────────────────────────────────┘
```

**구성 요소**:
- `TextField`: 제목, 설명
- `Select`: 소요 시간, 시간대 필터
- `DatePicker` 또는 `TextField`(date type): 날짜 범위
- `Chip`: 선택된 참석자
- `Button`: 생성하기

**반응형**:
- 모바일/데스크톱 모두 단열 레이아웃 (`xs={12}`)

---

### 응답 페이지 (Response)

**목적**: 참석자가 가능한 시간을 선택하는 페이지 (Mobile 최적화)

**구조**:
```
┌─────────────────────────────────┐
│  "홍길동 대리님, 면접 일정     │
│   확인 부탁드립니다."           │
├─────────────────────────────────┤
│  일정 개요                     │
│  ┌───────────────────────────┐ │
│  │ 제목, 주최자, 소요시간    │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  Time Grid (세로 스크롤)       │
│  ┌───────────────────────────┐ │
│  │ [전체 가능] [전체 불가]    │ │
│  │ 2026-01-15                │ │
│  │ [09:00][09:30][10:00]...  │ │
│  │                            │ │
│  │ 2026-01-16                │ │
│  │ [09:00][09:30][10:00]...  │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  Sticky ActionBar (하단 고정)  │
│  ┌───────────────────────────┐ │
│  │ [일정 제출하기 (N개 선택)] │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

**구성 요소**:
- `Typography`: 안내 문구
- `Card`: 일정 개요
- `TimeGrid`: 날짜별 시간 슬롯 그리드
- `StickyActionBar`: 하단 고정 제출 버튼

**반응형**:
- 모바일: 세로 스크롤 Time Grid
- 데스크톱: 가로 스크롤 Time Grid (더 많은 시간 슬롯 표시)

---

### 주최자 상세/확정 (Detail & Confirm)

**목적**: 주최자가 응답 현황을 확인하고 최종 시간을 확정하는 페이지

**구조**:
```
┌─────────────────────────────────┐
│  [←]  일정 제목                │
│  기간, 응답률 (ProgressBar)    │
├─────────────────────────────────┤
│  ┌──────────┬──────────────────┤ │
│  │참석자 현황│  결과 도출       │ │
│  │          │                  │ │
│  │Participant│  "모두 가능한     │ │
│  │List      │   시간"           │ │
│  │          │                  │ │
│  │  홍길동  │  ┌─────────────┐ │ │
│  │  ✅     │  │1/15 14:00  │ │ │
│  │  [재요청]│  │1/15 15:00  │ │ │
│  │          │  │1/16 10:00  │ │ │
│  │  김철수  │  └─────────────┘ │ │
│  │  ⏳     │                  │ │
│  │  [재요청]│  회의실 선택:     │ │
│  │          │  [Select]         │ │
│  │  박영수  │  [최종 확정]     │ │
│  │  ✅     │                  │ │ │
│  └──────────┴──────────────────┘ │ │
└─────────────────────────────────┘
```

**구성 요소**:
- `SectionHeader`: 제목, 기간
- `ProgressBar`: 응답률
- `Grid`: 좌우 분할 레이아웃
  - 좌측 (`xs={12} md={5}`): `ParticipantList`
  - 우측 (`xs={12} md={7}`): `CommonSlots`, `RoomSelector`, `Button`(확정)
- `ConfirmDialog`: 최종 확정 전 확인

**반응형**:
- 모바일: 좌측과 우측을 세로로 배치
- 데스크톱: 좌측 5열, 우측 7열 분할

**예시 코드**:
```tsx
<Container maxWidth="lg" sx={{ py: 2 }}>
  <SectionHeader title={title} subtitle={`${startDate} ~ ${endDate}`} />

  <ProgressBar value={responseRate} label={`응답률: ${responseRate}%`} />

  <Grid container spacing={2}>
    <Grid item xs={12} md={5}>
      <ParticipantList participants={participants} onRemind={handleRemind} />
    </Grid>
    <Grid item xs={12} md={7}>
      <CommonSlots slots={commonSlots} onSelectSlot={handleSelectSlot} />
      <RoomSelector rooms={rooms} selectedRoomId={selectedRoomId} onChange={handleSelectRoom} />
      <Button variant="contained" onClick={handleConfirm} disabled={!selectedRoomId}>
        최종 확정
      </Button>
    </Grid>
  </Grid>
</Container>
```

---

## 공통 레이아웃 구조

### 1. 기본 컨테이너

모든 페이지는 `Container`로 감싸고, 최대 너비를 제한합니다.

```tsx
import { Container } from '@mui/material';

<Container maxWidth="lg" sx={{ py: 2 }}>
  {/* 페이지 콘텐츠 */}
</Container>
```

- `maxWidth`: `xs`, `sm`, `md`, `lg`, `xl` 중 선택 (기본: `lg`)
- `sx={{ py: 2 }}`: 상하 패딩 (2 * 8px = 16px)

---

### 2. 섹션 분리

섹션 간의 간격은 `Box`와 `Typography`로 구분합니다.

```tsx
import { Box, Typography } from '@mui/material';

<Box sx={{ mb: 2 }}>
  <Typography variant="h6">섹션 제목</Typography>
  <Divider sx={{ my: 1 }} />
</Box>
```

---

### 3. 그리드 시스템

반복되는 카드 또는 항목은 `Grid` 시스템을 사용합니다.

```tsx
import { Grid } from '@mui/material';

<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    {/* 카드 또는 항목 */}
  </Grid>
</Grid>
```

---

### 4. 스티키 액션바 (모바일)

모바일에서 하단에 고정된 액션바:

```tsx
import { Box, Button } from '@mui/material';

<Box
  sx={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    p: 2,
    backgroundColor: 'white',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
  }}
>
  <Button variant="contained" fullWidth>
    제출하기
  </Button>
</Box>
```

---

## 참고

- 모든 레이아웃은 MUI의 `Grid`, `Box`, `Container`를 기반으로 작성합니다.
- 반응형은 `xs`, `sm`, `md`, `lg`, `xl` 브레이크포인트를 사용합니다.
- 간격은 `spacing` prop으로 제어합니다 (단위: 8px).
- 섹션 간의 분리는 `Divider` 또는 `Box`의 `mb` (margin-bottom)를 사용합니다.
