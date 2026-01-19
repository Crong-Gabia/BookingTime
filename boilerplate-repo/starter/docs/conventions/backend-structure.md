# Backend Directory Structure (Reference)

```
src/                    소스파일이 위치
src/server.ts           앱 구동 entry-point
src/app.ts              express app 정의
src/routes              express 라우팅 설정
src/databases           RDBMS 연결 및 모델 정의
src/models/[model]      모델 정의
src/middlewares         미들웨어(인증 등)
src/repositories        Repository 정의
src/classes             프로젝트에 필요한 라이브러리 정의
src/utils               독립 실행 프로세스 (cron 등)
dist/                   tsc 컴파일 결과
test/                   테스트 코드
package.json            npm 설정
tsconfig.json           TypeScript 컴파일 옵션
.gitignore              Git 제외 설정
.eslintrc               eslint 설정
config.json             전역 설정
.env                    실행 환경 설정
.env.dev                디버깅 환경 설정
```
