# 저장소 가이드라인

## 프로젝트 개요
NestJS 백엔드, React + MUI 프론트엔드, PostgreSQL 데이터베이스로 구성된 회의 예약 시스템입니다. Monorepo(pnpm + Turborepo)로 관리됩니다.

## 언어 및 작업 기록

### 언어 정책
- **한국어 사용**: 모든 답변과 문서는 한국어로 작성합니다.
- 코드 내 주석도 한국어를 우선시합니다.

### 작업 기록 (Work History)
- **위치**: `work-history/` 디렉토리
- **형식**: `YYYY-MM-DD-{작업-제목}.md`
- **기록 내용**:
  - 수행한 작업 목록
  - 의사결정 사항
  - 발생한 이슈 및 해결 방법
  - 다음 단계 계획
- **규칙**: 모든 작업을 완료한 후 즉시 기록 업데이트

## Commands

```bash
# Install
pnpm install

# Development
pnpm run dev                    # All apps (turbo)
pnpm --filter api dev           # Backend only
pnpm --filter web dev           # Frontend only

# Testing
pnpm test                       # All tests
pnpm test -- <file-path>        # Specific file (Jest/Vitest)
pnpm test -t "test name"        # Specific test name
pnpm --filter api test          # Backend (Jest, *.spec.ts)
pnpm --filter web test          # Frontend (Vitest, *.test.ts)

# Lint/Format
pnpm run lint                   # ESLint all packages
pnpm run lint:fix               # Auto-fix ESLint
pnpm run format                 # Prettier check
pnpm run format:fix             # Auto-format

# Database
pnpm --filter api db:migrate:dev
pnpm --filter api db:seed

# Build
pnpm run build                  # All packages
```

## Code Style

### Formatting (Prettier)
- 2 spaces, semicolons required
- Single quotes (`'`), double quotes only for JSX
- Print width: 100, trailing commas: all, arrow parens: always

### Naming
- Files: `kebab-case` - `meeting.service.ts`, `slot-selector.tsx`
- Classes/Interfaces/Types: `PascalCase` - `MeetingController`, `IRoomAdapter`
- Functions/Variables: `camelCase` - `createRequest`, `userId`
- Constants: `SCREAMING_SNAKE_CASE` - `ERROR_CODES`
- Test files: `*.spec.ts` (backend), `*.test.ts` (frontend)

### Imports
```typescript
// Order: 1. External libs, 2. @shared/*, 3. Relative
import { Controller, Get } from '@nestjs/common';
import { CreateMeetingRequestDto } from '@shared/dto';
import { MeetingService } from './meeting.service';
```

### Type Safety
- Strict mode enabled
- `@typescript-eslint/no-explicit-any: error` (all packages)
- Never suppress type errors

## Architecture

### Backend (NestJS)
- Prisma ORM with PostgreSQL
- Adapter pattern for external services (Room, Holiday, HR)
- Optimistic locking with `version` column
- Return error codes: `ROOM_TAKEN`, `VERSION_MISMATCH`, etc.

### Frontend (React)
- MUI (Material UI) components
- TanStack Query for data fetching
- React Router for navigation
- Display in KST, store/return UTC

### Time Handling
- Database: UTC (`timestamptz`)
- API: ISO 8601 strings
- UI: KST (Asia/Seoul), user input in local time
- Slots: 30-min intervals, 09:00-18:00, exclude 12:00-13:00 (lunch) and weekends

### Error Handling
```typescript
// Backend
throw new BadRequestException(ERROR_CODES.ROOM_TAKEN, 'Meeting room already booked');

// Frontend
if (error.code === ERROR_CODES.ROOM_TAKEN) {
  showError('이미 예약된 회의실입니다');
}
```

## Testing

### Patterns
- Co-locate tests: `health.controller.spec.ts`, `meeting.service.test.ts`
- Use table-driven tests for edge cases
- Mock external adapters/services

### Best Practices
- Deterministic (no real network/timers without mocks)
- Fast (aim for <10s test suite)
- Test one behavior per case
- Target ≥80% coverage on business logic

## Database

### Prisma Schema
- Models: meeting_requests, participants, time_slots, confirmed_meetings, notifications
- Indexes: status, createdAt, requestId, userId
- Unique constraints: requestId + userId (participants)
- Soft delete: `deletedAt` column

### Transactions
- Use Prisma transactions for multi-step operations
- Wrap slot updates and meeting confirmation
- Validate state transitions inside transactions

## Configuration

### Environment Variables
- Backend: `DATABASE_URL`, optional `REDIS_URL`, `JWT_SECRET`, `PORT=3000`
- Frontend: `VITE_API_BASE_URL`
- Never commit secrets - use `.env.local`

### Path Aliases
```typescript
// Backend
@shared/* → ../../packages/shared/src

// Frontend
@/* → ./src/*
@shared/* → ../../packages/shared/src/*
```

## Troubleshooting

- **Timezone issues**: Verify DB=UTC, API=ISO, UI=KST
- **Concurrent conflicts**: Check `version` column in optimistic locking
- **Build failures**: Run `pnpm install` first
- **Lint errors**: Run `pnpm run lint:fix` before committing

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
