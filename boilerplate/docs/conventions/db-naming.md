# Database Naming (Conventions)

이 문서는 DB 테이블/컬럼/인덱스/제약조건 네이밍 규칙을 정의합니다.
요약 규칙은 루트 AGENTS.md에, 자동 적용 규칙은 .claude/rules에 둡니다.

## 1. Tables
- **복수형으로 통일**
- snake_case 사용

## 2. Columns
- snake_case 고정
- 기본 PK: id
- FK: {entity}_id

## 3. Soft Delete / Timestamps
- created_at, updated_at
- soft delete: **is_deleted (boolean)** + **deleted_at (timestamp, optional)**

## 4. Booleans
- is_active, has_* 형태

## 5. Units
- amount_krw, size_bytes 등 단위 포함

## 6. Migrations/ORM
- 마이그레이션 파일 네이밍 규칙 통일
- ORM 매핑 시 컬럼명 변환 규칙 명시
