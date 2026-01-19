# UI 공통 가이드라인 (General)

이 문서는 대시보드/일정/메일 등 다양한 화면에서 공통적으로 일관된 시각 언어와 상호작용 규칙을 제공하기 위한 일반 가이드입니다.
특정 제품/프레임워크에 종속되지 않으며, 팀/프로젝트에 맞게 조정할 수 있습니다.

---

## 0. 디자인 원칙 (Principles)

1) **정보 밀도는 유지하되, 구획(그룹)을 명확히**
- 카드/섹션 단위로 정보를 분리한다.
- 헤더–바디–푸터 구조를 유지한다.

2) **Primary 액션은 화면당 1개만 강하게**
- 화면 내 주요 CTA는 1개만 Primary로 강조한다.
- 나머지는 Secondary/Ghost로 위계를 낮춘다.

3) **가독성 우선**
- 본문/리스트 핵심 텍스트는 충분한 대비(AA 이상)를 확보한다.
- 회색 텍스트 남발을 피한다.

4) **상태는 색만으로 표현하지 않는다**
- 선택/활성 상태는 배경/보더/아이콘/텍스트 굵기 중 최소 2개 이상을 결합한다.

---

## 1. 디자인 토큰 (Design Tokens)

> 아래 토큰은 예시이며, 팀의 브랜드/테마에 맞게 값은 조정한다.

### 1.1 Color Palette (CSS 변수 예시)

```css
:root {
  /* Base */
  --bg: #F6F8FC;
  --surface: #FFFFFF;
  --surface-2: #F2F5FB;
  --border: #E5E9F2;
  --border-strong: #D5DBE8;

  /* Text */
  --text-1: #111827;
  --text-2: #374151;
  --text-3: #6B7280;
  --text-inverse: #FFFFFF;

  /* Primary */
  --primary-500: #2563EB;
  --primary-600: #1D4ED8;
  --primary-50:  #EFF6FF;
  --primary-100: #DBEAFE;

  /* Status */
  --success-500: #16A34A;
  --success-50:  #ECFDF5;
  --warning-500: #D97706;
  --warning-50:  #FFFBEB;
  --danger-500:  #DC2626;
  --danger-50:   #FEF2F2;

  /* Interaction */
  --focus: #60A5FA;
  --overlay: rgba(17, 24, 39, 0.45);

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(17, 24, 39, 0.06);
  --shadow-md: 0 6px 20px rgba(17, 24, 39, 0.08);

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* Spacing scale */
  --sp-2:  8px;
  --sp-3:  12px;
  --sp-4:  16px;
  --sp-5:  20px;
  --sp-6:  24px;
  --sp-8:  32px;
}
```

**컬러 사용 규칙**
- Primary는 CTA, 선택 상태, 링크(기본)에만 사용한다.
- 배경 강조(연톤)는 선택/현재 위치/요약 카드에만 제한한다.
- 상태 색상은 라벨/아이콘 중심으로 사용하며, 큰 면적 배경은 50톤을 사용한다.
- 보더는 기본 `--border`, 강조는 `--border-strong` 또는 `--primary-100`을 사용한다.

### 1.2 타이포그래피 (Typography)

**폰트**
- 기본: 한글 가독성이 좋은 산세리프.
- 숫자/테이블: `tabular-nums` 활성 권장.

**Type Scale (권장)**
- Page Title: 20–22px / 600
- Section Title(카드 헤더): 14–16px / 600
- Body: 13–14px / 400–500
- Meta/Label: 12px / 400
- Line-height: 1.4–1.6

---

## 2. 레이아웃 & 그리드

### 2.1 Global Layout
- 상단 앱바 + 좌측 네비 + 메인 콘텐츠 1열 구조를 기본으로 한다.
- 대시보드는 카드 기반 2~3열 레이아웃을 사용하되, 카드 최소 폭 320px 확보.

### 2.2 Spacing
- 섹션 간: 24–32px
- 카드 내부 패딩: 16–20px
- 리스트 row 높이: 44–52px (메일 리스트는 48px 권장)
- 폼 컨트롤 간격: 12–16px

---

## 3. 컴포넌트 가이드

### 3.1 버튼 (Buttons)
- Primary: 화면당 1개 핵심 CTA
- Secondary: 보조 행동
- Ghost: 아이콘/툴바
- Danger: 삭제/영구 작업

**규칙**
- 아이콘-only 버튼은 최소 터치 영역 32x32 이상
- 로딩 시 레이아웃 점프 금지(폭 고정)

### 3.2 카드 (Cards)
- 헤더–바디–푸터 구조 통일
- 섀도우는 기본 약하게, hover 시 강화

### 3.3 리스트/테이블
- 헤더/툴바 고정 영역 분리(필터/검색/정렬)
- Hover/Selected 상태 일관성

### 3.4 입력/폼
- 포커스 링 제공
- 오류는 색상 + 텍스트 메시지 동시 제공

---

## 4. 상태 & 인터랙션 (States)

- Hover: 배경/톤 변화
- Focus: `:focus-visible` 링 제공
- Disabled: 시각/기능 동시 비활성
- Empty: 다음 행동 CTA 포함
- Loading: 스켈레톤 또는 스피너(레이아웃 점프 금지)

---

## 5. 접근성 (Accessibility)

- 텍스트 대비: WCAG AA 이상 권장(본문 4.5:1)
- 링크: 색상 외에 밑줄 또는 hover underline
- 클릭/터치 타겟: 최소 32px, 가능하면 40px
