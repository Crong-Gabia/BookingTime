# Agent & Guideline Boilerplate

새 프로젝트 시작 시 **컨텍스트 손실을 최소화**하기 위한 템플릿 레포입니다.
비개발자 환경에서도 단계별로 진행할 수 있도록 설치/초기화 가이드를 포함합니다.

## 구성

- `AGENTS.md`: 전역 운영 규칙 (단일 진실)
- `docs/conventions/`: 상세 컨벤션 문서
- `docs/context/`: 컨텍스트 전이 템플릿
- `docs/setup/`: 설치/새 프로젝트 가이드
- `templates/`: 백엔드/프론트/문서 AGENTS 템플릿
- `work-history/product-spec/`: 기획서 업데이트 템플릿
- `scaffold/`: 백엔드/프론트 레포 분리용 스캐폴드
- `oh-my-opencode.json`: 에이전트/권한 설정 템플릿 (선택)

## 빠른 시작 (비개발자 포함)

1) 이 레포를 템플릿으로 생성하거나 다운로드
2) `docs/setup/oh-my-open-code-setup.md` 순서대로 설치/인증 진행
3) 프로젝트 루트에서 `opencode` 실행 → `/init`으로 AGENTS 구조 생성
4) `AGENTS.md`와 `docs/conventions/*`를 프로젝트 상황에 맞게 보정
5) `work-history/product-spec/plan.md` 업데이트

## 사용

1) 이 레포를 복사하거나 템플릿으로 생성
2) 프로젝트 구조에 맞게 경로/글롭/권한 조정
3) 루트 README에 AGENTS.md 링크 추가

## 참고 문서
- `docs/setup/oh-my-open-code-setup.md`: Oh My Open Code 설치/인증 가이드
- `docs/setup/new-project.md`: 새 프로젝트 생성 절차
- `docs/guidelines/README.md`: 개발 가이드 전체 목차
