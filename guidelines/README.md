# WhatTime 프론트엔드 지침 (Guidelines)

이 디렉토리는 WhatTime 프론트엔드 개발을 위한 지침 문서를 포함합니다.

---

## 지침 목록

### 1. UI 컴포넌트 규칙 ([01-ui-components.md](./01-ui-components.md))
- StatusChip, MeetingCard, ParticipantList 등 14개 재사용 컴포넌트의 규칙
- Props 타입 정의, 사용 예시

### 2. 레이아웃 패턴 ([02-layout-patterns.md](./02-layout-patterns.md))
- Home, Create, Response, Detail & Confirm 페이지별 레이아웃 구조
- MUI Grid 시스템, 반응형 패턴, 스티키 액션바

### 3. 상태 색상 ([03-status-colors.md](./03-status-colors.md))
- 응답 상태, 시간 슬롯 상태, 일정 상태별 색상
- MUI 테마 설정, 색상 사용 예시

### 4. 데이터 패칭 ([04-data-fetching.md](./04-data-fetching.md))
- TanStack Query 사용법 (useQuery, useMutation)
- API 래퍼 구조, 캐시 전략, 에러 처리

### 5. 타입 정의 ([05-types.md](./05-types.md))
- TypeScript 타입 정의 규칙
- 주요 타입(일정, 참석자, 시간 슬롯, 회의실, API 응답) 정의

### 6. 테스트 가이드라인 ([06-testing.md](./06-testing.md))
- Vitest + React Testing Library 설정
- 컴포넌트/훅/API 래퍼 테스트 방법, 예시

---

## 사용법

모든 지침은 상황에 맞는 문서를 참조하여 작업을 진행하세요.

- 새 컴포넌트를 만들 때: `01-ui-components.md` 참조
- 새 페이지를 만들 때: `02-layout-patterns.md` 참조
- 상태 색상이 필요할 때: `03-status-colors.md` 참조
- 데이터 패칭이 필요할 때: `04-data-fetching.md` 참조
- 타입을 정의할 때: `05-types.md` 참조
- 테스트를 작성할 때: `06-testing.md` 참조

---

## 참고

- 모든 지침은 Phase 1 MVP 기능 기준으로 작성되었습니다.
- Phase 2 로드맵(SSO 외부 데이터 연동, AI 추천 등)은 추후 업데이트 예정입니다.
- 질문이나 개선 제안은 [work-history](../work-history/)에 기록해주세요.
