# 브랜치 전략 및 관리 가이드라인

## 개요

BookingTime 프로젝트의 브랜치 전략과 관리 규칙을 명확합니다.

---

## 1. 브랜치 전략

### 기준 브랜치
- **main** - 프로덕션 (안정된 릴리스만 병합)
- **develop** - 통합 브랜치 (모든 개발 작업 병합 목표)
- **main에 직접 push 금지**

### 기능 브랜치 패턴
- `feature/<기능명>` - 새 기능 개발 (kebab-case)
- `fix/<기능명>` - 버그 수정 (kebab-case)
- `refactor/<기능명>` - 코드 리팩터링 (kebab-case)
- `docs/<문서-영역>` - 문서 업데이트 (kebab-case)
- `test/<테스트-영역>` - 테스트 관련 (kebab-case)

### 브랜치 명명 규칙
1. **kebab-case 사용**: `feature/ui-components`, `refactor/api-wrapper`
2. **간결하고 명확한 이름**: 15자 이내 권장
3. **동사어 피하기**: korean (예: meeting, not meetying)
4. **상태를 포함하지 않기**: `feature/new-feature`, `feature/new feature` (X)
5. **동작어형 사용**: 명령형 (`create-meeting`, `setup-dev`)

---

## 2. 브랜치 수명주기

```
생성 (New)
  ↓
작업 진행 (Work in Progress)
  ↓
완료/머지 (Completed/Merged)
  ↓
보관 (Archived/Stale)
  ↓
삭제 (Deleted)
```

### 브랜치 상태 정의
- **New**: 방금 생성된 브랜치, 아직 커밋 없음
- **Work in Progress**: 활발징 개발 중, 커밋 있는 상태
- **Completed**: 기능 구현 완료, 테스트 통과, 병합됨
- **Merged**: 다른 브랜치에 병합됨 (소스 브랜치는 유지됨)
- **Archived**: 더 이상 필요하지 않는 오래된 브랜치
- **Stale**: 14일 이상 커밋이 없는 브랜치 (보존 필요 확인)

---

## 3. 브랜치 생성 및 작업 흐름

### Step 1: 기능 브랜치 생성
```bash
# 1. 최신 develop 브랜치 확인 및 로컬 동기화
git checkout develop
git pull origin develop

# 2. 기능 브랜치 생성
git checkout -b feature/<기능명>

# 3. 작업 진행
# ... 개발 및 커밋 ...

# 4. 완료 후 origin에 push
git push -u origin feature/<기능명>
```

### Step 2: 작업 중 주기적 병합 (권장하지 않음)
```bash
# develop에 변경사항이 있을 경우
git checkout develop
git pull origin develop

# feature 브랜치에서 develop로 rebase
git checkout feature/<기능명>
git rebase develop

# 충돌 해결 후 push
git push -u origin feature/<기능명> --force-with-lease
```

**주의**: develop 브랜치는 다른 팀원들이 작업할 수 있으므로 주기적 병합은 추천하지 않습니다.

### Step 3: 병합 요청 (Pull Request)
1. 기능 브랜치 작업 완료 확인
2. develop 브랜치로 PR 생성: `gh pr create --base develop`
3. 팀원들에게 리뷰 요청
4. 승인 후 병합: Squash and merge 권장
5. 병합 후 로컬 develop 동기화

---

## 4. 브랜치 삭제

### 보관(Archive)
```bash
# 1. 병합된 브랜치 삭제 (소스는 유지됨)
git branch -d <브랜치명>

# 2. 원격 브랜치도 삭제
git push origin --delete <브랜치명>
```

### 완전 삭제
```bash
# 1. 소스까지 삭제 (권장하지 않음)
git branch -D <브랜치명>

# 2. 원격 삭제
git push origin --delete <브랜치명>
```

---

## 5. Pull Request 관리

### PR 생성 가이드라인
```bash
# PR 생성
gh pr create --base develop \
  --title "feat: 간단한 설명" \
  --body "$(cat <<'EOF'
## 변경 내용

- 변경 내용 요약

## 검증 방법

- 검증 단계 1
- 검증 단계 2

## 관련 이슈

- #issueNumber
EOF
)"
```

### PR 템플릿
```markdown
## 변경 내용

### 설명
1줄 요약

### 변경 내용
- [ ] 변경사항 1
- [ ] 변경사항 2

### 검증 방법
1. [ ] 스크린샷 (선택사항)
2. [ ] 테스트 결과

### 관련 이슈
- Closes #issueNumber
```

---

## 6. 충돌 해결

### Rebase 충돌
```bash
# 1. 작업 저장
git stash

# 2. develop 가져오기
git fetch origin develop

# 3. rebase 시도
git rebase origin/develop

# 4. 충돌 발생 시: 수동 해결
git status  # 충돌 파일 확인

# 5. 작업 복구
git stash pop
```

### Merge 충돌
```bash
# 1. 변경사항 확인
git status

# 2. develop 머지 옮기기
git merge develop

# 3. 충돌 해결
git mergetool
```

---

## 7. Git 명령어 참조

### 브랜치 관리
- `git branch` - 브랜치 목록
- `git checkout -b <name>` - 새 브랜치 생성
- `git switch <name>` - 브랜치 전환
- `git merge <branch>` - 브랜치 병합
- `git branch -d <name>` - 브랜치 삭제
- `git branch -D <name>` - 병합된 브랜치 삭제 (소스도 삭제)

### 히스토리/스태시
- `git log --oneline -10` - 최근 10개 커밋
- `git reflog` - 브랜치/HEAD 변경 히스토리
- `git stash` - 임시 저장
- `git stash list` - 스태시 목록
- `git stash pop/drop` - 작업 복구/삭제

### 원격 동기화
- `git fetch origin` - 원격 변경사항 가져오기
- `git push` - 로컬 커밋 원격으로 전송
- `git pull` - 원격에서 가져오기 + 병합

---

## 8. Best Practices

### 커밋 메시지
- **Conventional Commits** 준수
  - `feat:` - 새 기능
  - `fix:` - 버그 수정
  - `refactor:` - 코드 리팩터링
  - `docs:` - 문서 변경
  - `test:` - 테스트 코드
  - `chore:` - 빌드/설정 관련

- **형식**: `<type>: <간단한 설명>`
- **본문**: 상세 설명은 50자 내외로 작성

### 커밋 빈도
- 작은 단위 커밋 권장 (한 가지 변경당 하나 커밋)
- 기능 단위로 나누기 (UI 컴포넌트, API, 페이지)
- 테스트는 별도 커밋할 수 있음

### Code Review
- 모든 PR은 최소 1명 리뷰어 승인 필요
- 주요 변경사항은 팀원들과 논의하며 결정
- 안전하지 않은 변경사항은 되도록 피하기

---

## 9. 문제 해결 시나리오

### API 서버 실행 안 함
1. Docker 컨테이너 상태 확인: `docker-compose ps`
2. 포트 사용 중인지 확인: `lsof -i :3000`
3. 로그 확인: `docker-compose logs <service>`
4. 환경변수 확인: `.env.local` 파일 존재 여부

### 빌드 오류
1. `pnpm run build` 로 빌드 실패 확인
2. TypeScript 오류 로그 분석
3. 의존성 확인: `pnpm install`

### 병합 충돌
1. `git status`로 변경사항 확인
2. `git mergetool` 사용
3. 충돌 파일 직접 해결

### PR 생성 실패
1. GitHub CLI 인증 확인: `gh auth status`
2. 원격 권한 확인: repository settings

---

## 10. 참고 링크

### 공식 문서
- [Git Branching](https://git-scm.com/book/zh/v2/Git-Branching-Basic-Commands)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI](https://cli.github.com/manual/)

### 프로젝트 내부 문서
- `AGENTS.md` - 개발 가이드라인
- `README.md` - 프로젝트 개요
- `work-history/` - 작업 기록

---

## 부록 A: 브랜치 명명 규칙 상세

### 브랜치 접두사
- `feature/` - 기능 개발
- `fix/` - 버그 수정
- `refactor/` - 코드 리팩터링
- `docs/` - 문서 작성
- `test/` - 테스트 작성/수정
- `hotfix/` - 긴급 버그 수정 (생산용)
- `release/` - 릴리스 생성 (배포 팀 전용)

### 브랜치 명명 예시
- ✅ 올바름: `feature/meeting-optimization`, `fix/auth-bug`, `docs/api-guide`
- ❌ 피할 것: `feature/newFeature`, `new-ui`, `meeting-fix`

### 브랜치 명명 금지 단어
- `feature`, `fix`, `refactor`, `docs`, `test`, `hotfix`, `release` 단독 사용 금지
- 이 단어를 동사어로 사용: `feature/meeting`, `docs/guide`
