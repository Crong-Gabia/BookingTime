# Database Naming (Gabia Common Conventions)

기존 생성된 DB 컨벤션은 무시하고, **신규 개발/신규 DB**에 대한 컨벤션입니다.

## Severity
- **STRICT**: 반드시 준수
- **RECOMMEND**: 매우 권장 (합의 시 대안 가능)
- **PROPOSAL**: 권장 (필요 시 수용)
- **OOPS**: 지양
- **REFERENCE**: 다른 가이드를 따름

---

## 공통 주의 사항

**RECOMMEND**
- 신규 RDB 개발 시 MySQL 사용 권장
- VIEW TABLE/프로시저는 특수한 경우에만 사용
- PK는 단일키 권장
- FK 제약은 꼭 필요한 경우에만 사용(인덱스로 대체)

---

## 1. 네이밍 컨벤션

### 1.1 테이블명
- **STRICT**: 소문자 snake_case
- **STRICT**: 복수형 금지, **단수형** 사용
- **STRICT**: 예약어 금지
- **STRICT**: 필드명과 동일한 이름 금지
- **RECOMMEND**: 약어 사용 지양
- **RECOMMEND**: 1:n, n:m 연관 테이블은 조합명 사용 (예: `user_mailbox`)

### 1.2 필드명
- **STRICT**: 소문자 snake_case
- **STRICT**: 복수형 금지, **단수형** 사용
- **STRICT**: 예약어 금지
- **RECOMMEND**: PK는 `id`
- **RECOMMEND**: boolean은 `is_`, `has_` 접두어 사용
- **RECOMMEND**: enum은 `_type` 접미어 사용
- **RECOMMEND**: enum 값은 축약 지양 (`S`,`R` → `SEND`,`RECEIVE`)
- **RECOMMEND**: 날짜는 `_date`, 날짜+시간은 `_at` 접미어
- **STRICT**: 테이블명과 동일한 필드명 금지
- **RECOMMEND**: `created_at`, `updated_at` 추가 (변경이 없는 테이블은 `updated_at` 생략 가능)

---

## 2. 데이터 타입

- **PK**: auto_increment, UNSIGNED BIGINT
- **날짜**: `date`, **날짜+시간**: `datetime`
- **boolean**: `tinyint(1)` (또는 `CHAR(1)`)

---

## 3. 기타

### 3.1 NOT NULL
- NULL을 허용하지 않기 위해 설정
- DEFAULT 값이 없는 경우 insert 시 반드시 값 제공

### 3.2 Comments
- **PROPOSAL**: 테이블/필드 comment 작성 권장
