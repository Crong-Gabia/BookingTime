# Source Mapping & Recommended Role Combos

이 문서는 **기존 지침 파일을 옮기지 않고**, 외부로 이동 가능한 구조를 위한
"분류/매핑 표"와 "역할 조합"을 제공합니다.

---

## 1) 역할 조합 (Source-based Recommended Combos)

### A. Planning/Strategy
- Orchestrator + Architecture/Review Advisor
- External Reference Research (필요 시)

### B. Codebase Exploration
- Orchestrator + Codebase Exploration

### C. Frontend Implementation
- Orchestrator + Frontend UI/UX
- Codebase Exploration (패턴 탐색)

### D. Backend Implementation
- Orchestrator + Backend
- Architecture/Review Advisor (설계 변경 시)

### E. Docs/Guidelines
- Orchestrator + Documentation
- External Reference Research (외부 표준 인용 시)

### F. Multimodal Requirement Extraction
- Orchestrator + Multimodal Analysis

---

## 2) 분류 매핑 표 (Migration Mapping)

> 기존 파일을 **이동하지 않고**, 외부 프로젝트로 옮길 때의 "목표 위치"를 제시한다.

| 현재 위치(예시) | 분류 | 목표 위치(boilerplate 기준) | 비고 |
|:---|:---|:---|:---|
| /AGENTS.md | 전역 운영 규칙 | /AGENTS.md | 단일 진실 유지 |
| /docs/guides/agents.md | 전역 컨벤션 상세 | /docs/conventions/code-style.md | 상세 규칙만 이동 |
| /guidelines/*.md | UI/FE 지침 | /docs/conventions/ (또는 frontend/AGENTS.md) | 프로젝트에 맞게 분리 |
| /.claude/rules/*.mdc | 조건부 규칙 | /.claude/rules/*.mdc | 그대로 유지 |
| /docs/reference/* | 레퍼런스 | /docs/reference/* | 선택 이동 |
| /work-history/* | 히스토리 | /docs/context/ or /work-history/ | 프로젝트 선택 |

---

## 3) 비모노레포 적용 기준

### Backend-only
- /AGENTS.md
- backend/AGENTS.md
- /docs/conventions/*
- /.claude/rules/*

### Frontend-only
- /AGENTS.md
- frontend/AGENTS.md
- /docs/conventions/*
- /.claude/rules/*

### Split Repos (backend + frontend)
- 두 프로젝트에 각각 동일 boilerplate 적용
- 전역 규칙은 동일 템플릿을 기반으로 시작
