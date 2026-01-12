# 작업 로그

## 2026-01-12

### [요구사항 단순화] SSO 제거, 링크 공유 기능

#### 변경 사항
- **SSO/인증 제거**: 이메일/링크로 공유 가능하도록 변경
- **외부 연동 Mock 유지**: HR, Holiday, Room 어댑터는 Fake 구현체로 유지
- **PostgreSQL 유지**: Docker Compose로 쉽게 실행 가능하므로 그대로 사용

#### 핵심 요구사항
- 회의 생성: 주최자가 직접 참석자 이메일 입력
- 링크 공유: 생성된 회의의 응답/대시보드 링크 공유
- 응답 수집: 참석자가 가능한 시간 선택 (Negative Selection)
- 확정: 주최자가 최종 시간 선택 후 확정

### [프론트엔드 개발] 기획서 기준 구현

#### 완료된 작업
1. **HomePage 개선**:
   - 진행 중인 조율 목록 UI (placeholder)
   - 완료된 조율 목록 UI (placeholder)
   - + 새 일정 만들기 버튼
   - 라우트 연동: `/requests/new`

2. **CreatePage 구현**:
   - 회의 제목, 설명 입력 폼
   - 참석자 이메일/이름 입력 (동적 추가/삭제)
   - 시작일, 종료일, 소요시간 선택
   - API 연동: `/api/meetings` POST 호출
   - 생성 후 대시보드로 자동 이동

3. **DashboardPage 완성**:
   - URL 파라미터(:id) 처리
   - 응답 현황판 (참석자 리스트, 상태, 응답률)
   - 독촉 버튼 (개별 알림 전송)
   - 공통 가능 시간 리스트
   - 회의실 선택 (선택사항)
   - 확정하기 버튼
   - 링크 공유 기능 (복사/네이티브 공유)

4. **ResponsePage 개선**:
   - 날짜별 슬롯 생성 (세로 스크롤)
   - 전체 가능/전체 불가 토글 버튼
   - 시간 선택 상태: 가능(초록)/불가(빨강)/Blocked(비활성)
   - 점심시간, 주말 자동 Blocked 처리
   - 제출 완료 페이지 구현
   - 이름 입력 필드

5. **App.tsx 라우팅 추가**:
   - `/requests/new` 루트 추가 (CreatePage)

### [문서 작성] 가이드 및 구조 정리

#### 완료된 작업
1. **실행 가이드**: `work-history/2026-01-12-execution-guide.md`
   - 개발 환경 시작 방법 (Docker, 의존성, 마이그레이션, 서버)
   - 사용 가능한 스크립트 목록
   - 데이터베이스 관리 (Docker, Prisma Studio)
   - 테스트 실행 방법
   - 일반적인 문제 해결

2. **배포 가이드**: `work-history/2026-01-12-deployment-guide.md`
   - 추천 플랫폼: Railway (백엔드+DB+프론트엔드)
   - 대안: Vercel, Render, AWS
   - 환경변수 설정
   - CI/CD 파이프라인
   - 보안 체크리스트

3. **웹 페이지 구조 트리**: `work-history/2026-01-12-web-page-structure.md`
   - 현재 구현된 페이지 목록
   - 기획서 기준 전체 페이지 구조
   - 개발 우선순위
   - 총 예상 소요 시간

### [백엔드 상태] 기존 코드 유지

#### 외부 연동
- **HR Adapter**: Fake 구현체 유지 (getUserName → '사용자')
- **Holiday Adapter**: Fake 구현체 유지 (isHoliday → false)
- **Room Adapter**: Fake 구현체 유지 (isAvailable → true)

#### API 엔드포인트
- `POST /api/meetings` - 회의 요청 생성
- `GET /api/meetings/:id/dashboard` - 대시보드 조회
- `POST /api/meetings/:id/respond` - 응답 제출
- `POST /api/meetings/:id/remind/:userId` - 독촉 알림
- `POST /api/meetings/:id/confirm` - 회의 확정

### [남은 작업]

1. **백엔드 LSP 오류 해결**:
   - 데코레이터 관련 오류 (NestJS 설정 확인 필요)
   - MeetingRequestStatus 타입 import 확인

2. **테스트 및 검증**:
   - 단위 테스트 작성 (핵심 로직)
   - 통합 테스트 작성 (전체 흐름)
   - 실제 서버 띄워서 기능 테스트

#### 환경 정보
- 작업 시간: 2026-01-12 23:15 (KST)
- 프로젝트 경로: /Users/heegwonjo/WebstormProjects/whattime
