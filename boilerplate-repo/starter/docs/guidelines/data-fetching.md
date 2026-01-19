# 데이터 패칭 (General)

## 원칙
- 네트워크 호출은 한 곳(클라이언트/레포지토리/SDK)으로 중앙화
- 캐시 정책(staleTime/retry 등)은 프로젝트 기본값을 문서화
- 에러 메시지는 사용자용으로 매핑

## 권장 구조
- api/ (HTTP client)
- services/ (비즈니스 단)
- hooks/ (UI 바인딩)

## 캐시 전략
- 변경 후 관련 데이터 invalidate
- optimistic update는 영향 범위가 명확한 경우만
