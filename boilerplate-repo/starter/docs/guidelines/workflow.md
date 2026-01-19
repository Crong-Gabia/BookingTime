# PR / 커밋 / 리뷰 운영 (General)

이 문서는 특정 레포/도구에 종속되지 않는 **일반적인 PR 운영 규칙**입니다.

## 1) 브랜치 전략
- 기본 브랜치: `develop` 또는 `main` 중 하나를 팀에서 고정
- 기능 브랜치: `feature/<short-name>`
- 버그 수정: `fix/<short-name>`

## 2) 커밋 메시지
- Conventional Commits 권장
  - feat, fix, docs, refactor, test, chore

## 3) PR 작성 규칙
- PR은 가능한 작게 (리뷰 15~30분 내)
- PR 본문에 반드시 포함:
  - 변경 요약
  - 검증 방법(명령어/수동 시나리오)
  - 리스크/롤백

## 4) AI 리뷰 루프 (선택)

> GitHub에 Gemini Code Assist가 설치되어 있다면, PR에서 다음 루프를 사용합니다.

1. PR 생성 후 코멘트로 AI 리뷰 요청
   - 예: `/gemini review`
2. 리뷰가 달리면 피드백을 분류
   - **must-fix**: 버그/보안/데이터 손상/명확한 타입 오류
   - **should-fix**: 유지보수/가독성/테스트/에러 처리
   - **nice-to-have**: 스타일/미세 UX
3. 같은 브랜치에서 수정 커밋 후 push
4. 필요하면 1~2회 반복

## 5) "BLOCKED" 처리
- 스펙 결정/권한/외부 정보가 필요하면 즉시 `BLOCKED`로 표시하고
  - 필요한 입력
  - 선택지
  - 추천안
  을 남긴다.
