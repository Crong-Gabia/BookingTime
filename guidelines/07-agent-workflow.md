# 에이전트 작업 운영 규칙

이 문서는 OpenCode/Oh My OpenCode 기반으로 작업할 때, 팀이 “멈춤 없이” 진행하기 위한 운영 규칙을 정의합니다.

## 목표

- PR 단위로 작업을 쪼개서 리뷰/머지를 빠르게 한다.
- 에이전트가 추가 입력/결정이 필요할 때, **GitHub 알림(멘션/메일)** 기반으로 즉시 확인할 수 있게 한다.

---

## PR 규칙

- PR 제목은 **한글**로 작성한다.
- 큰 변경은 PR을 쪼갠다.
  - 예: 레퍼런스/가이드 → 기능(프론트) → 기능(API) → UI 정리 순
- 작업은 항상 브랜치에서 진행한다.

---

## 커밋 메시지 규칙

커밋 메시지는 아래 prefix를 사용합니다.

- `:` 뒤에만 space가 있음에 유의합니다.
  - 예: `fix: 소요시간 드롭다운 수정` (O)
  - 예: `fix : ...` (X)

### Type

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 formatting, 세미콜론(;) 누락, 코드 변경이 없는 경우
- **refactor**: 코드 리팩터링
- **test**: 테스트 코드, 리팩터링 테스트 코드 추가(프로덕션 코드 변경 X)
- **chore**: 빌드 업무 수정, 패키지 매니저 수정(프로덕션 코드 변경 X)
- **design**: CSS 등 사용자 UI 디자인 변경
- **comment**: 필요한 주석 추가 및 변경
- **ci**: CI 관련 설정 변경
- **rename**: 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우
- **remove**: 파일을 삭제하는 작업만 수행한 경우
- **!BREAKING CHANGE**: 커다란 API 변경의 경우
- **!HOTFIX**: 급하게 치명적인 버그를 고쳐야 하는 경우

---

## “추가 입력 필요” 알림 규칙 (Issue 기반)

에이전트가 결정을 못 내리거나 추가 입력이 필요한 경우, 채팅에서만 묻지 않고 **고정 이슈에 코멘트 + 멘션**으로 남깁니다.

- 고정 이슈: `https://github.com/Crong-Gabia/BookingTime/issues/6`
- 멘션 대상: `@Crong-Gabia`, `@HeegwonJo`

### 코멘트 템플릿

- **CONTEXT**: 어떤 작업/브랜치/PR에서 막혔는지
- **BLOCKED**: 무엇이 없어서 진행이 불가한지
- **OPTIONS**: 선택지 1/2/3
- **RECOMMENDATION**: 추천안
- 마지막 줄에 멘션: `@Crong-Gabia @HeegwonJo`

---

## PR 자동 검증 + AI 리뷰

### PR 체크 (필수)

- PR(develop 대상)에서는 CI가 빌드/테스트를 자동 실행합니다.

### AI PR 리뷰 (선택 실행)

- PR에 라벨 `ai-review`를 붙이면, OpenAI 기반으로 PR diff를 읽고 **요약 댓글 1개**를 자동으로 남깁니다.

필요한 GitHub Secrets:
- `OPENAI_API_KEY` (필수)
- `OPENAI_MODEL` (선택, 기본값은 워크플로우에 정의된 모델)

AI 리뷰가 **BLOCKED**로 판단하면, 댓글 마지막 줄에 멘션(`@Crong-Gabia @HeegwonJo`)이 포함되도록 유도합니다.
