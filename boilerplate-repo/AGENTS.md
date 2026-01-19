# Agent Operating Guide

이 문서는 프로젝트 전역 지침의 **단일 진실(Single Source of Truth)** 입니다.
전역 규칙은 여기서만 유지하고, 디렉터리별 규칙은 각 디렉터리의 `AGENTS.md`에 둡니다.
조건부 규칙은 `.claude/rules/*.mdc`로 이동합니다.

---

## 0. Single Source of Truth

- 전역 운영 규칙: **/AGENTS.md** (이 문서)
- 상세 컨벤션: **/docs/conventions/**
- 조건부 규칙: **/.claude/rules/**

---

## 1. 프로젝트 운영 규칙 (불변)

- 전역 정책은 루트 AGENTS.md에만 둔다.
- 디렉터리 규칙은 해당 디렉터리의 AGENTS.md로만 관리한다.
- 파일 패턴 기반 규칙은 `.claude/rules/*.mdc`에만 둔다.
- 훅(Pre/Post/Stop)은 자동화만 수행하고, 정책은 문서로 분리한다.

---

## 2. 역할 기반 카탈로그 (에이전트/모델 무관)

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

## 3. 병렬 실행 규약

- **제안 → 확정 → 반영** 단계 분리
- 파일 소유권 충돌 시 오케스트레이터가 우선권 조정

---

## 4. 보고 포맷 (강제)

```
Status: proposed | in_progress | blocked | ready_for_review
Summary:
Changes:
Decisions:
Risks:
Questions:
```

---

## 5. 전역 컨벤션 요약

- 코드 컨벤션 상세: docs/conventions/code-style.md
- DB 네이밍 상세: docs/conventions/db-naming.md
