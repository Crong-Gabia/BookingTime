# 배포 가이드

**최종 업데이트**: 2026-01-13

---

## 개요

BookingTime 프로젝트(NestJS 백엔드 + React 프론트엔드 + PostgreSQL)의 배포 방법을 설명합니다.

---

## 배포 플랫폼 비교

| 플랫폼 | 백엔드 | 프론트엔드 | DB | 무료 티어 | 설정 난이도 | 비용 (월) |
|---------|---------|-----------|-----|---------|-----------|---------|
| **Railway** | ✅ | ✅ | ✅ | ✅ ($5) | 쉬움 | $5 |
| **Vercel+Neon** | ❌ | ✅ | ✅ | ✅ | 보통 | $20+ |
| **Render** | ✅ | ✅ | ✅ | ✅ (750h) | 보통 | $7-25 |
| **Coolify** | ✅ | ✅ | ✅ | ✅ | 쉬움 | $0-5 |
| **AWS** | ✅ | ✅ | ✅ | ❌ (12개월) | 어려움 | $20+ |

---

## 추천 배포 전략

### MVP 단계: Railway

**추천 이유**:
- 한 번의 클릭으로 전체 스택 배포
- 자동 GitHub 연동
- PostgreSQL 무료 제공
- 도메인, SSL 자동 설정
- 빠른 세팅

**비용**: $5/월

**시작 시간**: 10분

---

### 1단계: Railway 배포

#### 1.1 Railway 계정 생성

```bash
# 1. https://railway.app/ 접속
# 2. GitHub로 회원가입
# 3. Railway Dashboard 접속
```

#### 1.2 프로젝트 생성 및 GitHub 연동

```bash
# 1. New Project → Deploy from GitHub repo 선택
# 2. 레포지토리 선택: BookingTime
# 3. Railway가 자동으로 monorepo 구조를 감지
```

#### 1.3 서비스 설정

Railway가 각각의 service를 자동 생성합니다:

**backend (apps/api)**
```yaml
# 자동 감지된 설정
Build Command: cd apps/api && pnpm run build
Start Command: cd apps/api && node dist/main.js
Environment Variables:
  - DATABASE_URL (자동 생성됨)
  - PORT (자동 생성됨)
```

**web (apps/web)**
```yaml
# 자동 감지된 설정
Build Command: pnpm run build
Start Command: vite preview
Environment Variables:
  - VITE_API_BASE_URL=${{RAILWAY_PUBLIC_DOMAIN:backend}}
```

**database**
```yaml
# 자동 생성된 PostgreSQL
PostgreSQL: 14.x
```

#### 1.4 환경변수 설정

**web service**에서 추가 설정:

```bash
# web service → Variables
VITE_API_BASE_URL=https://your-backend-production.up.railway.app
```

**backend service**에서 확인:

```bash
# backend service → Variables
DATABASE_URL=postgresql://user:password@host:port/db
PORT=3000
```

#### 1.5 배포 완료 확인

```bash
# Railway Dashboard → Deployments 탭
# 모든 service가 "Success" 상태인지 확인
# URL 확인:
# - Web: https://your-web-production.up.railway.app
# - Backend: https://your-backend-production.up.railway.app
```

---

### 2단계: 도메인 설정

#### 2.1 Railway 도메인

**기본 도메인**: `*.up.railway.app`

**커스텀 도메인 설정**:
```bash
# 1. 프로젝트 → Settings → Domains
# 2. Add Domain
# 3. 도메인 입력 (예: bookingtime.example.com)
# 4. DNS 설정 확인
#   - CNAME: your-web-production.up.railway.app
#   - 기본값으로 Railway에서 DNS 제공
```

#### 2.2 SSL 인증서

Railway가 자동으로 Let's Encrypt를 통한 SSL 인증서를 발급합니다.

---

### 3단계: 배포 후 검증

#### 3.1 헬스체크

```bash
# Backend API
curl https://your-backend-production.up.railway.app/api/health

# 예상 응답
{
  "status": "ok",
  "timestamp": "2026-01-13T...",
  "uptime": 123.45
}
```

#### 3.2 기능 테스트

```bash
# 1. 웹사이트 접속
open https://your-web-production.up.railway.app

# 2. 새 회의 생성 테스트
# 3. 응답 제출 테스트
# 4. 대시보드 기능 테스트
```

#### 3.3 CORS 확인

백엔드에서 프론트엔드 도메인 허용 필요:

```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-web-production.up.railway.app',
    'https://bookingtime.example.com',
  ],
  credentials: true,
});
```

---

### 4단계: 모니터링 설정

#### 4.1 Railway 로그

```bash
# Dashboard → Service → Logs
# 실시간 로그 확인
```

#### 4.2 메트릭

```bash
# Dashboard → Service → Metrics
# CPU, Memory, Request Count 확인
```

---

## 고급 옵션: Coolify

Coolify는 셀프호스팅 대안으로 다음과 같은 장점이 있습니다:

### 장점

1. **비용 효율**
   - Railway: $5/월 (512MB RAM)
   - Coolify: $0/월 (동일 사양)
   - Vercel: $95/월 (동일 트래픽)

2. **무제한 기능**
   - 모든 기능 포함
   - 추가 비용 없음
   - 280+ 서비스 원클릭 배포

3. **자체 호스팅의 이점**
   - 데이터 프라이버시
   - 비용 제어
   - 맞춤형 설정 가능

### Coolify 배포 방법

#### 1. Coolify 설치

```bash
# 서버에 Coolify 설치
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

#### 2. 배포 명령어

```bash
# 프로젝트 디렉토리에서
coolify start

# Coolify가 자동으로 감지
# - NestJS 백엔드
# - React + Vite 프론트엔드
# - PostgreSQL 데이터베이스
```

#### 3. 도메인 및 SSL

```bash
# Coolify Dashboard에서 설정
# - 도메인 추가
# - SSL 자동 발급 (Let's Encrypt)
# - 로드 밸런싱 자동 설정
```

### Coolify vs Railway

| 기능 | Railway | Coolify |
|------|---------|---------|
| 설정 난이도 | 쉬움 | 쉬움 |
| 비용 | $5/월 | $0/월 |
| 무료 티어 | 512MB RAM | 자신의 서버 사양 |
| 데이터 프라이버시 | 제한됨 | 완전한 제어 |
| 원클릭 배포 | ✅ | ✅ |

---

## CI/CD 파이프라인

### GitHub Actions + Railway

```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm run build

      - name: Deploy to Railway
        run: npx railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### GitHub Actions + Coolify

```yaml
# .github/workflows/deploy-coolify.yml
name: Deploy to Coolify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Deploy to Coolify
        uses: coolifyio/github-action@v4
        with:
          service: 'bookingtime'
          token: ${{ secrets.COOLIFY_TOKEN }}
```

---

## 환경변수 설정

### 개발 환경

```bash
# .env.local (gitignore 포함)
DATABASE_URL="postgresql://user:password@localhost:5432/bookingtime"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="dev-secret-key"
VITE_API_BASE_URL="http://localhost:3000"
PORT=3000
```

### 프로덕션 환경

```bash
# Railway (자동 생성)
DATABASE_URL="postgresql://user:password@host:port/db"
PORT=3000

# Web app
VITE_API_BASE_URL="https://your-backend-production.up.railway.app"
```

---

## 문제 해결

### 1. 배포 실패

```bash
# Railway Dashboard → Logs 확인
# 빌드 에러 확인
# 환경변수 확인
# ```
`

### 2. CORS 오류

```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'https://your-web-production.up.railway.app',
  ],
  credentials: true,
});

// Railway 환경변수
ALLOWED_ORIGINS=https://your-web-production.up.railway.app
```

### 3. 데이터베이스 연결 실패

```bash
# Railway에서 DATABASE_URL 확인
# PostgreSQL 인스턴스가 실행 중인지 확인
# 마이그레이션이 완료되었는지 확인
```

### 4. API 요청 실패

```bash
# 프론트엔드 VITE_API_BASE_URL 확인
# 백엔드 서비스가 실행 중인지 확인
# 라우팅이 올바른지 확인
```

---

## 보안 체크리스트

배포 전 확인:

- [ ] `.env` 파일이 `.gitignore`에 포함됨
- [ ] `JWT_SECRET`이 안전한 랜덤 값으로 설정됨
- [ ] CORS가 허용된 도메인으로만 설정됨
- [ ] HTTPS가 강제됨
- [ ] Rate Limiting이 설정됨
- [ ] 로깅이 활성화됨
- [ ] 데이터베이스 접근이 제한됨

---

## 비용 최적화

### Railway

- **무료 티어**: 초당 512MB RAM
- **비용**: $5/월
- **확장**: Hobby Plan ($10/월) - 1GB RAM

### Coolify

- **비용**: $0/월
- **서버**: 자체 서버 비용만 발생
- **확장**: 서버 사양 증설

---

## 롤백 전략

### 1. Railway

```bash
# Dashboard → Deployments
# 이전 버전 선택 → Redeploy
```

### 2. GitHub

```bash
# 이전 커밋으로 복귀
git revert HEAD
git push origin main
# Railway가 자동으로 재배포
```

### 3. Coolify

```bash
# Coolify Dashboard에서
# 이전 이미지 선택 → Redeploy
```

---

## 참고 자료

- [Railway 문서](https://docs.railway.app/)
- [Coolify 문서](https://coolify.io/docs)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [프로젝트 README](../../README.md)
- [AI 에이전트 사용 가이드](./09-ai-agent-usage.md)
- [Git 브랜치 전략](./07-git-branch-strategy.md)
