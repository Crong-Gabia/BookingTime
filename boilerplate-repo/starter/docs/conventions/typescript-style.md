# TypeScript 컨벤션 (TS-only)

## Severity
- **STRICT**: 반드시 준수
- **RECOMMEND**: 매우 권장
- **PROPOSAL**: 권장
- **OOPS**: 지양

---

## 1) Naming

### 1.1 Type/Interface/Class/Enum
- **STRICT**: PascalCase
- **STRICT**: Interface 접두사 `I` 금지
- **STRICT**: enum 값은 PascalCase

### 1.2 함수/메서드
- **STRICT**: camelCase

### 1.3 속성/로컬 변수
- **STRICT**: snake_case
- **RECOMMEND**: 약어 지양(명백한 약어만 허용)
- **RECOMMEND**: private 속성은 `_` 접두사 사용

### 1.4 예외(필수)
- **STRICT**: 이미 정의된 외부 라이브러리 API에 맞춰 camelCase 허용
  - 예: React props `onClick`, `className`, TanStack Query `queryKey`, MUI `sx`
- **RECOMMEND**: 외부 API/HTTP 응답이 snake_case이면, 코드에서 snake_case 그대로 유지(매핑 정책은 프로젝트 합의)

---

## 2) 값/비교/문자열

- **STRICT**: `null` 사용 금지, `undefined` 사용
- **OOPS**: `==` 지양, **`===` 사용**
- **STRICT**: 문자열은 double quotes(") 사용

---

## 3) 파일 규칙

- **STRICT**: TS 파일 확장자 `.ts`/`.tsx` 사용
- **STRICT**: 파일명은 PascalCase

---

## 4) 예시

```ts
// ✅ types
export interface MeetingRequest {
  request_id: string;
  created_at: string;
}

// ✅ variables
const request_id = "req_123";

// ✅ methods
function fetchMeeting(request_id: string) {
  return request_id;
}

class MeetingService {
  private _cache_key: string;

  constructor(cache_key: string) {
    this._cache_key = cache_key;
  }

  getMeeting(request_id: string) {
    return request_id;
  }
}

// ✅ external API (camelCase)
// onClick, className 등은 라이브러리 계약을 따른다.
```
