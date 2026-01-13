# API 환경별 URL 설정

**최종 업데이트**: 2026-01-13

---

## 문제

현재 API 요청이 Vite proxy를 통해서만 처리되어 배포 환경에서 작동하지 않습니다.

### 현재 구조

```
브라우저 → fetch('/api/meetings')
         ↓
    (개발 환경)
         ↓
    Vite proxy (/api → http://localhost:3000)
         ↓
    백엔드 서버 (3000번 포트)
```

### 배포 환경 문제

```
프론트엔드: https://bookingtime.example.com
백엔드: https://api.bookingtime.example.com

브라우저 → fetch('/api/meetings')
         ↓
    https://bookingtime.example.com/api/meetings
         ↓
    404 Not Found (프록시 없음!)
```

---

## 해결책

### 1. 환경변수 추가

**개발 환경** (`.env.development`)
```bash
# 개발 환경에서는 프록시 사용
# VITE_API_BASE_URL을 비워두면 Vite proxy가 작동
VITE_API_BASE_URL=
```

**배포 환경** (`.env.production`)
```bash
# 배포 환경에서는 백엔드 URL을 직접 지정
VITE_API_BASE_URL=https://api.bookingtime.example.com
```

**테스트 환경** (`.env.test`)
```bash
# 테스트 환경에서는 mock 사용
VITE_API_BASE_URL=
```

### 2. API 래퍼 수정

`apps/web/src/api/client.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function getAllMeetings(): Promise<{ meetings: Meeting[] }> {
  return requestJson(`${API_BASE_URL}/api/meetings`);
}
```

### 3. 각 API 함수 수정

```typescript
// 기존
export async function getAllMeetings(): Promise<{ meetings: Meeting[] }> {
  return requestJson('/api/meetings');
}

// 수정 후
export async function getAllMeetings(): Promise<{ meetings: Meeting[] }> {
  return requestJson(`${API_BASE_URL}/api/meetings`);
}
```

---

## 동작 방식

### 개발 환경

```typescript
API_BASE_URL = ''
URL = `${API_BASE_URL}/api/meetings` = '/api/meetings'
```

```
브라우저 → fetch('/api/meetings')
         ↓
    localhost:5174/api/meetings
         ↓
    Vite proxy → http://localhost:3000/api/meetings
         ↓
    백엔드 (3000번 포트)
```

### 배포 환경

```typescript
API_BASE_URL = 'https://api.bookingtime.example.com'
URL = `${API_BASE_URL}/api/meetings` = 'https://api.bookingtime.example.com/api/meetings'
```

```
브라우저 → fetch('https://api.bookingtime.example.com/api/meetings')
         ↓
    https://api.bookingtime.example.com/api/meetings
         ↓
    백엔드 서버 (별도 도메인)
```

---

## 필요한 변경

### 1. 환경변수 파일 생성

```bash
# 개발 환경 (기본값)
touch apps/web/.env.development
echo "VITE_API_BASE_URL=" > apps/web/.env.development

# 배포 환경 (예시)
touch apps/web/.env.production.example
echo "VITE_API_BASE_URL=https://api.yourdomain.com" > apps/web/.env.production.example
```

### 2. API 래퍼 전체 수정

수정 필요한 파일:
- `apps/web/src/api/client.ts`
- `apps/web/src/api/health.ts`
- `apps/web/src/api/meeting.ts`

각 파일에서:
1. `API_BASE_URL` 상수 추가
2. 모든 fetch 경로에 `API_BASE_URL` prefix 추가

### 3. Vite config 확인 (필요 없음)

기존 proxy 설정 유지:

```typescript
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

이 설정은 개발 환경에서만 사용됩니다.

---

## 배포 시 고려사항

### Railway (현재 사용 중)

Railway에서 각 앱을 별도로 배포하는 경우:

1. **프론트엔드 앱**:
   - 환경변수: `VITE_API_BASE_URL=https://api-yourapp.railway.app`
   - 프록시 사용 안 함

2. **백엔드 앱**:
   - Railway에서 자동 할당된 URL 사용
   - 별도 도메인 사용 가능

### Railway 설정 방법

```bash
# Railway에서 프론트엔드 앱 설정
VITE_API_BASE_URL=https://api-yourapp-production.up.railway.app
```

### CORS 설정 (백엔드)

백엔드에서 프론트엔드 도메인을 허용:

```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
});
```

배포 환경:

```bash
# Railway 백엔드 앱 설정
ALLOWED_ORIGINS=https://yourapp-production.railway.app,https://yourdomain.com
```

---

## 요약

| 환경 | API_BASE_URL | URL 형태 | 프록시 |
|------|-------------|-----------|--------|
| 개발 | '' (빈 문자열) | `/api/meetings` | ✅ 사용 |
| 테스트 | '' (빈 문자열) | `/api/meetings` | ❌ mock 사용 |
| 배포 | `https://api.example.com` | `https://api.example.com/api/meetings` | ❌ 사용 안 함 |

---

## 작업 순서

1. [ ] 환경변수 파일 생성 (.env.development, .env.production.example)
2. [ ] API_BASE_URL 상수 추가 (api/client.ts)
3. [ ] 모든 API 함수 수정 (health.ts, meeting.ts)
4. [ ] Railway 환경변수 설정 (VITE_API_BASE_URL)
5. [ ] 백엔드 CORS 설정 확인
6. [ ] 테스트 실행
7. [ ] 배포 및 검증
