# 개발자 가이드라인

이 디렉토리는 WhatTime(BookingTime) 프론트엔드 개발을 위한 지침 문서를 포함합니다.

---

## 지침 목록

### 1. AI 에이전트 사용 ([09-ai-agent-usage.md](./09-ai-agent-usage.md))
- 에이전트 사용 원칙
- 에이전트별 사용 가이드 (Oracle, Librarian, Explore, Frontend UI/UX Engineer, Document Writer)
- 병렬 실행 최적화
- 프롬프트 작성 가이드라인

### 2. UI 컴포넌트 규칙 ([01-ui-components.md](./01-ui-components.md))
- StatusChip, MeetingCard, ParticipantList 등 14개 재사용 컴포넌트의 규칙
- Props 타입 정의, 사용 예시

### 3. 레이아웃 패턴 ([02-layout-patterns.md](./02-layout-patterns.md))
- Home, Create, Response, Detail & Confirm 페이지별 레이아웃 구조
- MUI Grid 시스템, 반응형 패턴, 스티키 액션바

### 4. 상태 색상 ([03-status-colors.md](./03-status-colors.md))
- 응답 상태, 시간 슬롯 상태, 일정 상태별 색상
- MUI 테마 설정, 색상 사용 예시

### 5. 데이터 패칭 ([04-data-fetching.md](./04-data-fetching.md))
- TanStack Query 사용법 (useQuery, useMutation)
- API 래퍼 구조, 캐시 전략, 에러 처리

### 6. 타입 정의 ([05-types.md](./05-types.md))
- TypeScript 타입 정의 규칙
- 주요 타입(일정, 참석자, 시간 슬롯, 회의실, API 응답) 정의

### 7. 테스트 가이드라인 ([06-testing.md](./06-testing.md))
- Vitest + React Testing Library 설정
- 컴포넌트/훅/API 래퍼 테스트 방법, 예시

### 8. Git 브랜치 전략 ([07-git-branch-strategy.md](../../guidelines/07-git-branch-strategy.md))
- 브랜치 패턴 (feature/, fix/, refactor/)
- PR 생성 및 머지 가이드라인
- Conventional Commits 규칙

### 9. 배포 가이드 ([08-deployment.md](./08-deployment.md))
- 배포 플랫폼 비교 (Railway, Vercel+Neon, Coolify, AWS)
- 환경변수 설정
- CI/CD 파이프라인
- 롤백 전략

### 10. Canvas(LMS) 계정 설정 ([10-canvas-setup.md](./10-canvas-setup.md))
- Canvas 계정 생성
- GitHub 연동
- 프로젝트 초대/접속 방법
- 문제 해결 가이드

---

## 사용법

모든 지침은 상황에 맞는 문서를 참조하여 작업을 진행하세요.

### 작업 시작 전
1. [개발 가이드라인 (General)](../../docs/guides/agents.md) 확인
2. [Git 브랜치 전략](../../guidelines/07-git-branch-strategy.md) 확인
3. [AI 에이전트 사용 가이드](./09-ai-agent-usage.md) 확인

### 기능 개발 시
1. [UI 컴포넌트 규칙](./01-ui-components.md) 참조
2. [레이아웃 패턴](./02-layout-patterns.md) 참조
3. [상태 색상](./03-status-colors.md) 참조

### 데이터 통신 시
1. [데이터 패칭](./04-data-fetching.md) 참조
2. [타입 정의](./05-types.md) 참조

### 테스트 작성 시
1. [테스트 가이드라인](./06-testing.md) 참조

### 배포 시
1. [배포 가이드](./08-deployment.md) 확인
2. [Canvas 설정](./10-canvas-setup.md) 확인

---

## 참고

- [프로젝트 README](../../README.md)
- [기획서](../../work-history/product-spec/index.md)
- [작업 기록](../../work-history/)
