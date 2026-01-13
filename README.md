# BookingTime - 회의 예약 시스템

NestJS 백엔드와 React 프론트엔드로 구성된 회의 예약 시스템입니다. Monorepo 구조(pnpm + Turborepo)로 관리됩니다.

## 기술 스택

- **Backend**: NestJS (TypeScript), Prisma ORM, PostgreSQL
- **Frontend**: React + Vite + TypeScript, React Router, TanStack Query, MUI
- **Tooling**: pnpm, Turborepo, Vitest/Jest, ESLint, Prettier

## 시작하기

### 빠른 시작 (추천)

빠른 시작 스크립트를 사용하여 자동으로 개발 환경을 설정하세요:

```bash
# 전체 개발 환경 자동 설정
./scripts/setup-dev-env.sh

# 개발 환경 중지
./scripts/stop-dev-env.sh

# 데이터베이스 리셋 (모든 데이터 삭제)
./scripts/reset-db.sh
```

### 사전 요구사항

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose (PostgreSQL 실행용)

### 수동 설정

#### 1. 의존성 설치

```bash
pnpm install
```

#### 2. 데이터베이스 시작

```bash
cd infra/docker
docker-compose up -d
```

#### 3. 환경변수 설정

```bash
cp apps/api/.env.example apps/api/.env.local
```

#### 4. 데이터베이스 마이그레이션

```bash
pnpm --filter api db:migrate:dev
```

#### 5. 개발 서버 시작

```bash
# 전체 (API + Web)
pnpm run dev

# 개별
pnpm --filter api dev    # API (http://localhost:3000)
pnpm --filter web dev    # Web (http://localhost:5173)
```

## 명령어

```bash
# 테스트
pnpm test                    # 전체
pnpm test -- api             # 백엔드
pnpm test -- web             # 프론트엔드

# 린트/포맷
pnpm run lint                # 검사
pnpm run lint:fix            # 자동 수정
pnpm run format              # Prettier 검사
pnpm run format:fix          # Prettier 자동 포맷

# 빌드
pnpm run build               # 전체 빌드
pnpm --filter api build      # 백엔드만
pnpm --filter web build      # 프론트엔드만
```

## 프로젝트 구조

```
whattime/
  apps/
    api/                     # NestJS 백엔드
      src/
        modules/             # 비즈니스 로직
        common/              # 공통 서비스 (Prisma)
    web/                     # React 프론트엔드
      src/
        components/          # React 컴포넌트
        pages/               # 페이지 컴포넌트
  packages/
    shared/                  # 공유 DTO, 타입
  infra/
    docker/                  # Docker Compose 설정
  docs/
    setup/                   # 설치 및 설정 가이드
    guides/                  # 개발자 가이드라인
    reference/               # 참고 문서
  work-history/
    product-spec/            # 기획서 및 버전 관리
    [YYYY-MM-DD-*.md]        # 작업 기록
  guidelines/                # 프론트엔드 개발 가이드
  scripts/                   # 자동화 스크립트
```

## 문서

### 설치 및 설정
- [OpenCode 설정](docs/setup/oh-my-open-code-setup.md)
- [도구 설치 가이드](docs/setup/tooling-setup.md)

### 개발자 가이드
- [개발 지침](docs/guides/agents.md) - Git 워크플로우, 컨벤션, 코딩 스타일
- [OpenCode 워크플로우](docs/guides/opencode-guide.md)

### 참고 문서
- [기술 스택](docs/reference/stack.md)
- [MVP 프롬프트 템플릿](docs/reference/mvp-prompts.md)

### 기획 및 작업 기록
- [기획서](work-history/product-spec/index.md)
- [프론트엔드 가이드라인](guidelines/README.md)

## API 엔드포인트

- `POST /api/meetings` - 회의 요청 생성
- `GET /api/meetings/:id/dashboard` - 대시보드 조회
- `POST /api/meetings/:id/respond` - 응답 제출
- `POST /api/meetings/:id/remind/:userId` - 리마인드 전송
- `POST /api/meetings/:id/confirm` - 회의 확정
- `GET /api/health` - 헬스체크

## 개발 가이드

- 모든 시간은 데이터베이스에 UTC로 저장됩니다
- UI는 Asia/Seoul (KST) 시간대로 표시됩니다
- 30분 단위 슬롯 (09:00-18:00, 점심시간 제외)
- 모바일 우선 디자인
- optimistic locking으로 동시성 제어

## 테스트

```bash
# 단일 테스트 파일 실행
pnpm test apps/api/src/modules/meeting/meeting.service.spec.ts

# 특정 테스트 이름으로 실행
pnpm test -t "슬롯 교집합 찾기"
```

## 배포

현재 Railway에 배포되어 있습니다. 배포 상황은 Railway 대시보드에서 확인하세요.

- GitHub: [레포지토리 링크]
- Railway: [프로젝트 링크]
