# AI 에이전트 사용 가이드라인

**최종 업데이트**: 2026-01-13

---

## 개요

이 문서는 OpenCode AI 에이전트(Sisyphus)를 효율적으로 사용하기 위한 지침입니다.

---

## 에이전트 활용 원칙

### 1. 언제 에이전트를 사용하는가

**에이전트 사용 권장**:
- 복잡한 아키텍처 결정이 필요할 때 → Oracle
- 외부 라이브러리/패키지 사용법을 찾을 때 → Librarian
- 코드베이스 패턴/구조를 탐색할 때 → Explore
- 프론트엔드 UI/UX 디자인이 필요할 때 → Frontend UI/UX Engineer
- 문서 작성이 필요할 때 → Document Writer
- 브라우저 자동화가 필요할 때 → Playwright (skill 호출)

**에이전트 사용 불필요**:
- 단순 파일 읽기/쓰기 → 직접 Read/Write 도구 사용
- 명확한 함수/클래스 찾기 → Grep/Glob 도구 사용
- 단순 버그 수정 (1-2줄) → 직접 코드 수정

### 2. 에이전트 사용 패턴

#### ✅ 올바른 사용 예시

```typescript
// 1. 복잡한 아키텍처 결정
// 이 경우는 Oracle을 사용해서 전문가의 의견을 구함
// 설명: 여러 시스템 간의 trade-off를 고려해야 하는 복잡한 결정

// 2. 외부 라이브러리 문서 찾기
// 이 경우는 Librarian을 사용해서 공식 문서를 검색
// 설명: TanStack Query 사용법에 대해 공식 문서 확인 필요

// 3. 코드베이스 패턴 탐색
// 이 경우는 Explore를 사용해서 코드베이스를 검색
// 설명: 인증 로직이 어떻게 구현되어 있는지 여러 파일에서 패턴 찾기
```

#### ❌ 잘못된 사용 예시

```typescript
// 1. 단순한 파일 수정에 에이전트 사용
// 설명: 한 줄 수정인데 왜 에이전트를 쓰는가? 직접 수정하세요

// 2. 명확한 검색에 에이전트 사용
// 설명: find . -name "*.tsx" 라면 그냥 Glob 사용하세요
```

### 3. 병렬 실행 (Background Task)

여러 에이전트를 병렬로 실행해서 효율성을 높이세요:

```bash
# ✅ 올바른 병렬 실행
background_task(agent="explore", prompt="Find auth implementations")
background_task(agent="explore", prompt="Find error handling patterns")
background_task(agent="librarian", prompt="Lookup TanStack Query docs")

# ❌ 순차 실행 (비효율적)
result1 = task(agent="explore", prompt="Find auth implementations")
result2 = task(agent="explore", prompt="Find error handling patterns")
```

### 4. 에이전트 프롬프트 작성

에이전트에 전달하는 프롬프트는 명확하고 구체적이어야 합니다:

**✅ 좋은 프롬프트**:
```
Task: Find auth implementations in our codebase
Requirements:
- Search for authentication-related files and functions
- Identify patterns (JWT, session, OAuth, etc.)
- Return file paths and code snippets
```

**❌ 나쁜 프롬프트**:
```
Task: 인증 관련 코드 찾아줘
```

## 에이전트별 사용 가이드

### Oracle (고급 아키텍처 자문)

**사용 목적**:
- 복잡한 시스템 설계 결정
- 성능 최적화 전략
- 보안 관련 아키텍처
- 여러 시스템 간 통합 전략

**사용 예시**:
```
Task: Design authentication flow for microservices
Requirements:
- JWT vs SessionToken comparison
- Refresh token strategy
- Multi-tenant architecture consideration
- Security best practices
```

**사용 시기**:
- ✅ 2개 이상 모듈이 관련된 복잡한 기능 설계
- ✅ 불확실한 아키텍처 패턴 선택
- ✅ 성능/보안 우려가 있는 설계
- ❌ 단순 구현 질문
- ❌ 명박한 기술 선택

### Librarian (외부 문서/오픈소스 검색)

**사용 목적**:
- 라이브러리 공식 문서 찾기
- GitHub에서 사용 예시 검색
- 베스트 프랙티스 찾기

**사용 예시**:
```
Task: Find React useEffect cleanup examples
Requirements:
- Search GitHub for real production code
- Return code snippets with proper cleanup
- Focus on useEffect with event listeners
```

**사용 시기**:
- ✅ 새로운 라이브러리 사용법 학습
- ✅ 오픈소스 프로젝트에서 구현 예시 찾기
- ✅ 공식 API 문서 확인
- ❌ 코드베이스 내부 검색 (Explore 사용)

### Explore (코드베이스 내부 검색)

**사용 목적**:
- 프로젝트 내 코드 패턴 찾기
- 파일/함수/클래스 위치 확인
- 여러 레이어 간의 코드 연결 확인

**사용 예시**:
```
Task: Find all components that use MUI AppBar
Requirements:
- Search for AppBar imports
- Return file paths and usage patterns
- Analyze navigation implementation
```

**사용 시기**:
- ✅ 여러 파일에서 패턴 찾기
- ✅ 특정 기능의 구현 위치 확인
- ✅ 코드베이스 구조 파악
- ❌ 단일 파일 읽기 (Read 사용)
- ❌ 외부 문서 검색 (Librarian 사용)

### Frontend UI/UX Engineer (프론트엔드 디자인)

**사용 목적**:
- UI/UX 디자인 (mockup 없이도)
- 시각적 컴포넌트 구현
- 스타일링, 애니메이션, 레이아웃

**사용 시기**:
- ✅ 시각적 변경 (색상, 간격, 레이아웃)
- ✅ 애니메이션 추가
- ✅ 반응형 디자인
- ✅ 사용자 경험 개선
- ❌ 비즈니스 로직 구현

### Document Writer (문서 작성)

**사용 목적**:
- README 작성
- API 문서 작성
- 가이드/튜토리얼 작성

**사용 예시**:
```
Task: Write API documentation for meeting service
Requirements:
- Document all endpoints
- Include request/response formats
- Add usage examples
- Follow project documentation style
```

## 에이전트 결과 검증

에이전트가 작업을 완료하면 반드시 결과를 검증하세요:

### 검증 체크리스트

- [ ] 결과가 요청한 내용과 일치하는가?
- [ ] 코드가 프로젝트 기존 스타일을 따르는가?
- [ ] 기능이 정상적으로 작동하는가?
- [ ] 타입 안전성이 유지되는가?
- [ ] 테스트가 필요한 경우 작성되었는가?

### 검증 방법

```bash
# 1. 빌드 확인
pnpm run build

# 2. 테스트 실행
pnpm test

# 3. 타입 체크
pnpm --filter web tsc --noEmit
```

## 에이전트 사용 시 주의사항

### ⚠️ 일반 주의사항

1. **백그라운드 작업 사용**: 시간이 많이 걸리는 작업은 background_task 사용
2. **결과 수집**: background_output으로 결과 수집 시 병렬로 실행된 작업 모두 수집
3. **청소**: 작업 완료 후 background_cancel(all=true)로 백그라운드 작업 청소

### 🚫 금지 사항

1. **단순 작업에 에이전트 사용**:
   - 단순 파일 수정 → 직접 Edit
   - 단순 검색 → Grep/Glob
   - 명확한 코드 위치 찾기 → Grep

2. **불필요한 에이전트 호출**:
   - 이미 알고 있는 라이브러리 사용법 → 직접 구현
   - 프로젝트 내부 명확한 검색 → Explore 대신 Grep/Glob

3. **모호한 프롬프트**:
   - 구체적이지 않은 요청
   - 여러 해석이 가능한 질문

## 효율성 팁

### 1. 병렬 실행 최적화

```typescript
// ✅ 좋음: 관련 없는 작업 병렬 실행
background_task(agent="explore", prompt="Find auth patterns")
background_task(agent="librarian", prompt="Search JWT best practices")

// ❌ 나쁨: 같은 에이전트를 순차로 호출
result1 = background_task(...)
result2 = background_task(...)
```

### 2. 적절한 에이전트 선택

```
도메인                    | 에이전트                | 도구
-------------------------|-------------------------|-------
외부 문서/패키지      | Librarian               | GitHub, Web Search, Context7
내부 코드베이스 검색  | Explore                 | Grep, Glob
아키텍처/설계         | Oracle                  | Deep reasoning
UI/UX                   | Frontend UI/UX Engineer  | Styling, Layout
문서                    | Document Writer         | README, API Docs
```

### 3. 프롬프트 구조

모든 에이전트 프롬프트는 다음 구조를 따르세요:

```typescript
1. TASK: 명확하고 구체적인 작업
2. EXPECTED OUTCOME: 구체적인 결과물과 성공 기준
3. REQUIRED SKILLS: 사용할 에이전트
4. REQUIRED TOOLS: 명시적인 도구 화이트리스트
5. MUST DO: 포괄적 요구사항 (아무것도 암묵적이지 말기)
6. MUST NOT DO: 금지된 동작 (선제 차단)
7. CONTEXT: 파일 경로, 기존 패턴, 제약사항
```

## 문구 가이드

### 에이전트 사용 시 권장 문구

**에이전트 호출 전**:
- "Explore 에이전트를 사용하여 인증 구현을 찾겠습니다"
- "Librarian 에이전트를 통해 공식 문서를 확인하겠습니다"
- "Oracle 에이전트와 복잡한 아키텍처 결정을 논의하겠습니다"

**에이전트 호출 중**:
- "관련된 여러 검색을 병렬로 실행하여 시간을 절약합니다"
- "백그라운드에서 실행하고 작업을 계속 진행합니다"

**에이전트 호출 후**:
- "에이전트 결과를 검증하고 적용하겠습니다"
- "에이전트가 제공한 코드를 검토하여 프로젝트 스타일에 맞게 수정하겠습니다"

### 읽기 쉬운 문구

**명확한 설명**:
- ✅ "Explore 에이전트를 사용하여 인증 관련 파일을 검색합니다"
- ✅ "Librarian 에이전트를 통해 React Query 공식 문서를 확인합니다"
- ❌ "인증 패턴을 찾습니다"
- ❌ "문서를 봅니다"

**이유 설명 포함**:
- ✅ "여러 파일에서 패턴을 찾아야 하므로 Explore 사용"
- ✅ "외부 라이브러리 사용법을 익혀야 하므로 Librarian 사용"
- ❌ "Explore 사용"
- ❌ "Librarian 사용"

## 에러 복구

### 에이전트 호출 실패 시

1. **프롬프트 명확성 확인**: 요구사항을 구체적으로 설명했는지 확인
2. **도구 화이트리스트 확인**: REQUIRED_TOOLS에 필요한 도구가 포함되어 있는지 확인
3. **수동 작업 시도**: 에이전트가 실패하면 직접 작업 시도

## 참고 자료

- [개발 가이드라인 (General)](./agents.md)
- [브랜치 전략](../../guidelines/07-git-branch-strategy.md)
- [OpenCode 문서](https://opencode.ai/docs)
