# Code Style (Conventions)

이 문서는 전역 코드 컨벤션의 상세 규칙을 정의합니다.
요약 규칙은 루트 AGENTS.md에, 자동 적용 규칙은 .claude/rules에 둡니다.

## Naming

### Java (camelCase)
- 변수/속성/로컬: camelCase
- 함수: camelCase
- 클래스/타입/enum: PascalCase
- enum 값: PascalCase
- private 필드: `_` 접두사 사용

### TypeScript (snake_case)
- 변수/속성/로컬: snake_case
- 함수: camelCase
- 타입/클래스/enum: PascalCase
- enum 값: PascalCase
- private 필드: `_` 접두사 사용
- 파일명: **PascalCase**

## Rules
- undefined 사용, null 사용 금지
- `===` 사용 (== 지양)
- 문자열은 double quotes(") 사용

## Formatting
- Formatter가 단일 진실

## Imports
- 외부 → 내부 → 상대경로 순

## Type Safety
- 타입 오류 억제 금지

## Testing
- 테스트 파일 네이밍/위치 규칙
