# Agent Operating Guide

이 레포에서 작업하는 에이전트(사람/봇 포함)가 **반드시 지켜야 하는 운영 규칙**입니다.

## GitHub Issues = Single Source of Truth

### 1) 작업 시작/재개 루틴 (필수)
- **매 세션 시작/재개 시** 아래 2개 이슈를 먼저 확인한다.
  - `#6 Agent Blockers: Need Input / Decisions` (의사결정/blocked 전용)
  - **현재 작업 중인 기능 이슈** (예: `#11 External Adapters`)
- 확인 후, 현재 상태를 해당 기능 이슈에 **짧게 코멘트로 남긴다.**
  - 형식 예: `STATUS: 진행중`, `DONE: ...`, `NEXT: ...`, `BLOCKED: ...`

### 2) 의사결정/질문이 필요할 때 (필수)
- 채팅에서만 묻지 않는다.
- 반드시 `#6`에 아래 포맷으로 코멘트 + 멘션을 남긴다.

```
CONTEXT: 어떤 브랜치/PR/이슈에서 발생했는지
BLOCKED: 무엇이 없어서 진행이 불가한지
OPTIONS: 선택지 1/2/3
RECOMMENDATION: 추천안
```

### 3) 결정사항 기록 (필수)
- 사용자가 결정/답변을 주면, 반드시 `#6`에 **Decision Recorded** 코멘트로 남긴다.
- 이후 구현/수정은 해당 결정사항을 기준으로 진행한다.

### 4) PR 리뷰 대응 루틴 (필수)
- PR에 리뷰 코멘트(리뷰/라인 코멘트/스레드)가 달리면, **먼저 전부 읽고 TODO로 쪼갠 뒤** 작업한다.
- 수정이 필요한 코멘트는 **모두 반영**하고, 반영이 불필요한 코멘트는 **왜 반영하지 않는지** 근거를 PR 스레드에 남긴다.
- 수정 후에는 반드시:
  - 로컬 `build`/`test`를 실행해 통과를 확인한다.
  - PR에 `DONE:` 코멘트로 **무엇을 어떻게 고쳤는지** 요약을 남긴다.

## CLI (권장)
- 이슈 확인: `gh issue view 6 --comments` / `gh issue view <id> --comments`
- 코멘트 작성: `gh issue comment <id> --body "..."`
- PR 확인: `gh pr view <id> --comments` / `gh pr diff <id>`
- PR 머지: `gh pr merge <id> --merge` (필요시 `--squash`)

---

## 문서 읽기 정책 (속도 우선)

문서가 많아도 매번 전부 읽지 않도록, **읽기 비용을 최소화**합니다.

### MUST (세션 시작/재개 시)
- `work-history/context/current.md` (SSOT: 지금 무엇을 하는지/blocked/결정)

### WHEN (해당 작업을 할 때만)
- 코드 변경 시: `docs/conventions/typescript-style.md`
- DB/Prisma 스키마/마이그레이션 변경 시: `docs/conventions/db-naming.md`
- UI/UX(스타일/레이아웃) 변경 시: `guidelines/README.md` + 관련 가이드(예: `guidelines/08-ui-common-guidelines.md`)
- 테스트 작성/수정 시: `docs/guides/06-testing.md` 또는 `apps/*`의 테스트 컨벤션

> 원칙: MUST는 3개 이하로 유지하고, 나머지는 작업 범위에 따라 선택적으로 읽습니다.

## 주의
- 개인/프로덕션 시크릿이 포함된 `.env` 파일 내용은 이슈/PR/코멘트에 절대 붙이지 않는다.
