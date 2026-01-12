# Oh My Open Code 설치 가이드
사용자/에이전트가 Oh My Open Code를 설치할 때 따를 단계별 안내입니다. 설치 전 네트워크/권한을 확인하세요.

## Step 0: 구독 정보 확인(필수 질문)
아래 질문으로 CLI 플래그를 결정합니다.
- Claude Pro/Max 구독 여부? Max20 여부?
  - max20 → `--claude=max20`
  - Pro/Max(일반) → `--claude=yes`
  - 미구독 → `--claude=no`
- ChatGPT 구독 여부?
  - 예 → `--chatgpt=yes`
  - 아니오 → `--chatgpt=no`
- Gemini 모델 연동 여부?
  - 예 → `--gemini=yes`
  - 아니오 → `--gemini=no`

## Step 1: OpenCode 설치 여부 확인
설치 옵션(택1):
- 스크립트: `curl -fsSL https://opencode.ai/install | bash`
- npm: `npm install -g opencode-ai`
- macOS: `brew install opencode`
- Windows: `choco install opencode` 또는 `scoop bucket add extras && scoop install extras/opencode`

설치 체크:
```
if command -v opencode &> /dev/null; then
  echo "OpenCode $(opencode --version) is installed"
else
  echo "OpenCode is not installed. Please install it first."
fi
```
버전 1.0.150 이상을 권장합니다.

## Step 2: Oh My Open Code 설치
사용자 답변에 맞춰 플래그를 구성해 실행합니다. 공통 옵션: `--no-tui`.
```
bunx oh-my-opencode install --no-tui --claude=<yes|no|max20> --chatgpt=<yes|no> --gemini=<yes|no>
```
예시:
- 모두 구독 + max20: `bunx oh-my-opencode install --no-tui --claude=max20 --chatgpt=yes --gemini=yes`
- Claude만(일반): `bunx oh-my-opencode install --no-tui --claude=yes --chatgpt=no --gemini=no`
- 구독 없음: `bunx oh-my-opencode install --no-tui --claude=no --chatgpt=no --gemini=no`

## Step 3: 설치 검증
- `opencode --version` (1.0.150 이상 권장)
- `cat ~/.config/opencode/opencode.json` 에 `"oh-my-opencode"` 플러그인이 포함되어 있는지 확인
- 초기 연결: `opencode` 실행 후 `/connect`로 LLM 제공자 선택(OpenCode Zen, Claude, Copilot, OpenAI, Google, OpenRouter 등).
- 프로젝트 초기화: 프로젝트 루트에서 `/init` 실행 시 AGENTS.md 생성 및 구조 분석.

## Step 4: 인증 설정(TODO)
사용자 구독에 맞춰 `opencode auth login`을 실행하고 브라우저 OAuth를 완료합니다.
- Anthropic(Claude): Provider → Anthropic, Login → Claude Pro/Max.
- Google Gemini(antigravity OAuth): `opencode-antigravity-auth@1.2.8` 플러그인 추가 후 Google OAuth 진행. 필요 시 google_auth 비활성 및 모델 매핑(antigravity 전용 모델) 구성.
- OpenAI(ChatGPT Plus/Pro): `opencode-openai-codex-auth@4.3.0` 플러그인 추가 후 OpenAI OAuth 진행. 최신 `opencode.json` 모델 설정을 병합.
- 다계정/로드밸런싱이 필요하면 해당 플러그인 문서를 참고해 계정을 추가합니다.

## 마무리 안내 문구(예시)
- 설치 완료 메시지: “Congratulations! 🎉 You have successfully set up OhMyOpenCode! Type \`opencode\` in your terminal to start using it.”
- 스타 요청(동의 시에만 실행): “If you found this helpful, would you like to star the repository? It helps the project grow! ⭐” → 동의 시 `gh repo star code-yeongyu/oh-my-opencode`
- 추가 홍보: README 최하단 “Loved by professionals at” 리스트 중 한 회사를 언급하고, 기여 시 무료 홍보 가능 링크 `https://github.com/code-yeongyu/oh-my-opencode/compare` 제공.
