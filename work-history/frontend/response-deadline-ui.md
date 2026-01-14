# 프론트엔드: 응답 마감일 UI (Response Deadline UI)

## 개요

주최자가 회의를 생성할 때 응답 마감일을 옵션으로 설정할 수 있는 UI 추가.

## 페이지

**대상**: CreatePage (회의 생성)

## UI 구조

### 응답 마감 필드

**위치**: CreatePage 하단부 (소요시간 필드 바로 아래)

```tsx
<TextField
  select
  label="응답 마감 기한"
  value={responseDeadlineType}
  onChange={(e) => {
    setResponseDeadlineType(e.target.value as ResponseDeadlineType);
    setCustomDeadline('');
  }}
  fullWidth
  sx={{ mb: 2 }}
>
  <MenuItem value="none">없음(기본)</MenuItem>
  <MenuItem value="today_18">오늘 18:00</MenuItem>
  <MenuItem value="tomorrow_18">내일 18:00</MenuItem>
  <MenuItem value="custom">직접 입력</MenuItem>
</TextField>
```

### 직접 입력 필드

```tsx
{responseDeadlineType === 'custom' && (
  <TextField
    type="datetime-local"
    label="마감 기한 날짜 및 시간 *"
    value={customDeadline}
    onChange={(e) => setCustomDeadline(e.target.value)}
    fullWidth
    InputLabelProps={{ shrink: true }}
    sx={{ mb: 3 }}
  />
)}
```

## 상태 관리

### 타입 정의

```typescript
type ResponseDeadlineType = 'none' | 'today_18' | 'tomorrow_18' | 'custom';

const [responseDeadlineType, setResponseDeadlineType] = useState<ResponseDeadlineType>('none');
const [customDeadline, setCustomDeadline] = useState('');
```

### 유틸티 함수

```typescript
const getToday18ISO = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
  return today.toISOString();
};

const getTomorrow18ISO = () => {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0, 0);
  return tomorrow.toISOString();
};

const getResponseDeadlineISO = (): string | null => {
  switch (responseDeadlineType) {
    case 'today_18':
      return getToday18ISO();
    case 'tomorrow_18':
      return getTomorrow18ISO();
    case 'custom':
      return customDeadline ? new Date(customDeadline).toISOString() : null;
    case 'none':
    default:
      return null;
  }
};
```

## 유효성 검사

```typescript
const responseDeadlineAt = getResponseDeadlineISO();

if (responseDeadlineAt) {
  const deadlineDate = new Date(responseDeadlineAt);
  const now = new Date();

  if (deadlineDate <= now) {
    toast.error('응답 마감 기한은 현재 시간 이후여야 합니다.');
    return;
  }
}
```

## 데이터 흐름

### CreatePage → OrganizerSlotSelectionPage → API

```typescript
// CreatePage에서 meetingData 구성
const meetingData = {
  title,
  description,
  organizerId: 'organizer-1',
  participantIds: validParticipants.map((p) => p.email),
  requiredParticipantIds: [],
  startDate,
  endDate,
  durationMinutes,
  location: '',
  responseDeadlineAt,  // ✨ ISO string 또는 null
};

// navigate로 전달
navigate('/requests/new/slots', {
  state: { meetingData },
});

// OrganizerSlotSelectionPage에서 받기
const meetingData = location.state?.meetingData as MeetingFormData;
interface MeetingFormData {
  // ...
  responseDeadlineAt?: string | null;  // ✨ 타입 정의
}

// API로 전송
const data = await response.json();
```

## API와의 연동

백엔드 DTO 정의와 일치:

```typescript
export interface CreateMeetingRequestDto {
  // ...
  responseDeadlineAt?: string | null;  // 프론트에서 전달
}
```

백엔드에서 ISO 문자열 그대로 `Date`로 변환해서 저장:

```typescript
const responseDeadlineAt = dto.responseDeadlineAt
  ? new Date(dto.responseDeadlineAt)
  : null;

if (dto.responseDeadlineAt && Number.isNaN(responseDeadlineAt?.getTime())) {
  throw new BadRequestException('Invalid response deadline');
}

await this.prisma.meetingRequest.create({
  data: {
    // ...
    responseDeadlineAt: responseDeadlineAt ?? undefined,
  },
});
```

## UX 가이드라인

- **기본값**: "없음(기본)"이 선택되어 있음 → 사용자가 별도 설정하지 않아도 넘어갈 수 있음
- **빠른 선택**: "오늘 18:00", "내일 18:00"으로 자주 사용되는 패턴 → 직관적 UX
- **커스텀**: `datetime-local` input으로 정밀한 시간 설정 가능
- **유효성**: 마감일이 현재 시각보다 과거면 `toast.error()`로 차단

## 참고

회의 생성 후 슬롯 선택 페이지(OrganizerSlotSelectionPage)에서는 마감일 설정만 표시하고, 추가로 수정하지 않음.

마감일 수정은 별도 기능으로 계획(대시보드/편집 기능)에서 구현.
