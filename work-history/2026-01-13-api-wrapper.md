## 수행 날짜
- 2026-01-13

## 수행 작업
- `guidelines/04-data-fetching.md`에 정의된 API 래퍼, 타입, TanStack Query 규칙을 다시 확인하여 구현 방향을 잡음.
- `apps/web/src/api/`에 공통 fetch 헬퍼(`requestJson`)와 health/meeting 관련 API 래퍼를 생성하고, `index.ts`로 묶어 재사용 가능하게 정리함.
- `HomePage`, `DashboardPage`, `ResponsePage`, `CreatePage`를 새 API 래퍼로 바꿔 TanStack Query/Mutation을 계속 사용하면서 타입 안전하게 서버와 통신하도록 수정함.

## 의사결정/이슈
- Dashboard DTO에 `durationMinutes` 필드가 없어 기존 메시지를 그대로 쓸 수 없어서 “30분 단위”로 설명 문구를 조정함.
- ResponsePage와 CreatePage는 로컬 state 대신 `useMutation` 상태(`isPending`)를 기준으로 UI를 제어해 일관된 캐시 전략을 활용하게 함.

## 해결 방법
- API 호출은 `requestJson` 헬퍼로 통일하고 모든 에러 응답에서 메시지를 추출하도록 했으며, 클라이언트에서는 `@shared/dto`를 통해 정의된 DTO를 그대로 소비하도록 구성함.
- 미완성된 회의 리스트는 여전히 하드코딩된 상태지만, 향후 API 응답을 화면에 연결하려면 API 래퍼를 확장하면 되도록 구조를 마련함.

## 다음 단계
- 실제 회의 목록을 가져와 HomePage 카드에 렌더링하거나, create/response 등 각 페이지에서 받은 응답을 캐시하고 나중에 활용하는 TanStack Query cache 전략을 심화할 수 있음.
