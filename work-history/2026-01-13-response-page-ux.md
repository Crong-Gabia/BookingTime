# 응답 페이지 UX 개선

## 개요

- **작업 기간**: 2026-01-13
- **작업자**: Sisyphus
- **목표**: `/requests/:id/respond` 페이지의 UX를 개선하고, 가능한/불가능 선택 시 상태(색상)가 즉시 반영되도록 수정

---

## 수행한 작업

### 브랜치/작업 흐름
- `feature/response-page-ux` 브랜치에서 작업 진행
- 작업 단위를 UI/UX(시각) 변경과 상태/로직 수정으로 분리

### 분석
- `apps/web/src/pages/ResponsePage.tsx`에서 시간 슬롯 상태를 `Set`으로 관리
- `toggleSlot`, `handleSetAllAvailable`, `handleSetAllUnavailable`에서 이전 state를 직접 참조하며 여러 번 `setState`를 호출
- React의 batching/비동기 state 업데이트 특성상 즉시 색상이 반영되지 않는 현상이 발생 가능

---

## 의사결정 사항

- **로직/상태 버그는 메인에서 처리**: functional state update + 단일 setState 적용
- **시각적 개선은 분리**: 레이아웃/색상/타이포는 UI/UX 개선 작업으로 별도 진행

---

## 발생한 이슈 및 해결 방법

### 가능한/불가능 선택 시 색상이 즉시 반영되지 않음
- **현상**: 버튼 클릭 후 스타일(색상)이 즉시 반영되지 않거나, 여러 번 클릭해야 반영됨
- **원인(가설)**: state 업데이트가 stale closure를 사용 + 루프 내 다중 setState 호출
- **해결 방향**: functional updater로 이전 state 기반 계산, 루프는 한 번의 setState로 반영

---

## 다음 단계 계획

1. `toggleSlot`/`handleSetAll*`를 functional update로 변경
2. UI/UX 개선(간격/그리드/선택 상태 가시성/모바일 터치 타겟) 적용
3. 로컬에서 `/requests/:id/respond` 동작 확인

---

## 참고 사항

- 변경 파일: `apps/web/src/pages/ResponsePage.tsx`
