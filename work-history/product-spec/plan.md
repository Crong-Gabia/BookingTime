# 기획서

---
title: BookingTime 일정 조율 시스템 기획서
version: v1.0
status: approved
owner: 기획팀
last_updated: 2026-01-13
source:
  confluence: [링크 추가 필요]
  figma: [링크 추가 필요]
---

## 1. 프로젝트 개요 (Executive Summary)

### 1.1 기획 배경

현재 사내 면접 및 다자간 회의 일정 조율 시, 주최자가 각 참석자에게 개별 연락하여 시간을 확인하고 취합하는 비효율적인 프로세스가 반복되고 있습니다.
이는 업무 몰입도를 저하시키고 일정 확정을 지연시키는 주된 요인입니다.

### 1.2 목표 (Goal)

- **커뮤니케이션 비용 최소화**: 메신저 핑퐁 없이 시스템이 자동으로 가능 시간을 취합
- **일정 확정 속도 개선**: 평균 1일 이상 소요되던 조율 과정을 1시간 이내로 단축
- **통합 UX 제공**: [시간 확인 → 투표 → 예약 → 캘린더 등록]의 단절 없는 원스톱 처리

### 1.3 구축 범위 (Phase 1 MVP)

- 연차/휴가 데이터 기반 자동 필터링 (Negative Selection)
- 웹 링크 기반의 모바일/PC 응답 페이지 구현
- 사내 메신저 알림 연동 (Notification Only)
- 주최자 실시간 모니터링 대시보드
- 회의실 예약 시스템 및 캘린더 연동

---

## 2. 핵심 정책 및 논리적 검증 (Policy & Logic)

기획 단계에서 발생할 수 있는 논리적 구멍(Hole)을 사전에 차단하기 위한 정책 정의입니다.

### 2.1 [정책] Negative Selection (불가 시간 선택)

**정의**: 기본적으로 모든 업무 시간(09:00~18:00)을 "가능(Available)"으로 간주하고, 참석자가 "안 되는 시간(Unavailable)"만 선택하여 제외하는 방식

**논리적 근거**: 사내 일정 조율은 '가능한 시간'보다 '불가능한 시간(이미 잡힌 미팅, 휴가)'이 훨씬 적음. 따라서 클릭 횟수를 획기적으로 줄여 사용성을 높임

**예외 처리**: 시스템이 이미 알고 있는 정보(연차, 공휴일, 점심시간)는 사용자가 선택할 필요 없이 미리 'Blocked(비활성)' 처리하여 오류 방지

### 2.2 [정책] 응답 및 확정 프로세스

**응답 기한**: 별도의 강제 종료 시간은 두지 않으나, 주최자가 대시보드에서 수동으로 [확정]을 누르는 순간 종료됨

**미응답자 처리**: 시스템상에서 강제로 제외하지 않음. 주최자가 대시보드에서 미응답자를 확인하고 [독촉하기]를 누르거나, [제외하고 진행]을 선택하는 의사결정권을 가짐

**동시성 제어**: 주최자가 최종 시간을 선택하고 [확정] 버튼을 누르는 시점에 회의실 예약 API를 호출함. 만약 그 찰나에 회의실이 선점되었다면, 즉시 에러 메시지를 띄우고 회의실 재선택 단계로 되돌림

### 2.3 [정책] 알림 발송 채널

**제약 사항**: 사내 메신저(Native App)의 인앱 브라우저 및 버튼 개발 공수 과다

**해결 방안**: 메신저 봇은 단순 "텍스트 알림 + URL 링크" 발송 역할만 수행. 실제 액션은 SSO가 연동된 모바일/PC 웹 브라우저에서 처리함

---

## 3. 상세 프로세스 플로우 (Process Flow)

주최자, 시스템, 참석자 간의 인터랙션과 데이터 흐름을 도식화했습니다.

```mermaid
sequenceDiagram
    participant Organizer as 주최자 (Web)
    participant System as 시스템 (Server)
    participant HR_DB as HR/근태 DB
    participant Messenger as 사내 메신저 Bot
    participant Participant as 참석자 (Mobile Web)
    participant RoomAPI as 회의실 예약/캘린더 API

    %% Step 1: 조율 생성
    Organizer->>System: 1. 일정 조율 요청 생성 (참석자, 기간, 소요시간 설정)
    System->>HR_DB: 2. 참석자 연차/휴가 정보 조회
    HR_DB-->>System: 연차 데이터 반환
    System->>System: 3. 1차 필터링 (연차, 공휴일 제외한 타임테이블 생성)

    %% Step 2: 알림 및 응답
    System->>Messenger: 4. 참석자에게 응답 요청 알림 (URL 포함) 발송
    Messenger-->>Participant: [PUSH] 일정 확인 요청
    Participant->>System: 5. URL 접속 (SSO 로그인)
    System-->>Participant: 6. 개인별 타임테이블 출력 (기본값: 모두 가능)
    Participant->>Participant: 7. 불가능한 시간 클릭 (Negative Selection)
    Participant->>System: 8. 응답 제출 완료

    %% Step 3: 모니터링 및 독촉
    loop 응답 대기
        Organizer->>System: 9. 대시보드 조회 (실시간 응답율)
        System-->>Organizer: 응답 현황 데이터 반환
        opt 미응답자 발생 시
            Organizer->>System: 10. [독촉하기] 버튼 클릭
            System->>Messenger: 11. 재알림 PUSH 발송
        end
    end

    %% Step 4: 확정 및 예약
    Organizer->>System: 12. 공통 가능 시간 확인 및 선택
    System->>RoomAPI: 13. 해당 시간에 예약 가능한 회의실 조회
    RoomAPI-->>System: 회의실 목록 반환
    System-->>Organizer: 회의실 리스트 출력
    Organizer->>System: 14. 회의실 선택 및 [최종 확정] 클릭

    %% Step 5: 트랜잭션 처리
    rect rgb(240, 248, 255)
        System->>RoomAPI: 15. 회의실 예약 요청
        alt 예약 성공
            RoomAPI-->>System: 예약 성공 응답
            System->>RoomAPI: 16. 참석자 캘린더 일정 등록
            System->>Messenger: 17. 확정 알림(장소, 시간) 전송
        else 예약 실패 (선점됨)
            RoomAPI-->>System: 실패 응답
            System-->>Organizer: "회의실이 마감되었습니다. 다시 선택해주세요."
        end
    end
```

---

## 4. 정보 구조도 (Information Architecture)

시스템의 메뉴 구조 및 페이지 구성을 정의합니다.

### Site Map

- **Home (Dashboard)**
  - 진행 중인 조율 목록
    - [Card] 일정 요약 (제목, 기간, 응답률)
    - [Action] 상세 보기 / 확정하기
  - 완료된 조율 목록 (히스토리)
  - + 새 일정 만들기 (Floating Button)

- **일정 생성 (Create)**
  - 기본 정보 입력 (제목, 설명)
  - 참석자 선택 (조직도 검색)
  - 시간/기간 설정 (소요시간, 날짜 범위, 시간대 필터)

- **응답 페이지 (Response - Mobile/PC)**
  - 일정 개요 (제목, 주최자, 소요시간)
  - Time Grid (날짜별 시간 선택)
    - [Toggle] 전체 가능 / 전체 불가
    - [Slot] 시간대별 상태 (가능/불가/Blocked)
  - 제출 완료 (Thank you page)

- **주최자 상세/확정 (Detail & Confirm)**
  - 응답 현황판 (참석자 리스트, 상태, 독촉 버튼)
  - 공통 가능 시간 리스트 (교집합 결과)
  - 회의실 선택 (예약 가능 목록)
  - 최종 완료 페이지

---

## 5. 데이터 모델링 (ERD)

핵심 비즈니스 로직을 지탱하는 데이터 구조입니다.

| Entity | Table Name | 주요 컬럼 (PK, FK 제외) | 설명 |
|--------|------------|------------------------|------|
| 조율 요청 | meeting_requests | title, duration_min, start_date, end_date, organizer_id, status | 일정 조율의 마스터 정보 |
| 참석자 | participants | request_id(FK), user_id, is_required(필수여부), response_status(PENDING/RESPONDED) | 요청에 포함된 참석자 및 응답 상태 |
| 가용 시간 | time_slots | participant_id(FK), slot_date, start_time, end_time, status(AVAILABLE/UNAVAILABLE) | 참석자가 응답한 데이터 (정규화) |
| 확정 정보 | confirmed_meetings | request_id(FK), confirmed_start, confirmed_end, room_id, reservation_no | 최종 확정된 시간 및 회의실 예약 정보 |
| 알림 로그 | notifications | request_id(FK), recipient_id, type(REQUEST/REMIND/CONFIRM), sent_at | 알림 발송 이력 관리 |

---

## 6. 화면 설계 및 UI/UX 상세 기획 (Wireframe Spec)

### 6.1 [주최자] 대시보드 및 상세 화면

**화면 구성**:

- **헤더**: 일정 제목, 기간, "현재 응답률: 2/3 (66%)" Progress Bar

- **좌측 (참석자 현황)**:
  - 리스트 형태로 [이름 | 부서 | 상태 아이콘] 표시
  - 응답 완료자는 녹색 체크(✅), 미응답자는 회색 시계(⏳) 아이콘
  - 미응답자 옆에 [재요청] 버튼 배치 (클릭 시 알림 발송)

- **우측 (결과 도출)**:
  - "모두 가능한 시간" 섹션
  - 날짜별로 그룹핑하여 시간 리스트 노출 (예: 1/15 14:00, 15:00)
  - 시간 클릭 시 하단에 "예약 가능한 회의실" 드롭다운 활성화
  - 회의실 선택 후 [최종 확정] 버튼 활성화

### 6.2 [참석자] 응답 화면 (Mobile Web 최적화)

**화면 구성**:

- **상단**: "홍길동 대리님, 면접 일정 확인 부탁드립니다." (친근한 문구)

- **중단 (Time Grid)**:
  - 세로 스크롤 형태의 날짜 리스트
  - 각 날짜 안에 가로로 배치된 시간 칩(Chip) 형태
  - 디자인:
    - 🟢 가능 (기본): 밝은 녹색 배경
    - 🔴 불가 (선택): 탭하면 붉은색+취소선 처리
    - ⚪ 제외 (시스템): "연차/점심" 텍스트와 함께 흐리게 처리 (클릭 불가)

- **하단 (Sticky)**: [일정 제출하기] 버튼 (화면 스크롤과 무관하게 항상 노출)

---

## 7. 기능 명세서 (Functional Specification)

개발자가 구현해야 할 상세 로직입니다.

### F-01. 초기 데이터 생성 및 필터링

**Trigger**: 주최자가 [생성하기] 버튼 클릭

**Logic**:
1. 선택된 기간(예: 5일) × 업무시간(9시간) = 총 45개 슬롯 생성
2. HR API 호출하여 해당 참석자의 연차일 조회
3. 연차인 날짜의 슬롯 상태를 BLOCKED로 DB 저장 (Default는 AVAILABLE)
4. 주말 및 공휴일 API 대조하여 BLOCKED 처리

### F-02. 교집합 계산 알고리즘

**Trigger**: 대시보드 진입 시 또는 참석자 응답 제출 시

**Logic**:
1. meeting_requests의 duration_minutes (예: 60분) 확인
2. 모든 필수 참석자(is_required=true)의 AVAILABLE 슬롯 조회
3. 모든 참석자가 공통으로 AVAILABLE한 슬롯만 필터링 (AND 연산)
4. 연속된 슬롯이 duration_minutes를 충족하는지 검증 (예: 30분 슬롯 2개 연속)

### F-03. 알림 발송 (Throttling)

**Logic**: 독촉 버튼 연속 클릭 방지를 위해, 동일인에게는 10분 내 재발송 불가 처리 (프론트엔드 비활성 + 백엔드 체크)

---

## 8. 검증 및 향후 계획 (Self-Check & Roadmap)

### 8.1 2차 개발 계획 (Phase 2 Roadmap)

향후 고도화를 위해 미리 준비해야 할 사항입니다.

**지능형 추천 (AI)**:
- 현재는 "모두 되는 시간"을 단순 나열하지만, 2차에서는 "참석자들이 주로 선호하는 시간대(오전/오후)"나 "회의실 동선"을 고려하여 추천 순위를 매겨줍니다

**LLM 기반 자연어 생성**:
- 일정 생성 시 폼 입력 대신 채팅창에 "다음 주 김팀장님이랑 면접 잡아줘"라고 입력하면 자동으로 폼을 채워주는(Prefill) 기능

**회의실 자동 배정**:
- 현재는 수동 선택이지만, 참석 인원수와 회의실 정원을 비교하여 최적의 회의실을 자동 예약하는 기능 (회의실 시스템 데이터 고도화 선행 필요)

**외부 캘린더 연동**:
- 구글/네이버 등 외부 캘린더 API를 연동하여 사외 일정까지 고려한 필터링

---

## 참고

- **기획 버전**: v1.0
- **마지막 업데이트**: 2026-01-13
- **의사결정 기록**: [`decisions.md`](./decisions.md)
- **모순/리스크 분석**: [`risks.md`](./risks.md)
- **외부 링크**: [`links.md`](./links.md)
