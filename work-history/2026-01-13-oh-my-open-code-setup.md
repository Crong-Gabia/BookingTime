## 수행 날짜
- 2026-01-13

## 수행 작업
- `opencode`가 시스템에 설치되지 않아 `curl -fsSL https://opencode.ai/install | bash`로 OpenCode 1.1.15를 설치함.
- `bun`이 없어 `curl -fsSL https://bun.sh/install | bash`로 Bun을 설치하고, 해당 환경을 로드하여 `bunx oh-my-opencode install --no-tui --claude=no --chatgpt=yes --gemini=no`를 실행해서 Oh My Open Code 플러그인을 설정함.
- 설치 후 `opencode --version`과 `~/.config/opencode/opencode.json`을 확인하여 버전과 `oh-my-opencode` 플러그인 포함 여부를 검증함.

## 의사결정/이슈
- `npm install -g opencode`가 E404가 발생해 공식 설치 스크립트를 사용하기로 결정함.

## 해결 방법
- 공식 `curl ... | bash` 스크립트를 사용해 OpenCode 및 Bun을 설치하고, Oh My Open Code 설치를 위한 `bunx`를 실행함.

## 다음 단계
- `opencode auth login`을 실행해 OpenAI (ChatGPT Plus/Pro) 인증을 완료하고, 필요한 경우 다른 공급자 추가 설정을 이어가야 함.

## 추가 작업 (2026-01-13 오전)
- `opencode auth login` 실행 시 회사 네트워크 환경에서 `self signed certificate in certificate chain` SSL 오류 발생
- AGENTS.md의 Troubleshooting 섹션에 OpenCode 인증 SSL 오류 해결 방법 추가
  - 임시 해결: `NODE_TLS_REJECT_UNAUTHORIZED=0 opencode auth login`
  - 영구적 해결: `NODE_EXTRA_CA_CERTS` 환경 변수로 회사 CA 인증서 지정
  - 대안: IT팀에 프록시/방화벽 설정 요청
- 로그 분석: `~/.local/share/opencode/log/2026-01-13T003241.log`에서 SSL 오류 확인됨
