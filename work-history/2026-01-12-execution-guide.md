# 실행 가이드

## 개발 환경 시작하기

### 1. 데이터베이스 시작

PostgreSQL과 Redis를 Docker Compose로 실행합니다.

```bash
cd infra/docker
docker-compose up -d
```

데이터베이스가 준비될 때까지 기다립니다 (약 10~30초).

상태 확인:
```bash
docker-compose ps
```

### 2. 의존성 설치

전체 패키지 의존성을 설치합니다.

```bash
pnpm install
```

### 3. 환경변수 설정

API용 환경변수를 복사합니다.

```bash
cp apps/api/.env.example apps/api/.env.local
```

`.env.local` 파일을 직접 수정할 수도 있습니다:

```env
DATABASE_URL="postgresql://scheduler:scheduler@localhost:5432/scheduler?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key-change-in-production"
WEB_URL="http://localhost:5173"
PORT=3000
```

### 4. 데이터베이스 마이그레이션

Prisma 스키마를 데이터베이스에 적용합니다.

```bash
pnpm --filter api db:migrate:dev
```

마이그레이션 파일이 `apps/api/prisma/migrations/`에 생성됩니다.

### 5. Prisma Client 생성

```bash
pnpm --filter api prisma generate
```

### 6. 개발 서버 시작

#### 전체 실행 (API + Web)

```bash
pnpm run dev
```

Turborepo가 두 앱을 동시에 실행합니다:
- API: http://localhost:3000
- Web: http://localhost:5173

#### 개별 실행

```bash
# API만 실행
pnpm --filter api dev

# Web만 실행
pnpm --filter web dev
```

## 사용 가능한 스크립트

### 전체 (루트)

| 명령어 | 설명 |
|--------|------|
| `pnpm run dev` | 전체 개발 서버 실행 (API + Web) |
| `pnpm run build` | 전체 빌드 |
| `pnpm run lint` | 전체 린트 검사 |
| `pnpm run lint:fix` | 전체 린트 자동 수정 |
| `pnpm run format` | Prettier 검사 |
| `pnpm run format:fix` | Prettier 자동 포맷 |
| `pnpm test` | 전체 테스트 |

### API (apps/api)

| 명령어 | 설명 |
|--------|------|
| `pnpm --filter api dev` | API 개발 서버 실행 |
| `pnpm --filter api build` | API 빌드 |
| `pnpm --filter api test` | API 테스트 실행 |
| `pnpm --filter api test:watch` | 테스트 워치 모드 |
| `pnpm --filter api lint` | API 린트 검사 |
| `pnpm --filter api lint:fix` | API 린트 자동 수정 |
| `pnpm --filter api db:migrate:dev` | DB 마이그레이션 |
| `pnpm --filter api db:seed` | DB 시드 데이터 추가 |
| `pnpm --filter api prisma generate` | Prisma Client 생성 |
| `pnpm --filter api prisma studio` | Prisma Studio 실행 |

### Web (apps/web)

| 명령어 | 설명 |
|--------|------|
| `pnpm --filter web dev` | Web 개발 서버 실행 |
| `pnpm --filter web build` | Web 빌드 |
| `pnpm --filter web preview` | Web 빌드 결과 미리보기 |
| `pnpm --filter web test` | Web 테스트 실행 |
| `pnpm --filter web test:ui` | Web 테스트 UI 실행 |
| `pnpm --filter web lint` | Web 린트 검사 |
| `pnpm --filter web lint:fix` | Web 린트 자동 수정 |

## 데이터베이스 관리

### Docker 컨테이너 제어

```bash
# 상태 확인
docker-compose ps

# 로그 보기
docker-compose logs -f postgres
docker-compose logs -f redis

# 중지
docker-compose stop

# 중지 후 삭제
docker-compose down

# 볼륨까지 삭제 (데이터 초기화)
docker-compose down -v
```

### Prisma Studio (데이터베이스 GUI)

```bash
cd apps/api
pnpm prisma studio
```

브라우저에서 http://localhost:5555 로 접속하면 데이터베이스 내용을 확인하고 수정할 수 있습니다.

## 테스트

### 단일 테스트 파일 실행

```bash
# 백엔드
pnpm test apps/api/src/modules/health/health.controller.spec.ts

# 프론트엔드
pnpm test apps/web/src/pages/HomePage.test.tsx
```

### 특정 테스트 이름으로 실행

```bash
pnpm test -t "헬스 체크"
```

## 일반적인 문제 해결

### 포트 충돌

3000번 포트나 5173번 포트가 이미 사용 중인 경우:

```bash
# 포트 사용 중인 프로세스 찾기
lsof -i :3000
lsof -i :5173

# 프로세스 종료
kill -9 <PID>
```

### 데이터베이스 연결 실패

1. Docker 컨테이너가 실행 중인지 확인:
   ```bash
   docker-compose ps
   ```

2. 마이그레이션이 완료되었는지 확인:
   ```bash
   pnpm --filter api db:migrate:dev
   ```

3. DATABASE_URL 확인:
   ```bash
   cat apps/api/.env.local
   ```

### 빌드 실패

```bash
# 캐시 삭제 후 재설치
rm -rf node_modules .turbo
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

## 프로덕션 빌드

```bash
# 전체 빌드
pnpm run build

# API 프로덕션 실행
cd apps/api
node dist/main.js

# Web 프로덕션 빌드
cd apps/web
pnpm build
pnpm preview
```
