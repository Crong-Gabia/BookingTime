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

```css
body {
  font-family: system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  color: var(--text-1);
  background: var(--bg);
  font-feature-settings: "tnum";
}
```

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
**종류**
- Primary: 화면당 1개 핵심 CTA
- Secondary: 보조 행동(필터, 설정, 서브 액션)
- Ghost: 아이콘 버튼/툴바 버튼/덜 중요한 행동
- Danger: 삭제/영구 작업

**사이즈**
- L: 높이 40px, 패딩 14–16px, 폰트 14px
- M: 높이 36px, 패딩 12–14px, 폰트 13px
- S: 높이 32px, 패딩 10–12px, 폰트 12px

```css
.btn {
  height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary-500);
  color: var(--text-inverse);
}
.btn-primary:hover { background: var(--primary-600); }

.btn-secondary {
  background: var(--surface);
  border-color: var(--border);
  color: var(--text-1);
}
.btn-secondary:hover { background: var(--surface-2); }

.btn-ghost {
  background: transparent;
  color: var(--text-2);
}
.btn-ghost:hover { background: var(--surface-2); }

.btn:focus-visible {
  outline: 3px solid rgba(96,165,250,0.45);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
```

**버튼 규칙**
- 좌측 네비 상단의 “+ 추가” 버튼은 항상 Primary.
- 아이콘-only 버튼은 최소 터치 영역 32x32 이상.
- 로딩 시 텍스트 유지 + 스피너 표시(폭 고정)로 레이아웃 점프 방지.

### 3.2 카드 (Cards)
- 헤더–바디–푸터 구조 통일
- 배경: `--surface`
- 보더: `--border`
- 라운드: 12–16px
- 섀도우: 기본 `--shadow-sm`, hover 시 `--shadow-md`

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.card-header {
  padding: 14px 16px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title { font-size: 14px; font-weight: 700; color: var(--text-1); }
.card-body { padding: 0 16px 16px; }
.card-footer { padding: 12px 16px; border-top: 1px solid var(--border); }
```

**카드 규칙**
- 카드 타이틀은 동일한 베이스라인(좌측 정렬).
- 카드 내부 리스트는 row-divider(1px) 또는 충분한 row spacing 중 하나로 통일.
- 강조 카드 배경은 상태색 50톤만 사용.

### 3.3 사이드바 (Sidebar)
- 그룹은 아이콘 + 라벨로 구성
- 활성 상태: 배경 + 좌측 인디케이터 바(2–3px) 또는 아이콘 색 변경
- 텍스트 굵기 600 이상

```css
.nav-item {
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-2);
}
.nav-item:hover { background: var(--surface-2); }
.nav-item.active {
  background: var(--primary-50);
  color: var(--primary-600);
  font-weight: 700;
}
```

### 3.4 리스트/테이블
- 헤더/툴바 고정 영역을 분리(필터, 검색, 정렬)
- Row 높이 48px 권장
- Hover: `--surface-2`
- 선택: `--primary-50` + 체크박스

```css
.row {
  height: 48px;
  padding: 0 12px;
  display: grid;
  align-items: center;
  border-bottom: 1px solid var(--border);
}
.row:hover { background: var(--surface-2); }
.row.selected { background: var(--primary-50); }
```

**메일/리스트 특화**
- 제목(Subject)은 1줄 말줄임, 메타는 `--text-3`
- 읽음/안읽음은 아이콘/굵기로 구분(색만으로 구분 금지)

### 3.5 탭 (Tabs)
- 상단 1줄 + 하단 2px 인디케이터
- 활성: `--primary-600`, 비활성: `--text-3`

```css
.tab { padding: 10px 12px; color: var(--text-3); font-weight: 600; }
.tab.active { color: var(--primary-600); border-bottom: 2px solid var(--primary-600); }
```

### 3.6 입력/폼 (Forms)
- 입력 높이 36px
- 보더: `--border`
- 포커스: `--focus` 링
- placeholder는 `--text-3`

```css
.input {
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-1);
}
.input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 4px rgba(96,165,250,0.25);
  outline: none;
}
```

### 3.7 배지/상태 라벨 (Badges)
- 숫자 카운트는 과도한 강조 금지
- 기본 배지: 연회색 바탕 + 진한 텍스트
- 중요/알림만 Primary/Status 사용

```css
.badge {
  height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text-2);
  font-size: 12px;
  display: inline-flex;
  align-items: center;
}
.badge-primary { background: var(--primary-100); color: var(--primary-600); }
.badge-danger  { background: var(--danger-50);  color: var(--danger-500); }
```

### 3.8 캘린더(월간) UI
- 월간 셀은 충분한 여백(상단 날짜 영역 분리)
- 이벤트 바는 같은 카테고리 색 유지
- 텍스트는 1줄 말줄임
- 너무 연한 색만 사용하지 말고 대비 확보

**권장**
- 이벤트 배경: 50톤 (예: `--primary-50`)
- 이벤트 텍스트: `--text-1` 또는 `--primary-600`

### 3.9 아이콘 (Iconography)
- 기본 16px, 리스트/툴바는 18px까지 허용
- 라인 아이콘은 stroke 1.5–2px
- 아이콘 색은 기본 `--text-3`, 활성 `--primary-600`

---

## 4. 상태 & 인터랙션 (States)

**Hover**
- 배경 강조: `--surface-2`
- Primary hover: `--primary-600`

**Focus (키보드 접근성)**
- 모든 인터랙티브 요소에 `:focus-visible` 링 제공
- 최소 2px 이상, 색상+외곽선 조합

**Disabled**
- opacity 0.45 + cursor not-allowed
- 클릭 불가 + 시각적 비활성 동시 처리

**Empty / Loading**
- Empty: “데이터 없음” + 다음 행동 CTA
- Loading: 스켈레톤 또는 스피너 (레이아웃 점프 금지)

---

## 5. 접근성 (Accessibility)

- 텍스트 대비: WCAG AA 이상(본문 4.5:1 권장)
- 링크: 색상 외에 밑줄 또는 hover underline 제공
- 클릭/터치 타겟: 최소 32px, 가능하면 40px
- 폼 오류: 색상 + 메시지(텍스트)로 동시 제공

---

## 6. 페이지별 적용 요약

**홈(대시보드)**
- 카드 그리드 2~3열
- 위젯은 “요약 → 상세 이동” 패턴

**일정**
- 좌측 필터 + 메인 월간 뷰
- 이벤트 색상 체계 통일
- 오늘/선택 강조는 50톤 수준

**메일**
- 리스트 가독성 우선: 제목 진하게, 메타는 중간 회색
- 선택/멀티 선택은 체크박스 + 배경으로 명확히
- 상단 검색/필터/정렬 영역 고정

---

## 7. 구현 체크리스트 (QA)

- Primary 버튼은 화면에 1개만 존재하는가?
- 선택 상태가 색상만으로 표현되지 않는가?
- 리스트 row의 hover/selected/focus가 일관적인가?
- 텍스트 대비가 AA 기준을 만족하는가?
- 터치 타겟이 최소 32px 이상인가?
