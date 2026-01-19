# Agent Operating Guide (Boilerplate)

이 문서는 프로젝트 전역 지침의 **단일 진실(Single Source of Truth)** 입니다.
전역 규칙은 여기서만 유지하고, 디렉터리별 규칙은 각 디렉터리의 `AGENTS.md`에 둡니다.
조건부 규칙은 `.claude/rules/*.mdc`로 이동합니다.

---

## 0. Single Source of Truth

- 전역 운영 규칙: **/AGENTS.md** (이 문서)
- 상세 컨벤션: **/docs/conventions/**
- 조건부 규칙: **/.claude/rules/**
- 에이전트 구성: **/oh-my-opencode.json**

---

## 1. 프로젝트 운영 규칙 (불변)

- 전역 정책은 루트 AGENTS.md에만 둔다.
- 디렉터리 규칙은 해당 디렉터리의 AGENTS.md로만 관리한다.
- 파일 패턴 기반 규칙은 `.claude/rules/*.mdc`에만 둔다.
- 훅(Pre/Post/Stop)은 자동화만 수행하고, 정책은 문서로 분리한다.

---

## 2. 에이전트 카탈로그 (역할/권한/산출물)

> 에이전트/모델 이름이 아닌 **역할 기반**으로 정의한다.
> 실제 권한 매핑은 프로젝트 설정 파일(예: oh-my-opencode.json)에 정의한다.

### Orchestrator (조정자)
- Mission: 작업 분해/할당/취합, 최종 결정
- Allowed Tools: 전체
- Write Access: 전체 (기본)
- Output: Status/Changes/Decisions/Risks/Questions 포맷
- Escalation: 불확실/충돌 시 사용자 결정 요청

### Architecture/Review Advisor
- Mission: 설계/리뷰/리스크 평가
- Allowed Tools: Read/Search 중심
- Write Access: 제한적
- Output: 리스크/대안/권고안
- Escalation: 2회 실패 시 필수

### External Reference Research
- Mission: 외부 레퍼런스/문서/예제 검색
- Allowed Tools: webfetch/gh/검색 도구
- Write Access: 없음
- Output: 링크 + 요약 + 적용 포인트

### Codebase Exploration
- Mission: 내부 패턴 탐색/후보 위치 추출
- Allowed Tools: grep/ast-grep/glob
- Write Access: 없음
- Output: 파일 경로 + 근거 스니펫

### Frontend UI/UX
- Mission: UI/UX 시각 변경
- Write Access: UI 디렉터리만
- Output: 시각 변경사항 + 접근성 체크

### Documentation
- Mission: 문서 작성
- Write Access: docs/ only
- Output: 목차 + 변경 요약

### Multimodal Analysis
- Mission: 이미지/PDF 분석
- Write Access: 없음
- Output: 구조화 요약

---

## 3. 병렬 실행 규약

- **제안 → 확정 → 반영** 단계를 분리한다.
- 파일 소유권이 겹치면 오케스트레이터가 우선권을 조정한다.
- 작업 단위는 디렉터리/모듈 기준으로 나눈다.

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
- 변경 시 승인/결정권자: (프로젝트별로 기입)
