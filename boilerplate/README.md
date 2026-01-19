# Boilerplate (Agent & Guideline Base)

이 디렉터리는 **새 프로젝트에 복사 가능한 지침/규칙 보일러플레이트**입니다.
기존 프로젝트 지침은 변경하지 않고, 여기서 분리/정리된 형태를 제공합니다.

## 포함 구조

- `AGENTS.md`: 전역 운영 규칙(단일 진실)
- `.claude/rules/`: 파일 패턴 기반 규칙
- `docs/conventions/`: 상세 컨벤션 문서
- `docs/context/`: 컨텍스트 전이 문서
- `oh-my-opencode.json`: 에이전트 설정 템플릿
- `templates/`: 백엔드/프론트 분리 템플릿

## 사용법

1) 새 프로젝트에 `boilerplate/` 전체를 복사
2) 프로젝트 구조에 맞게 경로/글롭/권한 조정
3) 루트 README에 AGENTS.md 링크 추가

## 분리 적용 예시 (모노레포가 아닌 경우)

- 백엔드 프로젝트
  - `AGENTS.md` (전역)
  - `backend/AGENTS.md` (템플릿: templates/AGENTS-backend.md)
  - `.claude/rules/` + `docs/conventions/`

- 프론트엔드 프로젝트
  - `AGENTS.md` (전역)
  - `frontend/AGENTS.md` (템플릿: templates/AGENTS-frontend.md)
  - `.claude/rules/` + `docs/conventions/`
