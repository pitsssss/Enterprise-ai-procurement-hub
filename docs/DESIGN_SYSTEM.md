# Synthetix Sourcing — Design System Documentation
### Design Tokens, Component Engineering & Architecture

---

## 1. Design Tokens Specification

The design tokens are declared as CSS variables in `src/index.css` and bound through Tailwind CSS v4 layers.

### 1.1 Color Palette
```css
/* Light Theme: Warm Canvas & Deep Forest */
--color-primary: #173e38;          /* Deep Forest Brand Base */
--color-primary-hover: #12312c;
--color-primary-subtle: #edf4f2;
--color-accent: #c17c43;           /* Muted Copper Highlighting */
--color-accent-hover: #a86731;
--color-bg-canvas: #f6f5f1;        /* Warm Canvas Global Base */
--color-bg-surface: #ffffff;       /* Cards, Tables, Drawers */
--color-bg-subtle: #faf9f6;        /* Table strips, input backdrops */
--color-text-ink: #17272a;         /* Deep Ink Headings & Figures */
--color-text-body: #34484b;        /* Readable Primary Paragraphs */
--color-text-muted: #647a7b;       /* Metadata, captions, timestamps */
--color-border-subtle: #dde3e1;    /* Architectural Grid Dividers */

/* Dark Theme: Deep Forest Night */
--color-bg-canvas: #0b1614;
--color-bg-surface: #11211e;
--color-bg-subtle: #162b27;
--color-text-ink: #ebf1f0;
--color-text-muted: #8ba39f;
--color-border-subtle: #24423d;
--color-primary: #2e7a6f;
--color-accent: #d48d55;
```

### 1.2 Spacing & Touch Ergonomics
- **Base Grid**: $4\text{px}$ geometric unit (`p-1` = $4\text{px}$, `p-2` = $8\text{px}$, `p-3` = $12\text{px}$, `p-4` = $16\text{px}$, `p-6` = $24\text{px}$).
- **Touch Target Minimum**: Every interactive element on mobile (buttons, tabs, inputs, icon triggers) satisfies $\ge 44\text{px} \times 44\text{px}$ touch target rules.
- **Safe Area Insets**: Handled via `.pb-safe` (`padding-bottom: max(1rem, env(safe-area-inset-bottom))`) for modern bezel-less devices.

### 1.3 Border Radii
- Structural Cards & Modals: `rounded-xl` ($12\text{px}$)
- Action Buttons & Inputs: `rounded-lg` ($8\text{px}$)
- Status Badges & Chips: `rounded-md` ($6\text{px}$)
- Floating AI Triggers & Avatars: `rounded-full`

---

## 2. Reusable Component Library (`src/components/ui/`)

### 2.1 Button (`Button.tsx`)
- **Variants**:
  - `primary`: Deep Forest (`#173E38` / `#2E7A6F` in dark) with subtle drop elevation.
  - `accent`: Muted Copper (`#C17C43` / `#D48D55` in dark) for strategic award confirmations.
  - `secondary`: Clean bordered surface (`bg-white` / `#162B27` in dark, `border-[#DDE3E1]`).
  - `ghost`: Transparent with hover tint for low-emphasis table row tools.
  - `danger`: High-priority fiduciary stop action (`#A22424`).
- **States**: `disabled`, `isLoading` with accessible SVG spinner, `leftIcon`, `rightIcon`, `fullWidth`.

### 2.2 Badge (`Badge.tsx`)
- Compact, semantic status pill with optional animated pulsing or static indicator dot.
- **Variants**: `default`, `primary`, `accent`, `success`, `warning`, `danger`, `info`.

### 2.3 Card (`Card.tsx`)
- Architectural container enforcing crisp 1px structural boundaries (`#DDE3E1` / `#24423D`).
- Variants: `surface` (pure white / `#11211E`), `subtle` (`#FAF9F6`), and `outline`.
- Supports `interactive` hover elevations for clickable table cards.

### 2.4 KpiMetric (`KpiMetric.tsx`)
- Standardized executive KPI presentation block.
- Always renders values in `tabular-nums` with explicit comparison baselines and trend indicators.

### 2.5 Input & Select (`Input.tsx`, `Select.tsx`)
- Form components with built-in label, helper text, error text, prefix/suffix text, and icon slots.
- Focus states employ high-contrast Deep Forest focus rings without fuzzy glow effects.

### 2.6 Tabs (`Tabs.tsx`)
- Two variants: `underline` (classic enterprise tab strip with active bottom indicator) and `pills` (compact horizontal scrollable filter strip).

### 2.7 EmptyState & Skeleton (`EmptyState.tsx`, `Skeleton.tsx`)
- High-trust fallback views for 0-result filter queries and asynchronous data loading.

### 2.8 ConfirmDialog (`ConfirmDialog.tsx`)
- Accessible modal dialog for destructive or high-risk actions (e.g. cancelling an RFQ or rejecting a contract proposal). Traps focus and responds to Escape key.

---

## 3. Responsive Breakpoint Architecture

| Breakpoint | Target Width | Layout Behavior | Navigation System |
| :--- | :--- | :--- | :--- |
| **Mobile S** | $320\text{px} - 360\text{px}$ | Single column, full-width cards, compact headers | Top app bar ($56\text{px}$) + Bottom Nav ($56\text{px}$) |
| **Mobile M/L** | $375\text{px} - 430\text{px}$ | Stacked KPI grids ($2 \times 2$), expandable SKU drawers | Top app bar + Bottom Nav + Floating AI FAB |
| **Tablet** | $768\text{px} - 1023\text{px}$ | Desktop sidebar, $2 \times 2$ KPI grid, responsive table | Collapsible Sidebar + Standard Top Header |
| **Desktop** | $1024\text{px} - 1439\text{px}$ | Full high-density tables, 4-column KPI row | Persistent Sidebar ($256\text{px}$) + Header + Main |
| **Wide Workstation** | $1440\text{px}+$ | Max-width content boundaries ($1280\text{px}$) centered | High data density with split-screen audit panes |

---

## 4. Accessibility Compliance (WCAG 2.2 AA)

- **Color Contrast**: All primary text achieves $\ge 8.2:1$ contrast against surfaces (exceeding the $4.5:1$ AA requirement).
- **Tabular Figures**: Financial data tables prevent vertical alignment distortion using `font-variant-numeric: tabular-nums`.
- **Keyboard Trapping**: Modals and drawers listen for `Escape` and isolate tab loops.
- **Form Controls**: Every input control features explicit `id`, `htmlFor`, and `aria-label` bindings.
- **Screen Reader Readiness**: Semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<table role="table">`, `<button>`) replace generic `<div>` click listeners.
