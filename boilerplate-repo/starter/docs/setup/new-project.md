# 새 프로젝트 생성 절차 (Non-Developer Friendly)

이 문서는 **비개발자 환경에서도 한 번에 진행 가능한** 새 프로젝트 생성 절차를 제공합니다.

## 0) 준비물
- GitHub 계정
- 기본 터미널 사용 가능
- 인터넷 연결

---

## 1) 새 레포 생성 (템플릿 사용)

1. 이 보일러플레이트 레포를 GitHub에서 **Use this template**로 새 레포 생성
2. 레포 이름/설명 입력 후 생성

---

## 2) 로컬에 클론

```bash
git clone <새레포 URL>
cd <새레포 폴더>
```

---

## 3) OpenCode 설치/인증

다음 문서를 따라 설치 및 인증:
- `docs/setup/oh-my-open-code-setup.md`

설치가 끝나면:
```bash
opencode
```

---

## 4) 프로젝트 초기화

OpenCode 실행 후:
```
/init
```

- AGENTS.md 및 기본 구조 확인
- 프로젝트 상황에 맞게 AGENTS.md와 docs/conventions 수정

---

## 5) 기본 설정 체크리스트

- [ ] AGENTS.md: 전역 규칙/권한/보고 포맷 확인
- [ ] docs/conventions: 코드/DB 컨벤션 업데이트
- [ ] templates: backend/frontend AGENTS 템플릿 적용 여부 결정
- [ ] .claude/rules: 조건부 규칙 사용 여부 결정 (사용하지 않으면 무시 가능)

---

## 6) 운영 시작

- 첫 작업 브랜치 생성
- PR/리뷰 프로세스 시작

---

## FAQ

Q. Claude/ChatGPT/Gemini 구독이 없으면?
- 설치 시 `--claude=no --chatgpt=no --gemini=no` 설정 가능

Q. .claude/rules는 꼭 필요한가?
- 아니오. 파일 패턴 기반 자동 규칙용이며 사용하지 않아도 됨
