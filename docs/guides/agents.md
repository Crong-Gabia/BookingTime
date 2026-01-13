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

