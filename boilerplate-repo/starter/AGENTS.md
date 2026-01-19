# Agent Operating Guide

이 문서는 프로젝트 전역 지침의 **단일 진실(Single Source of Truth)** 입니다.
전역 규칙은 여기서만 유지하고, 디렉터리별 규칙은 각 디렉터리의 `AGENTS.md`에 둡니다.
조건부 규칙(예: 특정 도구 전용)은 필요 시 별도 폴더로 분리합니다.

---

## 0. Single Source of Truth

- 전역 운영 규칙: **/AGENTS.md** (이 문서)
- 상세 컨벤션: **/docs/conventions/**
- 조건부 규칙: (사용 도구에 따라 선택)

---

## 1. 프로젝트 운영 규칙 (불변)

- 전역 정책은 루트 AGENTS.md에만 둔다.
- 디렉터리 규칙은 해당 디렉터리의 AGENTS.md로만 관리한다.
- 훅(Pre/Post/Stop)은 자동화만 수행하고, 정책은 문서로 분리한다.

### MUST READ (세션 시작 시)
- `docs/guidelines/README.md`
- `docs/conventions/typescript-style.md`
- `docs/conventions/db-naming.md`
- `docs/guidelines/workflow.md`
- `work-history/context/current.md`

### CONTEXT LOGGING (항상)
- 작업 시작/재개 시: `work-history/context/current.md` 업데이트
- 의사결정 발생 시: `work-history/context/decision-log.md`에 기록
- 막힘(Blocked) 발생 시: `work-history/context/blocked.md` 템플릿으로 기록

### WHEN YOU TOUCH UI
- `docs/guidelines/ui-common-guidelines.md`

### WHEN YOU WRITE TESTS
- `docs/guidelines/testing.md`

### WHEN YOU TOUCH API/DB
- `docs/conventions/db-naming.md`

---

## 2. 역할 기반 MUST READ 매핑

> 비용(컨텍스트) 절감을 위해, 역할별로 "항상 읽어야 하는 문서"를 고정합니다.
> 추가로 필요한 문서는 1) 상단 MUST/WHEN 섹션 또는 2) 작업 범위(기능 명세서)에 따라 선택합니다.

### Orchestrator (조정자)
- MUST: `docs/guidelines/README.md`, `docs/guidelines/workflow.md`, `work-history/context/current.md`
- SHOULD: `work-history/product-spec/plan.md`, `work-history/product-spec/decisions.md`

### Architecture/Review (설계/리뷰)
- MUST: `docs/conventions/typescript-style.md`, `docs/conventions/db-naming.md`
- SHOULD: `work-history/product-spec/plan.md`, `work-history/product-spec/decisions.md`

### External Research (외부 레퍼런스)
- MUST: `work-history/product-spec/plan.md`
- SHOULD: 해당 영역 컨벤션(예: `docs/conventions/db-naming.md`)

### Codebase Exploration (내부 탐색)
- MUST: `work-history/context/current.md`, `docs/conventions/typescript-style.md`

### Frontend UI/UX (UI)
- MUST: `docs/guidelines/ui-common-guidelines.md`
- SHOULD: `docs/guidelines/layout-patterns.md`, `docs/guidelines/status-colors.md`, `docs/guidelines/ui-components.md`

### Backend (서버/API/DB)
- MUST: `docs/conventions/db-naming.md`, `docs/conventions/typescript-style.md`
- SHOULD: `docs/conventions/backend-structure.md`

### Documentation (문서)
- MUST: `work-history/context/current.md`
- SHOULD: `docs/guidelines/workflow.md`

### Multimodal Analysis (이미지/PDF)
- MUST: `work-history/context/current.md`
- SHOULD: `work-history/product-spec/features/_template.md`

---

## 3. 역할 기반 카탈로그 (에이전트/모델 무관)

### Orchestrator
- 작업 분해/할당/취합, 최종 결정
- 보고 포맷 준수

### Architecture/Review
- 설계/리스크 평가

### External Research
- 외부 레퍼런스/문서/예제 조사

### Codebase Exploration
- 내부 패턴 탐색/후보 위치 추출

### Frontend UI/UX
- UI/UX 시각 변경

### Backend
- 서버/API/DB 로직 변경

### Documentation
- 문서 작성

### Multimodal Analysis
- 이미지/PDF 분석

---

## 4. 병렬 실행 규약

- **제안 → 확정 → 반영** 단계 분리
- 파일 소유권 충돌 시 오케스트레이터가 우선권 조정

---

## 5. 보고 포맷 (강제)

```
Status: proposed | in_progress | blocked | ready_for_review
Summary:
Changes:
Decisions:
Risks:
Questions:
```

---

## 6. 전역 컨벤션 요약

- 코드 컨벤션 상세: docs/conventions/code-style.md
- DB 네이밍 상세: docs/conventions/db-naming.md
