# Codex 실행용 작업 단위 프롬프트
에이전트에게 그대로 전달하면 되는 작업 단위 템플릿입니다. 필요 시 일부 값만 채워서 사용하세요.

## (A) 레포/도구/기본 설치
- 목표: NestJS + React(Vite) 모노레포를 pnpm + turbo로 구성, PostgreSQL + Prisma 연결.
- 요구사항 요약: `apps/api`(Nest, /health), `apps/web`(Vite, OK 화면+health 호출 버튼), `infra/docker`(postgres: scheduler/scheduler), env(`DATABASE_URL`, `VITE_API_BASE_URL`), 루트 `pnpm-workspace.yaml`, `turbo.json`, README에 로컬 실행법.
- DoD: `pnpm install` 후 `turbo run dev`에서 web/api 모두 구동, web에서 /health 표시, `prisma migrate dev` 성공, lint/format 설정 포함.

## (B) DB 스키마 + 마이그레이션
- Prisma 모델: meeting_requests(상태/버전/closed_at 포함), participants(unique request_id+user_id, reminded_at 옵션), time_slots(status), confirmed_meetings(unique request_id), notifications.
- 제약: time_slots index(participant_id, slot_date), meeting_requests status index, confirmed_meetings unique(request_id).
- DoD: migrate dev 성공, seed로 meeting_requests+participants 샘플 생성.

## (C) API 구현 (Nest + Prisma)
- 엔드포인트: 생성, 대시보드, 응답 조회/제출, 리마인드(10분 throttling), 확정(optimistic lock + 상태 확인 + room stub).
- 슬롯 생성 규칙: 날짜 범위 × 09~18, 30분, 점심 BLOCKED, 주말 BLOCKED, 공휴일/연차는 stub TODO.
- 교집합: 필수 참석자만, duration 연속 슬롯 충족.
- DoD: 주요 성공 케이스 통합/e2e 테스트 1개 이상, 에러 응답 형식 통일.

## (D) 프론트 구현 (React + Vite)
- 라우트: `/`, `/requests/:id/dashboard`, `/requests/:id/respond?userId=...`.
- 대시보드: 응답률, 참가자 리스트+독촉 버튼, 공통 가능 시간 리스트, 시간 선택→회의실 드롭다운→확정.
- 응답 화면: 일정 개요, 슬롯 chip(가능/불가 토글, BLOCKED 비활성), 하단 sticky 제출 버튼, 모바일 대응.
- DoD: API 연동 완료, 모바일에서 응답 화면 사용 가능.
