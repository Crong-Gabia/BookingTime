# OpenCode / Oh My Open Code 설치 안내
네트워크가 허용되는 환경에서 아래 순서대로 설치·초기화를 진행하세요.

## 준비 사항
- Node.js LTS, pnpm 설치.
- bun(또는 bunx) 설치 필요 시: `curl -fsSL https://bun.sh/install | bash` 또는 `npm install -g bun`.

## OpenCode 설치 옵션
- 스크립트: `curl -fsSL https://opencode.ai/install | bash`
- npm: `npm install -g opencode-ai`
- macOS Homebrew: `brew install opencode`
- Windows: `choco install opencode` 또는 `scoop bucket add extras && scoop install extras/opencode`

설치 확인: `opencode --version` (1.0.150 이상 권장).

## Oh My Open Code 설치
1) 구독 정보에 따라 플래그 결정  
   - Claude: `--claude=no|yes|max20`  
   - ChatGPT: `--chatgpt=no|yes`  
   - Gemini: `--gemini=no|yes`
2) 설치 실행  
```
bunx oh-my-opencode install --no-tui --claude=<...> --chatgpt=<...> --gemini=<...>
```
3) 플러그인 확인: `cat ~/.config/opencode/opencode.json`에 `"oh-my-opencode"`가 포함되는지 확인.

## 초기 설정/사용
- 제공자 연결: `opencode` 실행 후 `/connect` → OpenCode Zen/Claude/Copilot/OpenAI/Gemini/OpenRouter 등 선택.
- 프로젝트 초기화: 프로젝트 루트에서 `/init` 실행(AGENTS.md 생성 및 구조 분석).
- 세션 제어: `/undo`, `/redo`, `/models`, `/sessions`, `/compact`, `/export` 등 활용.
- 권한 설정: 루트 `opencode.json` 또는 `~/.config/opencode/config.json`에 permission 정책(`allow/ask/deny`) 지정.

## 레포 통합 팁
- 도구 설정 파일은 루트에, 사용자별 비공개 값은 `.env.local`에 분리.
- CI/CD에서 캐시·lockfile 일관성 유지.
- OpenCode/Oh My Open Code 관련 스크립트는 `scripts/` 하위에 추가 가능.
