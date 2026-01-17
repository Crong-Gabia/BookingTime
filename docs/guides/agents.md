# 개발 가이드라인 (General)

이 문서는 모든 프로젝트에 적용 가능한 제너럴 지침입니다.

## Setup

### 필수 도구 설치

**GitHub CLI (gh)**
```bash
# macOS
brew install gh

# 인증
gh auth login
```

**OpenCode (회사 AI 코딩 어시스턴트)**
```bash
# 설치
curl -fsSL https://opencode.ai/install | bash

# 인증 (SSL 오류 발생 시 Troubleshooting 참조)
opencode auth login
```

### 개발자 환경 설정

- **IDE**: WebStorm 또는 VS Code 권장
- **터미널**: zsh 또는 bash
- **Node.js**: 프로젝트 요구사항에 따라 설치 (nvm 또는 brew 사용)
- **패키지 매니저**: 프로젝트별 지침에 따름 (pnpm, npm, yarn)

## Git Workflow

### 브랜치 전략
- **기준 브랜치**: `develop` (최종 병합 목표)
- **용어**: 채팅/요청에서 `dev`는 항상 `develop` 의미
- **기능 브랜치**: `feature/기능명` 형태
- **절대 main에 직접 push 금지**

### 작업 흐름

```bash
# 1. develop 브랜치에서 최신 상태 확인
git checkout develop
git pull origin develop

# 2. 기능 브랜치 생성 (kebab-case)
git checkout -b feature/회의실-예약-기능

# 3. 작업 및 커밋
git add .
git commit -m "feat: 회의실 예약 기능 구현"

# 4. 원격에 브랜치 푸시
git push -u origin feature/회의실-예약-기능

# 5. PR 생성 (develop로)
gh pr create --base develop --title "feat: 회의실 예약 기능" --body "$(cat <<'EOF'
## 변경 내용
- 회의실 예약 기능 구현
- 슬롯 선택 컴포넌트 추가
- API 엔드포인트 추가

## 검증 방법
- 회의실 선택 가능
- 시간 슬롯 선택 가능
- 예약 제출 정상 동작
EOF
)"

# 6. 사용자 검증 후 병합 (Review 후)
# PR 머지 시 "Squash and merge" 사용 권장

# 7. 병합 후 로컬 동기화 및 브랜치 삭제
git checkout develop
git pull origin develop
git branch -d feature/회의실-예약-기능
git push origin --delete feature/회의실-예약-기능
```

### 커밋 메시지 규칙 (Conventional Commits)
```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
docs: 문서 수정
test: 테스트 코드 추가/수정
chore: 빌드/설정 관련 작업
```

### PR 작성 가이드
- **Base**: 항상 `develop` 브랜치
- **Title**: `[type]: 간단한 설명` 형태
- **Body**:
  - 변경 내용 요약
  - 검증 방법/테스트 방법
  - 관련 이슈 번호 (있는 경우)
- **Merge**: Squash and merge 권장

### 금지 사항
- `main` 브랜치에 직접 커밋/푸시 금지
- 기능 단위로 브랜치 분리하지 않고 작업 금지
- PR 없이 바로 병합 금지
- 커밋 메시지 규칙 위반 금지

## Code Style

### Naming Conventions

#### TypeScript/JavaScript
- **변수/함수**: `snake_case` (회사 컨벤션)
  ```typescript
  const user_id = 123;
  const user_name = 'John';
  function create_user() {}
  ```

- **클래스/인터페이스/타입**: `PascalCase`
  ```typescript
  class UserController {}
  interface IUserRequest {}
  type UserRole = 'admin' | 'user';
  ```

- **상수**: `SCREAMING_SNAKE_CASE`
  ```typescript
  const ERROR_CODES = { ... };
  const API_BASE_URL = 'https://api.example.com';
  ```

- **파일명**: `kebab-case`
  ```
  user.controller.ts
  user.service.ts
  button.component.tsx
  ```

- **테스트 파일**: `*.spec.ts` (backend), `*.test.ts` (frontend)

### Formatting (Prettier)
- 2 spaces, semicolons required
- Single quotes (`'`), double quotes only for JSX
- Print width: 100, trailing commas: all, arrow parens: always

### Imports
```typescript
// Order: 1. External libs, 2. @shared/*, 3. Relative
import { Controller, Get } from '@nestjs/common';
import { CreateUserDto } from '@shared/dto';
import { UserService } from './user.service';
```

### Type Safety
- Strict mode enabled
- Never suppress type errors (`as any`, `@ts-ignore`, `@ts-expect-error` 금지)
- TypeScript ESLint `no-explicit-any` rule error 레벨

## Testing

### Patterns
- Co-locate tests: `user.controller.spec.ts`, `user.service.test.ts`
- Use table-driven tests for edge cases
- Mock external adapters/services

### Best Practices
- Deterministic (no real network/timers without mocks)
- Fast (aim for <10s test suite)
- Test one behavior per case
- Target ≥80% coverage on business logic

## Configuration

### Environment Variables
- 개발환경: `.env.local` (`.gitignore` 포함)
- 프로덕션: 서비스 설정/시크릿 매니저 사용
- 절대 `.env`, `.env.local` 파일 커밋 금지

### Path Aliases
```typescript
// 패키지별 설정에 따라 사용
@shared/* → 공유 패키지
@/* → 소스 코드 내부
```

## Error Handling
```typescript
// 에러 코드 정의 (상수)
const ERROR_CODES = {
  ROOM_TAKEN: 'ROOM_TAKEN',
  VERSION_MISMATCH: 'VERSION_MISMATCH',
} as const;

// 사용
throw new BadRequestException(ERROR_CODES.ROOM_TAKEN, 'Meeting room already booked');

// 프론트엔드에서 처리
if (error.code === ERROR_CODES.ROOM_TAKEN) {
  showError('이미 예약된 회의실입니다');
}
```

## Troubleshooting

### OpenCode 인증 SSL 오류

회사 네트워크 환경에서 `opencode auth login` 실행 시 `self signed certificate in certificate chain` 오류가 발생할 수 있습니다.

**증상**:
```
ERROR self signed certificate in certificate chain Failed to fetch models.dev
ERROR self signed certificate in certificate chain fatal
```

**해결 방법**:

1. **임시 해결 (세션 동안만)**
   ```bash
   NODE_TLS_REJECT_UNAUTHORIZED=0 opencode auth login
   ```
   - 빠르게 인증이 필요할 때 사용
   - 보안 우려로 개발 세션 종료 후 환경 변수 제거 권장

2. **영구적 해결 (권장)**
   - 회사 CA 인증서 경로를 찾아 환경 변수 설정
   ```bash
   # ~/.zshrc 또는 ~/.bashrc에 추가
   export NODE_EXTRA_CA_CERTS=/path/to/company-ca-certificate.pem
   ```
   - 인증서 경로는 IT팀에 문의하거나 시스템 설정에서 확인

3. **대안**
    - IT팀에 OpenCode가 외부 인증 서버와 통신할 수 있도록 프록시/방화벽 설정 요청
    - 로그 위치: `~/.local/share/opencode/log/`

## 에이전트 작업 규칙

### 자율 판단 원칙

- **명확한 요청**: 사용자의 의도가 명확할 때는 추가 질문 없이 즉시 실행
- **모호한 요청**: 의도가 불분명하거나 여러 해석이 가능할 때만 질문
- **최선의 선택**: 여러 방법 중 가장 합리적이고 프로젝트에 맞는 방식 선택 후 진행

### 문서 정리 규칙

- **구조화**: 파일이 루트에 너무 많으면 카테고리별로 정리 (docs/setup, docs/guides, docs/reference)
- **일관성**: 파일명은 kebab-case, 구조는 기존 패턴 준수
- **자동 업데이트**: README.md에는 새로운 문서 링크 즉시 추가

### 기획서 및 작업 기록 규칙

- **위치**: `work-history/product-spec/` 폴더 사용
- **버전 관리**:
  - `plan.md`: 최신 기획서만 유지
  - `index.md`: 변경 이력 누적
  - `risks.md`: 논리적 모순/리스크 추론 기록
  - `links.md`: Confluence/Figma 링크 관리
  - `decisions.md`: 의사결정 기록
- **에이전트 작업 전**: 항상 `plan.md` 최신 내용 확인
- **구현 시 모순 발견**: 즉시 `risks.md`에 추론 및 근거 기록

### 지침 업데이트 규칙

- **지침 변경**: 직접 `develop` 브랜치에 push
- **작업 완료 후**: 별도 기능 브랜치에서 develop로 PR 생성
- **PR 없이 develop에 직접 push 가능한 항목**: 문서/지침 변경만

## PR 워크플로우 및 AI 리뷰

### PR 생성 후 AI 리뷰 호출

PR을 생성한 후 반드시 AI 리뷰를 호출해야 합니다:

```bash
# PR 생성
gh pr create --base develop --title "feat: 기능 설명" --body "..."

# PR에 AI 리뷰 요청 댓글 추가
gh pr comment <PR_NUMBER> --body "/gemini review"
```

### AI 리뷰 확인 및 피드백 반영

1. **리뷰 댓글 모니터링**
   ```bash
   # PR 댓글 확인
   gh pr view <PR_NUMBER> --comments

   # 또는 웹에서 확인: https://github.com/<owner>/<repo>/pull/<PR_NUMBER>
   ```

2. **피드백 반영**
   - AI가 제시한 문제점을 수정
   - 수정 사항을 커밋 후 push
   - PR 댓글로 수정 사항을 기록

3. **수정 사항 알리기**
   ```bash
   # 수정 사항 댓글 추가
   gh pr comment <PR_NUMBER> --body "피드백 반영 완료:
   - 이슈1: 해결 방법 설명
   - 이슈2: 해결 방법 설명
   "
   ```

### 지속적인 작업 진행

PR이 열려있는 동안 다른 작업을 계속 진행합니다:

```bash
# 다른 브랜치로 전환하여 새 작업 시작
git checkout develop
git pull origin develop
git checkout -b feature/다른-기능

# 새로운 작업 진행...
# 기존 PR에 /gemini review 호출 후 계속 다른 작업 가능
```

### 댓글 확인 자동화 (선택사항)

```bash
# 특정 사용자/멘션의 댓글만 확인
gh pr view <PR_NUMBER> --comments | grep -A 5 "<사용자명>"
```

### 완료 체크리스트

PR이 다음 조건을 만족할 때까지 반복합니다:
- [ ] 모든 AI 리뷰 피드백이 반영됨
- [ ] CI/CD 체크가 모두 통과 (Build, Test, Lint)
- [ ] 사용자의 승인이 있음
- [ ] PR 댓글에 모든 수정 사항이 기록됨

### PR 머지 (Merge)

머지 체크리스트:
1. **머지 전 확인**
   - [ ] AI 리뷰 피드백이 모두 반영되었는지 확인
   - [ ] 모든 CI/CD 체크가 통과했는지 확인 (Build, Test, Lint)
   - [ ] 사용자의 승인을 받았는지 확인

2. **머지 방법 (웹)**
   1. GitHub PR 페이지 접속
   2. "Merge pull request" 클릭
   3. "Squash and merge" 선택 (권장)
   4. 머지 메시지 확인 후 "Confirm merge" 클릭

3. **머지 방법 (CLI)**
   ```bash
   # 머지 (Squash and merge)
   gh pr merge <PR_NUMBER> --squash --delete-branch

   # 또는 단순 병합
   gh pr merge <PR_NUMBER> --merge --delete-branch
   ```

4. **머지 후 정리**
   ```bash
   # develop 브랜치로 이동
   git checkout develop
   git pull origin develop

   # 로컬 브랜치 삭제
   git branch -d feature/<기능명>
   ```

### AI 자동 머지 (에이전트용)

에이전트가 PR을 머지할 때는 다음 절차를 따릅니다:

1. **PR 상태 확인**
   ```bash
   # 여러 PR의 상태를 병렬로 확인
   gh pr list --state open --json number,title,mergeable,state,reviewDecision,headRefName
   ```

2. **각 PR별 검증**
   - AI 리뷰 완료 여부 확인 (`/gemini review` 댓글 존재)
   - CI/CD 통과 여부 확인 (status: success)
   - ReviewDecision 확인 (approved 상태)

3. **조건 충족 시 머지**
   ```bash
   # 조건 충족 시 자동 머지
   for PR in $(gh pr list --state open --json number,title,mergeable,state,reviewDecision --jq '.[] | select(.reviewDecision == "APPROVED" and .state == "OPEN") | .number'); do
     gh pr merge "$PR" --squash --delete-branch
   done
   ```

4. **머지 실패 처리**
   - 머지 실패 시 에러 메시지 기록
   - 충돌(conflict) 발생 시 사용자에게 알림
   - 작업 기록에 실패 원인 기록

### PR 머지 자동화 스크립트 (선택사항)

```bash
#!/bin/bash
# scripts/auto-merge-ready-prs.sh

# 머지 가능한 PR 자동 머지 스크립트
# 사용 조건:
# 1. AI 리뷰 완료
# 2. CI/CD 통과
# 3. 사용자 승인 (approved)

set -e

echo "Checking merge-ready PRs..."

# 머지 가능한 PR 목록 조회
MERGEABLE_PRS=$(gh pr list \
  --state open \
  --json number,title,mergeable,state,reviewDecision \
  --jq '.[] | select(.reviewDecision == "APPROVED" and .state == "OPEN" and .mergeable == true) | "\(.number)|\(.title)"'
)

if [ -z "$MERGEABLE_PRS" ]; then
  echo "No merge-ready PRs found."
  exit 0
fi

echo "Found merge-ready PRs:"
echo "$MERGEABLE_PRS"
echo ""

# 각 PR 머지
echo "$MERGEABLE_PRS" | while IFS='|' read -r PR_NUMBER PR_TITLE; do
  echo "Merging PR #$PR_NUMBER: $PR_TITLE"

  # 머지
  gh pr merge "$PR_NUMBER" --squash --delete-branch

  echo "PR #$PR_NUMBER merged successfully."
  echo ""
done

echo "All merge-ready PRs merged."
```

