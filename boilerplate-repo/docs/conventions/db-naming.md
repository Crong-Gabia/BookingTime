# Database Naming (Conventions)

## Tables
- **복수형으로 통일**
- snake_case

## Columns
- snake_case
- PK: id
- FK: {entity}_id

## Soft Delete / Timestamps
- created_at, updated_at
- soft delete: **is_deleted (boolean)** + **deleted_at (timestamp, optional)**

## Booleans
- is_*, has_*

## Units
- amount_krw, size_bytes 등 단위 포함
