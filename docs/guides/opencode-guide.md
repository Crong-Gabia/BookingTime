# OpenCode 사용 가이드

이 문서는 OhMyOpenCode와 OpenCode를 활용한 개발 워크플로우를 안내합니다.

## 기본 개념

### ULTRAWORK MODE
- **정의**: 계획을 먼저 수립하고 병렬 에이전트를 활용하는 작업 모드
- **사용 시점**: 기능 추가/리팩토링/테스트 영향 있는 변경/PR 목적 작업
- **사용하지 않아도 되는 작업**: 단일 스크립트, POC, throwaway 코드 생성
- **운영 원칙**: 기본 ON, 단 POC는 OFF

### 에이전트 역할 분담

| 에이전트 | 역할 | 비용 | 사용 시점 |
|---------|------|------|----------|
| **Planner** | 작업 계획 수립 | - | 복잡한 작업 시작 전 |
| **Explore** | 코드베이스 탐색/패턴 발견 | 무료 | 내부 코드 구조 파악 |
| **Librarian** | 외부 문서/코드 예제 검색 | 무료 | 라이브러리/API 사용법 |
| **Oracle** | 고난도 아키텍처/설계 결정 | 유료 | 복잡한 아키텍처 결정, 2회 이상 실패 시 |
| **Frontend UI/UX** | 프론트엔드 UI/UX 구현 | 저비용 | 시각적 변경 (스타일, 레이아웃, 애니메이션) |
| **Build** | 빌드/배파 작업 | - | CI/CD 파이프라인 |

### MCP 서버
- **Context7**: 공식 문서/라이브러리 API 참조
- **grep.app**: GitHub 코드 검색 (실제 사용 패턴)
- **Playwright**: 브라우저 자동화 (테스트/스크래핑)

### LSP 도구
- **rename**: 심볼 리네임 (전역 참조 업데이트)
- **code actions**: 리팩토링/정적 분석
- **diagnostics**: 에러/경고 감지

## 설정 파일

### 파일 위치
```
사용자 전역: ~/.config/opencode/oh-my-opencode.json
프로젝트 전용: .opencode/oh-my-opencode.json (레포에 커밋 가능)
```

### 프로젝트 설정 예시
```json
{
  "project": {
    "name": "BookingTime",
    "description": "회의 예약 시스템"
  },
  "workflows": {
    "ultrawork_default": true,
    "plan_first": true
  },
  "hooks": {
    "context_management": "auto",
    "output_truncation": "enabled"
  }
}
```

## 작업 표준 프로세스

### 1. 작업 시작 표준 프롬프트
```
**배경/목적**: [무엇을 왜 하려는지]
**변경 범위**: [파일/모듈/엔드포인트]
**완료 기준**: [테스트/문서/성능/호환성]
**금지사항**: [깨지면 안 되는 동작, 호환성 제약]
```

### 2. ULTRAWORK 사용 절차

1. **조사/계획 단계**
   - ULTRAWORK MODE 활성화
   - "계획 먼저 출력" 요청 (바로 구현 지시 금지)
   - 병렬 에이전트로 탐색/조사 수행

2. **계획 승인**
   - 제시된 계획 검토
   - 범위/완료기준 확인

3. **실행 단계**
   - "이 계획대로 구현 시작"으로 지시
   - **주의**: `/start-work` 슬래시 커맨드가 자동 제안되더라도 커맨드가 없으면 일반 지시로 진행

### 3. 플랜 호출 문법 표준화
- ✅ 올바른 사용: `@plan`
- ❌ 오류 사용: `/plan`
- **이유**: 최근 커밋에서 `/plan`에서 `@plan`으로 정정됨

## 슬래시 커맨드/스킬 관리

### 커맨드 디렉토리 우선순위
```
1. .opencode/command/          (프로젝트 전용, 우선순위 최고) ✅ 권장
2. ~/.config/opencode/command/ (개인 전역)
3. .claude/commands/          (Claude Code 호환)
4. ~/.claude/commands/         (Claude Code 호환)
```

### 팀 공용 커맨드 템플릿

#### `create-issue.md` (이슈 템플릿 생성)
```markdown
---
description: GitHub 이슈 템플릿 생성
---

## 문제 설명
- 현재 상황:
- 기대 동작:
- 실제 동작:

## 재현 방법
1.
2.
3.

## 추가 정보
- 스크린샷/로그:
```

#### `write-dev-docs.md` (개발 지침 문서 생성)
```markdown
---
description: 개발 지침 통합 문서 골격 생성
---

# [제목]

## 개요
- 목적:
- 범위:
- 대상 독자:

## 구현 가이드
1.
2.
3.

## 테스트 방법
```

#### `pr-checklist.md` (PR 전 점검 체크리스트)
```markdown
---
description: PR 생성 전 점검 체크리스트
---

## 코드 품질
- [ ] LSP diagnostics 통과
- [ ] 테스트 전체 통과
- [ ] 빌드 성공
- [ ] 불필요한 console.log 제거

## 기능 검증
- [ ] 완료 기준 충족
- [ ] 회귀 없음
- [ ] 사용자 스토리 달성

## 문서
- [ ] README/CHANGELOG 업데이트
- [ ] API 문서 반영
- [ ] 워크 히스토리 기록
```

## 모델 사용 가이드

### 역할 분리
| 작업 | 모델 | 이유 |
|-----|------|------|
| 조사/탐색 | 무료 (GLM-4.7 Free 등) | 빠르고 비용 효율적 |
| 설계/결정 | 유료 (고성능 모델) | 복잡한 추론 필요 |
| 구현 | 상황에 따름 | 간단한 구현은 무료, 복잡한 구현은 유료 |

## 주의사항

### 알려진 이슈
1. **`/start-work` 커맨드가 존재하지 않을 수 있음**
   - 현상: ULTRAWORK 중 플래너가 `/start-work`를 자동 제안
   - 해결: 프로젝트에 커맨드를 추가하거나 일반 지시로 진행
   - 관련 이슈: 실제로 보고됨

2. **계획 호출 문법 혼선**
   - 문서/내부 가이드에서 `/plan`을 사용하지 않도록 주의
   - 항상 `@plan` 사용 (최근 커맨드 정정 커밋 존재)

3. **모델 카탈로그 갱신**
   - 무료 모델 업데이트로 인해 가이드 주기적 검토 필요
   - 예: librarian now uses GLM-4.7 Free

## Hook 설정

### 컨텍스트 관리
- `context_management`: auto (자동 컨텍스트 축소)

### 세션 복구
- `session_recovery`: enabled (중단된 작업 재개)

### 출력 트렁케이션
- `output_truncation`: enabled (긴 출력 자동 요약)

## 참고 자료
- [OpenCode 공식 문서](https://docs.opencode.ai)
- [OhMyOpenCode 슬래시 커맨드 시스템](https://github.com/opencode-ai/oh-my-opencode)
- [관련 커밋 히스토리](https://github.com/opencode-ai/oh-my-opencode/commits/main)
