# Database Naming (Conventions)

## Tables
- 복수형/단수형 중 하나로 통일
- snake_case

## Columns
- snake_case
- PK: id
- FK: {entity}_id

## Timestamps
- created_at, updated_at
- soft delete: deleted_at

## Booleans
- is_*, has_*

## Units
- amount_krw, size_bytes 등 단위 포함
