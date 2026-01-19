# Code Style (Conventions)

이 문서는 전역 코드 컨벤션의 상세 규칙을 정의합니다.
요약 규칙은 루트 AGENTS.md에, 자동 적용 규칙은 .claude/rules에 둡니다.

## 1. Naming
- 변수/함수: camelCase (또는 조직 표준)
- 클래스/타입: PascalCase
- 상수: SCREAMING_SNAKE_CASE
- 파일/폴더: kebab-case

## 2. Formatting
- Formatter가 단일 진실 (예: Prettier/Black)
- 들여쓰기/따옴표/세미콜론은 도구 설정을 따른다

## 3. Imports
- 외부 → 내부(shared) → 상대경로 순
- 순환 의존 방지

## 4. Type Safety
- 타입 오류 억제 금지 (as any / ts-ignore)
- Strict 모드 유지

## 5. Testing
- 테스트 파일 네이밍/위치 규칙
- 커버리지 기준 (프로젝트별)
