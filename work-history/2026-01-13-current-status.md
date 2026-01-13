# 프로젝트 현황 및 작업 기록

## 생성 날짜
- 2026-01-13

## 개요

본 문서는 BookingTime 프로젝트의 현재 상태, 완료된 작업, 그리고 진행 중인 작업을 요약합니다.

---

## 브랜치 현황

### 활성 브랜치

| 브랜치 | 상태 | 설명 | 최근 작업 |
|---------|-------|-------|-----------|
| `feature/frontend-components` | **ACTIVE** | 프론트엔드 컴포넌트 및 페이지 MUI 리팩터링 | develop 브랜치 머지 완료 (ff4b868) |
| `develop` | 통합 브랜치 | 개발 통합 기준 브랜치 | 테스트 파일 추가 (60636d7, b0f19bf) |
| `main` | 프로덕션 | 안정된 프로덕션 코드 | TimeGrid 컴포넌트 (3794787) |

### 브랜치 동기화 상태

- **develop**: origin/develop보다 2 커밋 앞섬 (테스트 파일 추가)
- **main**: origin/main보다 1 커밋 앞섬 (RoomSelector 컴포넌트)
- **feature/frontend-components**: 최신 develop와 동기화 완료

---

## 완료된 작업

### 1. 프론트엔드 컴포넌트 구현 (2026-01-13)

**커밋 시리즈**: 3f35aa9 ~ edb1f82

완료된 컴포넌트 (7개):
1. ✅ `MeetingCard` - 일정 카드
2. ✅ `ParticipantList` - 참석자 리스트
3. ✅ `TimeGrid` - 시간 그리드
4. ✅ `TimeSlot` - 개별 시간 슬롯
5. ✅ `RoomSelector` - 회의실 선택
6. ✅ `CommonSlots` - 공통 가능 시간 리스트
7. ✅ `FloatingButton` - 플로팅 버튼
8. ✅ `StickyActionBar` - 고정 하단 액션바

위치: `apps/web/src/components/`

### 2. API 래퍼 구현 (2026-01-13)

**커밋**: 30ad480

구현된 API 함수:
- `checkHealth()` - 서버 헬스 체크
- `fetchDashboard(requestId)` - 대시보드 데이터 조회
- `createMeeting(request)` - 회의 요청 생성
- `submitResponse(requestId, response)` - 응답 제출
- `sendReminder(requestId, userId)` - 리마인드 전송
- `confirmMeeting(requestId, confirmation)` - 회의 확정

위치: `apps/web/src/api/`

### 3. 페이지 MUI 리팩터링 (2026-01-13)

**커밋 시리즈**: cf8c1a9 ~ a774723

완료된 페이지:
- ✅ `HomePage` - MeetingCard, FloatingButton 적용
- ✅ `DashboardPage` - ParticipantList, CommonSlots, RoomSelector 적용
- ✅ `ResponsePage` - TimeGrid, StickyActionBar 적용
- ✅ `CreatePage` - MUI TextField, Button, Grid 적용

위치: `apps/web/src/pages/`

### 4. 테스트 파일 작성 (2026-01-13, develop 브랜치)

**커밋**: b0f19bf, 60636d7

작성된 테스트 파일:
- ✅ `apps/web/src/pages/HomePage.test.tsx`
- ✅ `apps/web/src/pages/DashboardPage.test.tsx`
- ✅ `apps/web/src/pages/ResponsePage.test.tsx`
- ✅ `apps/web/src/pages/CreatePage.test.tsx`

참고: 컴포넌트 및 API 래퍼 테스트 파일은 아직 작성되지 않음

### 5. 개발 가이드라인 작성

문서 작성 완료:
- ✅ `AGENTS.md` - Git 워크플로우, 컨벤션, 에러 핸들링
- ✅ `guidelines/01-ui-components.md` - UI 컴포넌트 규칙
- ✅ `guidelines/02-layout-patterns.md` - 레이아웃 패턴
- ✅ `guidelines/03-status-colors.md` - 상태 색상
- ✅ `guidelines/04-data-fetching.md` - 데이터 패칭 (TanStack Query)
- ✅ `guidelines/05-types.md` - 타입 정의
- ✅ `guidelines/06-testing.md` - 테스트 가이드라인
- ✅ `work-history/TEMPLATE.md` - 작업 기록 템플릿 (토큰 사용량 섹션 추가)

### 6. OpenCode 설정 (2026-01-13)

**커밋**: 55378bd

완료된 작업:
- ✅ OpenCode 1.1.15 설치
- ✅ Oh My Open Code 플러그인 설정
- ✅ AGENTS.md에 SSL 오류 해결 가이드 추가
- ✅ gh CLI 설치 및 인증

### 7. 개발 스크립트 작성 (2026-01-13)

생성된 스크립트:
- ✅ `scripts/setup-dev-env.sh` - 개발 환경 자동 설정
- ✅ `scripts/stop-dev-env.sh` - 개발 환경 중지
- ✅ `scripts/reset-db.sh` - 데이터베이스 리셋

---

## 진행 중인 작업

### 현재 작업: `feature/frontend-components` 브랜치

**상태**: develop 브랜치와 동기화 완료
**최근 커밋**: ff4b868 (merge)

**다음 단계**:
1. develop 브랜치 변경사항을 feature 브랜치로 머지 (완료)
2. 테스트 파일 검증 및 테스트 실행
3. 컴포넌트 테스트 파일 작성
4. API 래퍼 테스트 파일 작성
5. PR 생성 (develop로)

---

## 남은 작업

### 우선순위 1: 테스트 커버리지 확대

**대상**: `apps/web/src/components/` 및 `apps/web/src/api/`

작업 목록:
- [ ] `status-chip.test.tsx`
- [ ] `meeting-card.test.tsx`
- [ ] `participant-list.test.tsx`
- [ ] `time-slot.test.tsx`
- [ ] `time-grid.test.tsx`
- [ ] `room-selector.test.tsx`
- [ ] `common-slots.test.tsx`
- [ ] `floating-button.test.tsx`
- [ ] `sticky-action-bar.test.tsx`
- [ ] `section-header.test.tsx`
- [ ] `progress-bar.test.tsx`
- [ ] `loading-state.test.tsx`
- [ ] `empty-state.test.tsx`
- [ ] `confirm-dialog.test.tsx`
- [ ] `api/health.test.ts`
- [ ] `api/meeting.test.ts`

### 우선순위 2: @shared/dto 연동

**상태**: API 래퍼에서 임시 타입 사용 중

작업:
- [ ] `packages/shared/src/dto.ts` 타입 정의 완료
- [ ] API 래퍼에서 @shared 패키지 타입 사용
- [ ] 프론트엔드 컴포넌트에서 @shared 타입 사용

### 우선순위 3: Pull Request 생성

**브랜치**: `feature/frontend-components`

단계:
- [ ] 로컬 develop 브랜치를 origin/develop에 푸시 (2 커밋 앞섬)
- [ ] feature/frontend-components 브랜치 푸시
- [ ] PR 생성 (Base: develop)
- [ ] PR 리뷰 요청

---

## 아키텍처 개요

### 기술 스택

**Backend**:
- NestJS 10.4.15 + TypeScript
- Prisma ORM 6.1.0
- PostgreSQL 17 (Docker)
- Redis 7 (구성됨)

**Frontend**:
- React 19.0.0 + TypeScript
- Vite 6.0.3
- React Router 7.1.1
- TanStack Query 5.62.7
- MUI 6.3.0

**Tooling**:
- pnpm + Turborepo (Monorepo)
- Vitest + Jest (테스트)
- ESLint + Prettier (코드 품질)

### 디렉토리 구조

```
BookingTime/
├── apps/
│   ├── api/           # NestJS 백엔드 (Port 3000)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── meeting/    # 회의 스케줄링 로직
│   │   │   │   ├── health/     # 헬스체크
│   │   │   │   └── adapters/   # 외부 서비스 어댑터
│   │   │   └── common/        # 공통 서비스
│   │   └── prisma/           # 데이터베이스 스키마
│   └── web/           # React 프론트엔드 (Port 5173)
│       ├── src/
│       │   ├── components/  # 재사용 UI 컴포넌트 (14개)
│       │   ├── pages/       # 페이지 컴포넌트 (4개)
│       │   ├── api/         # API 래퍼
│       │   └── App.tsx      # 라우터 설정
│       └── vite.config.ts
├── packages/
│   └── shared/        # 공유 DTO, 타입
├── guidelines/       # 프론트엔드 개발 가이드 (6개)
├── scripts/         # 개발 스크립트 (3개)
├── infra/docker/     # Docker Compose 설정
└── work-history/    # 작업 기록
```

---

## 사용 가능한 명령어

### 빠른 시작

```bash
# 개발 환경 자동 설정
./scripts/setup-dev-env.sh

# 개발 환경 중지
./scripts/stop-dev-env.sh

# 데이터베이스 리셋
./scripts/reset-db.sh
```

### 개발 서버

```bash
# 전체 (API + Web)
pnpm run dev

# 개별
pnpm --filter api dev
pnpm --filter web dev
```

### 테스트

```bash
# 전체 테스트
pnpm test

# 특정 파일
pnpm test apps/web/src/components/meeting-card.test.tsx

# 특정 이름
pnpm test -t "MeetingCard"
```

### 데이터베이스

```bash
# 마이그레이션
pnpm --filter api db:migrate:dev

# Prisma Studio (GUI)
pnpm --filter api prisma studio

# 시드 데이터
pnpm --filter api db:seed
```

---

## Git 워크플로우

### 브랜치 전략

- **기준 브랜치**: `develop`
- **기능 브랜치**: `feature/기능명` (kebab-case)
- **절대 main에 직접 push 금지**

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
docs: 문서 수정
test: 테스트 코드 추가/수정
chore: 빌드/설정 관련 작업
```

### PR 작성 가이드

- **Base**: 항상 `develop` 브랜치
- **Title**: `[type]: 간단한 설명`
- **Merge**: Squash and merge 권장

---

## 주요 의사결정

1. **snake_case 컨벤션**: 변수/함수명은 snake_case 사용 (회사 규칙)
2. **MUI 사용**: 기존 설치된 MUI를 기반으로 컴포넌트 작성
3. **TanStack Query**: 모든 데이터 패칭에 사용
4. **모바일 우선**: 반응형 디자인, 스티키 액션바
5. **UTC 저장 / KST 표시**: 데이터베이스는 UTC, UI는 KST
6. **30분 슬롯**: 09:00-18:00, 점심시간 제외

---

## 다음 단계

### 단기 (이번 주)

1. [ ] 테스트 파일 작성 (컴포넌트 14개, API 2개)
2. [ ] 테스트 실행 및 버그 수정
3. [ ] @shared/dto 연동 완료
4. [ ] feature/frontend-components PR 생성 및 병합

### 중기 (다음 주)

1. [ ] Phase 2 기획 (SSO, 외부 데이터 연동, AI 추천)
2. [ ] 어댑터 인터페이스 실제 구현 (HR, Room, Calendar)
3. [ ] 테스트 커버리지 80% 달성
4. [ ] 배포 설정 검토

---

## 참고 문서

- `README.md` - 프로젝트 개요
- `work-history/2026-01-13-frontend-components-implementation.md` - 프론트엔드 작업 상세 기록
- `work-history/2026-01-13-api-wrapper.md` - API 래퍼 작업 기록
- `AGENTS.md` - 개발 가이드라인
- `guidelines/README.md` - 프론트엔드 지침 목록
