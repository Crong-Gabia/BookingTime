# 배포 가이드

## 추천 배포 플랫폼

현재 프로젝트 (NestJS 백엔드 + React 프론트엔드 + PostgreSQL)에 적합한 배포 옵션입니다.

### 옵션 1: Railway (추천 - 가장 간편)

백엔드 + 프론트엔드 + 데이터베이스를 하나의 플랫폼에서 관리할 수 있습니다.

**장점**:
- 한 번의 클릭으로 전체 스택 배포
- 자동 GitHub 연동
- PostgreSQL 무료 제공
- 도메인, SSL 자동 설정

**단점**:
- 무료 티어 제한 (초당 512MB RAM, $5 크레딧/월)

**가입**: https://railway.app/

**배포 방법**:
1. Railway 계정 생성 후 GitHub 레포지토리 연동
2. New Project → Deploy from GitHub repo 선택
3. 배포할 프로젝트 선택
4. 환경변수 자동 감지됨 (`.env.example` 참고)
5. Railway가 PostgreSQL 자동 생성
6. 배포 완료 후 도메인 확인

### 옵션 2: Vercel + Neon (프론트엔드 우선)

프론트엔드는 Vercel, 백엔드/DB는 다른 서비스로 분리 배포합니다.

**장점**:
- Vercel: 프론트엔드 최적화 우수, 빠른 빌드, 전 세계 CDN
- Neon: Serverless PostgreSQL, 무료 티어 제공
- Preview 배포 (PR마다 자동 생성)

**단점**:
- 여러 플랫폼 분리 관리 필요
- 백엔드 별도 배포 필요

**가입**:
- Vercel: https://vercel.com/
- Neon: https://neon.tech/

**배포 방법**:
1. **Vercel (프론트엔드)**:
   - Vercel 계정 생성 후 GitHub 레포지토리 연동
   - Import Project 선택
   - Framework Preset: Vite 자동 감지
   - Root Directory: `apps/web`
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
   - Environment Variables: `VITE_API_BASE_URL`

2. **Neon (데이터베이스)**:
   - Neon 계정 생성
   - New Project → PostgreSQL 선택
   - Connection String 확인 (`.env`의 `DATABASE_URL`)

3. **백엔드 배포 (Render 또는 Railway)**:
   - Render: https://render.com/
   - 계정 생성 후 GitHub 연동
   - Web Service 선택
   - Build Command: `cd apps/api && pnpm run build`
   - Start Command: `cd apps/api && node dist/main.js`
   - Environment Variables: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `WEB_URL`, `PORT`

### 옵션 3: AWS (프로덕션 스케일)

대규모 트래픽에 적합합니다.

**장점**:
- 완전한 제어권
- 다양한 서비스 선택 (EC2, RDS, Elastic Beanstalk, Lambda)
- 높은 확장성

**단점**:
- 설정 복잡
- 비용 관리 필요
- 초기 학습 곡선

**가입**: https://aws.amazon.com/

**배포 방법 (Elastic Beanstalk 예시)**:
1. EB 환경 생성 (Node.js 플랫폼)
2. RDS PostgreSQL 인스턴스 생성
3. 환경변수 설정
4. GitHub 레포지토리 연동
5. 배포

## 비교표

| 플랫폼 | 백엔드 | 프론트엔드 | DB | 무료 티어 | 설정 난이도 |
|---------|---------|-----------|-----|---------|-----------|
| Railway | ✅ | ✅ | ✅ | ✅ ($5/월) | 쉬움 |
| Vercel | ❌ | ✅ | ❌ | ✅ (개인) | 쉬움 |
| Render | ✅ | ✅ | ✅ | ✅ (750h/월) | 보통 |
| Netlify | ❌ | ✅ | ❌ | ✅ (개인) | 쉬움 |
| AWS | ✅ | ✅ | ✅ | ❌ (12개월) | 어려움 |

## MVP 단계 추천: Railway

빠르게 배포하고 테스트하려면 **Railway**를 추천합니다:

1. GitHub 레포지토리 푸시
2. Railway에서 레포지토리 연동
3. 환경변수 설정 (`.env.example` 참고)
4. 배포 완료

Railway가 자동으로 필요한 서비스를 감지하고 설정합니다.

## 환경변수 설정

모든 플랫폼에서 다음 환경변수를 설정해야 합니다:

```env
DATABASE_URL="postgresql://user:password@host:port/db"
REDIS_URL="redis://host:port"
JWT_SECRET="secure-random-string"
WEB_URL="https://your-frontend-url.com"
PORT=3000
```

## 도메인 설정

### Railway
- Railway 도메인: `*.up.railway.app`
- Custom Domain: Project → Settings → Domains

### Vercel
- Vercel 도메인: `*.vercel.app`
- Custom Domain: Settings → Domains

### Render
- Render 도메인: `*.onrender.com`
- Custom Domain: Settings → Custom Domains

## CI/CD 파이프라인

GitHub Actions를 통한 자동 배포 설정:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm run build
      - name: Deploy to Railway
        run: npx railway up
```

## 모니터링

### 로그 확인
- Railway: Project → Logs
- Vercel: Project → Deployments → Logs
- Render: Dashboard → Logs

### 에러 트래킹
- Sentry: https://sentry.io/
- LogRocket: https://logrocket.com/

## 보안 체크리스트

배포 전 확인:

- [ ] 환경변수에 `.gitignore`로 보호되는 값이 포함됨
- [ ] JWT_SECRET이 안전한 랜덤 값으로 설정됨
- [ ] CORS가 허용된 도메인으로 설정됨
- [ ] HTTPS가 강제됨
- [ ] Rate Limiting이 설정됨
- [ ] 로깅이 활성화됨
