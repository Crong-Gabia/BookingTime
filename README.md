# WhatTime - 회의 예약 시스템

NestJS 백엔드와 React 프론트엔드로 구성된 회의 예약 시스템입니다. Monorepo 구조(pnpm + Turborepo)로 관리됩니다.

## 프로젝트 개요

사내 면접 및 다자간 회의 일정 조율 시스템입니다. 주최자가 각 참석자에게 개별 연락하여 시간을 확인하고 취합하는 비효율적인 프로세스를 개선합니다.

### 핵심 기능
- **Negative Selection**: 기본적으로 모든 업무 시간을 "가능(Available)"으로 간주하고, 참석자가 "안 되는 시간(Unavailable)"만 선택하여 제외
- **자동 필터링**: 연차/휴가 데이터 기반 자동 필터링
- **웹 응답**: 모바일/PC 최적화된 웹 링크 기반 응답 페이지
- **메신저 연동**: 사내 메신저 알림 연동 (Notification Only)
- **대시보드**: 주최자 실시간 모니터링 대시보드
- **회의실 예약**: 회의실 예약 시스템 및 캘린더 연동

## 기술 스택

- **Backend**: NestJS (TypeScript), Prisma ORM, PostgreSQL
- **Frontend**: React + Vite + TypeScript, React Router, TanStack Query, MUI
- **Tooling**: pnpm, Turborepo, Vitest/Jest, ESLint, Prettier

## 시작하기

### 사전 요구사항

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose (PostgreSQL 실행용)

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 데이터베이스 시작

```bash
cd infra/docker
docker-compose up -d
```

### 3. 환경변수 설정

```bash
cp apps/api/.env.example apps/api/.env.local
```

### 4. 데이터베이스 마이그레이션

```bash
pnpm --filter api db:migrate:dev
```

### 5. 개발 서버 시작

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
```

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
