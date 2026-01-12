# 기술 스택 및 아키텍처 가이드

## 백엔드 (NestJS + PostgreSQL)
- 프레임워크: NestJS(Typescript), ORM: Prisma, DB: PostgreSQL, 캐시(선택): Redis.
- 인증: 1차 JWT + 사내 계정 훅, 추후 OIDC/SAML 교체 가능 구조로 설계.
- 슬롯 처리: 서버에서 기본 슬롯 생성(09~18시, 30분 단위, 점심 12~13 BLOCKED, 주말 BLOCKED), 기본 AVAILABLE 후 불가만 UNAVAILABLE로 업데이트.
- 동시성: DB 트랜잭션 + unique 제약 + optimistic lock(version 컬럼); 확정 시 상태 OPEN 확인 후 version 비교.
- 외부 연동: adapter 인터페이스 후 Fake 구현체 기본 주입(FakeRoom/Holiday/Hr/Messenger), 실제 연동은 TODO.

## 프론트엔드 (React + Vite)
- React + Vite + TypeScript, 라우팅은 React Router, 데이터는 TanStack Query로 캐싱/요청 관리.
- UI 라이브러리: MUI 또는 Chakra 중 하나를 고정 선택.
- 모바일: CSS 반응형 + sticky footer로 제출 영역 고정.

## 모노레포 구조(권장)
```
scheduler-mvp/
  apps/
    api/    # NestJS
    web/    # React(Vite)
  packages/
    shared/ # DTO, 타입, zod 등 공통
  infra/
    docker/ # postgres, redis(optional)
  pnpm-workspace.yaml
  turbo.json
  README.md
```
- 도구: pnpm + Turborepo(또는 Nx). 단일 lockfile 유지.
- 환경변수: api는 `DATABASE_URL`, web은 `VITE_API_BASE_URL`.

## DB 스키마 핵심 필드/제약
- meeting_requests: status(DRAFT/OPEN/CONFIRMED/CANCELED), closed_at, version(int, optimistic lock), status 인덱스.
- participants: unique(request_id, user_id), reminded_at(또는 알림 로그).
- time_slots: status(AVAILABLE/UNAVAILABLE/BLOCKED), index(participant_id, slot_date).
- confirmed_meetings: unique(request_id)로 1회만 확정.

## 품질 기준
- DTO 검증: class-validator 또는 zod 필수.
- 시간/타임존: 서버·DB는 UTC 저장, 화면은 Asia/Seoul(KST)로 표시 명시.
- 에러 코드 통일: 예) ROOM_TAKEN, VERSION_MISMATCH, REQUEST_CLOSED 등.
- 응답 차단: status=CONFIRMED 또는 closed_at 설정 시 respond 불가 처리.
- 테스트: 슬롯 교집합, 확정 동시성, 알림 throttle 등 핵심 로직에 통합 테스트 추가.
