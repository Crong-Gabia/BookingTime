# 프론트엔드: 토스트 알림 (Toast Notifications)

## 개요

사용자 피드백(`alert()`, `confirm()`, `prompt()`)을 토스트 알림으로 통일하여 UX 개선.

## 라이브러리 도입

### 의존성 추가

**파일**: `apps/web/package.json`

```json
{
  "dependencies": {
    "@mui/material": "^6.3.0",
    "@tanstack/react-query": "^5.62.7",
+   "notistack": "^3.0.2",  // ✨ 추가
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.1.1"
  }
}
```

**명령**: `pnpm --filter web add notistack`

## 공통 컴포넌트

### useToast 훅

**파일**: `apps/web/src/hooks/useToast.ts`

```typescript
import { useCallback } from 'react';
import { useSnackbar, type OptionsObject, type SnackbarKey, type VariantType } from 'notistack';

type ToastOptions = Omit<OptionsObject, 'variant'>;

export function useToast() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const show = useCallback(
    (message: string, variant: VariantType, options?: ToastOptions): SnackbarKey => {
      return enqueueSnackbar(message, { variant, ...options });
    },
    [enqueueSnackbar],
  );

  const success = useCallback((message: string, options?: ToastOptions) => show(message, 'success', options), [show]);
  const error = useCallback((message: string, options?: ToastOptions) => show(message, 'error', options), [show]);
  const info = useCallback((message: string, options?: ToastOptions) => show(message, 'info', options), [show]);
  const warning = useCallback((message: string, options?: ToastOptions) => show(message, 'warning', options), [show]);

  return {
    show,
    success,
    error,
    info,
    warning,
    close: closeSnackbar,
  };
}
```

**기능**: `success`, `error`, `info`, `warning` 네 가지 타입의 토스트 함수 제공

## 앱 루트 설정

### main.tsx

**파일**: `apps/web/src/main.tsx`

**변경사항**:

```typescript
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
+ import { SnackbarProvider } from 'notistack';  // ✨ 추가

// ...

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
+     <SnackbarProvider
+       maxSnack={3}
+       autoHideDuration={3000}
+       anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
+     >
        <BrowserRouter>
          <App />
        </BrowserRouter>
+     </SnackbarProvider>
    </ThemeProvider>
  </QueryClientProvider>,
  </React.StrictMode>,
);
```

**설명**:
- 최대 3개까지 중첩
- 기본 자동 닫힘: 3초
- 위치: 하단 중앙

## 페이지별 변경

### CreatePage

**파일**: `apps/web/src/pages/CreatePage.tsx`

**변경사항**:

```typescript
+ import { useToast } from '@/hooks/useToast';

export default function CreatePage() {
  const navigate = useNavigate();
+ const toast = useToast();

  // ...

  const handleSubmit = () => {
    if (!title || !startDate || !endDate) {
-     alert('필수 정보를 모두 입력해주세요.');
+     toast.error('필수 정보를 모두 입력해주세요.');
      return;
    }

    const validParticipants = participants.filter((p) => p.email && p.name);
    if (validParticipants.length === 0) {
-     alert('최소 1명 이상의 참석자를 입력해주세요.');
+     toast.error('최소 1명 이상의 참석자를 입력해주세요.');
      return;
    }

+   const responseDeadlineAt = getResponseDeadlineISO();
+
+   if (responseDeadlineAt) {
+     const deadlineDate = new Date(responseDeadlineAt);
+     const now = new Date();
+
+     if (deadlineDate <= now) {
+       toast.error('응답 마감 기한은 현재 시간 이후여야 합니다.');
+       return;
+     }
+   }

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
+     responseDeadlineAt,
    };

    navigate('/requests/new/slots', {
      state: { meetingData },
    });
  };
}
```

### ResponsePage

**파일**: `apps/web/src/pages/ResponsePage.tsx`

**변경사항**:

```typescript
+ import { useToast } from '@/hooks/useToast';

export default function ResponsePage() {
  const { id } = useParams();
  const navigate = useNavigate();
+ const toast = useToast();

  // ...

  const submitMutation = useMutation({
    mutationFn: submitResponse,
    onSuccess: () => {
+     toast.success('응답이 제출되었습니다!');
      navigate('/');
    },
+   onError: (error: Error) => {
+     toast.error(`제출 실패: ${error.message}`);
+   },
  });

  const handleSubmit = () => {
    if (Object.keys(slotSelections).length === 0) {
-     alert('최소 하나 이상의 시간을 선택해주세요.');
+     toast.error('최소 하나 이상의 시간을 선택해주세요.');
      return;
    }
  };
}
```

### DashboardPage

**파일**: `apps/web/src/pages/DashboardPage.tsx`

**변경사항**:

```typescript
+ import { useToast } from '@/hooks/useToast';

export default function DashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
+ const toast = useToast();

  // 리마인드 mutation
  const remindMutation = useMutation({
    mutationFn: (userId: string) => sendReminder(id || '', userId),
    onSuccess: (result) => {
      if (result.sent) {
-       alert('독촉 알림을 보냈습니다.');
+       toast.success('독촉 알림을 보냈습니다.');
      } else {
-       alert('10분 내에 이미 알림을 보냈습니다.');
+       toast.info('10분 내에 이미 알림을 보냈습니다.');
      }
    },
+   onError: () => {
+     toast.error('알림 전송에 실패했습니다.');
+   },
  });

  // 확정 mutation
  const confirmMutation = useMutation({
    mutationFn: (dto: ConfirmMeetingDto) => confirmMeeting(dto),
    onSuccess: () => {
-     alert('회의가 확정되었습니다!');
+     toast.success('회의가 확정되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['dashboard', id] });
      navigate('/');
    },
+   onError: (error: Error) => {
+     toast.error(`확정 실패: ${error.message}`);
+   },
  });

  const handleConfirm = async () => {
    if (!selectedTimeSlot) {
-     alert('확정할 시간을 선택해주세요.');
+     toast.error('확정할 시간을 선택해주세요.');
      return;
    }
  };

- const handleCopyLink = () => {
+ const handleCopyLink = async () => {
    const responseLink = `${window.location.origin}/requests/${id}/respond`;
-   navigator.clipboard.writeText(responseLink);
-   alert('응답 링크가 복사되었습니다!');
+   try {
+     await navigator.clipboard.writeText(responseLink);
+     toast.success('응답 링크가 복사되었습니다!');
+   } catch {
+     toast.error('링크 복사에 실패했습니다.');
+   }
  };
}
```

### OrganizerSlotSelectionPage

**파일**: `apps/web/src/pages/OrganizerSlotSelectionPage.tsx`

**변경사항**:

```typescript
+ import { useToast } from '@/hooks/useToast';

export default function OrganizerSlotSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
+ const toast = useToast();

  // ...

  useEffect(() => {
    if (!meetingData || !meetingData.title || !meetingData.startDate || !meetingData.endDate) {
-     alert('회의 정보가 없습니다. 다시 생성해주세요.');
+     toast.error('회의 정보가 없습니다. 다시 생성해주세요.');
      navigate('/new');
      return;
    }
  }, [meetingData, navigate]);

  const handleSubmit = async () => {
    const selectedCount = Object.keys(selectedSlots).length;
    if (selectedCount === 0) {
-     alert('최소 하나 이상의 시간을 선택해주세요.');
+     toast.error('최소 하나 이상의 시간을 선택해주세요.');
      return;
    }

    try {
      const data = await response.json();
-     alert(`회의 요청이 생성되었습니다!\n\n대시보드 링크:\n${window.location.origin}/requests/${data.id}/dashboard`);
+     toast.success('회의 요청이 생성되었습니다!');
      navigate(`/requests/${data.id}/dashboard`);
    } catch {
-     alert('회의 요청 생성에 실패했습니다.');
+     toast.error('회의 요청 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
}
```

## 가이드라인 업데이트

**파일**: `guidelines/01-ui-components.md`

```markdown
## 0. 사용자 알림(Toast) 사용
- `window.alert`, `confirm`, `prompt` 사용은 금지합니다.
- 사용자 피드백(성공/실패/진행중)은 **토스트 알림(Snackbar/Toast)** 으로 통일합니다.
- 라이브러리 사용 가능. MUI 기반 프로젝트이므로 기본 추천은 `notistack`(MUI Snackbar 기반)입니다.

**권장 UX 규칙**:
- 성공: 짧게(1–2초), 자동 닫힘
- 에러: 3–5초, 사용자가 읽을 시간 제공
- 서버 에러는 코드(`message`)가 아니라 사람이 읽을 문장으로 매핑해서 표시
```

**파일**: `guidelines/04-data-fetching.md`

```markdown
- 사용자에게 에러 메시지를 표시합니다. (브라우저 `alert` 금지 → 토스트로 통일)

// 성공 토스트(권장): enqueueSnackbar('응답이 제출되었습니다!', { variant: 'success' })
// 실패 토스트(권장): enqueueSnackbar('제출에 실패했습니다. 다시 시도해주세요.', { variant: 'error' })
```

## 검증

```bash
✅ pnpm --filter web build
✅ pnpm --filter web test (148/148 passed)
```

## 정책

- **alert/confirm/prompt 금지**: 모든 사용자 피드백은 `useToast` 훅을 통해 토스트로 표시
- **일관성**: `success`/`error`/`info`/`warning` 네 가지 타입 사용
- **자동 닫힘**: 기본 3초, 최대 3개 중첩
