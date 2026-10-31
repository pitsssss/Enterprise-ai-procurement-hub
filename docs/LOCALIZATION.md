# Synthetix Sourcing — Enterprise Localization & Bilingual (Arabic / English) Architecture

This document provides a comprehensive architectural specification and operating guide for the internationalization (i18n), Modern Standard Arabic localization (l10n), bidirectional layout (BiDi/RTL), and infrastructure alignment in **Synthetix Sourcing — Enterprise AI Procurement Hub**.

---

## 1. Architectural Overview & Critical Preflight

Synthetix Sourcing is designed from the ground up to support international multi-enterprise procurement operations with seamless switching between:
- **English (`en`)**: Left-to-Right (`dir="ltr"`), Default typography (`IBM Plex Sans`), standard Western numerical display.
- **Modern Standard Arabic (`ar`)**: Right-to-Left (`dir="rtl"`), Specialized Arabic typography (`IBM Plex Sans Arabic`), domain-authentic enterprise procurement terminology.

### Infrastructure & Authentication Architecture Preflight
A critical audit was conducted to verify the relationship between cloud identifiers:
- **Google Cloud / Firebase Project ID (`disco-spark-w8p5g`)**:
  - Hosts Firebase Authentication, Google OAuth 2.0 Web Client, and identity infrastructure.
  - Generates Firebase ID tokens where JWT issuer is `https://securetoken.google.com/disco-spark-w8p5g` and `aud` is `disco-spark-w8p5g`.
  - Backend server (`server.ts`) validates Bearer tokens against JWKS from `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com` targeting `disco-spark-w8p5g`.
- **Firestore Database Instance (`ai-studio-synthetixsourcin-d4360f16-b72f-4232-9a0f-779ee560ad79`)**:
  - The provisioned named database instance within the Google Cloud project where procurement organizations, RFQs, bids, purchase orders, and immutable audit logs reside.
  - Rules deployed via `fax.DeployRules` enforce tenant isolation, role-based access control, dual sign-off thresholds, and append-only audit tracking on this database instance.
- **Conclusion**: This separation is intentional and follows standard enterprise multi-database provisioning conventions. No infrastructure parameters were disrupted.

---

## 2. Internationalization Principles

1. **Single Responsive Codebase**: No duplicate routes or template branching per language. All views dynamically re-render based on reactive state and directional context.
2. **DOM-Level Synchronization**: Switching languages updates `document.documentElement.lang` (`en` or `ar`), `document.documentElement.dir` (`ltr` or `rtl`), and applies `.font-arabic` on root elements.
3. **Persisted Preference**: Locale is persisted across sessions in `localStorage` under key `synthetix_locale` and synchronized to the user's Firestore profile (`userProfile.language`) upon authentication.
4. **BiDi Text Isolation**: Any mixed-direction data (RFQ identifiers, PO tracking numbers, SKUs, ISO currency symbols, URLs, and email addresses) is isolated using `<bdi dir="ltr">` or isolate Unicode wrappers to prevent corrupt layout punctuation.
5. **Contextual AI Copilot**: The server-side Gemini AI model detects active locale and generates responses directly in Modern Standard Arabic using accurate procurement terms and citations.
6. **Dynamic Error & Toast Localization**: All error handlers (`handleFirestoreError`), toast notifications, dynamic labels, and modal dialogues route through `i18n.t()`.

---

## 3. Directory Structure

```
src/
├── i18n.ts                    # i18next configuration, document sync, and storage persistence
├── lib/
│   ├── formatters.ts          # Locale-aware formatting (Currency, Numbers, Dates, Isolated codes)
│   └── errorHandling.ts       # Localized Firestore error translator with i18n support
├── locales/
│   ├── en.json                # English master translation dictionary (358 keys)
│   └── ar.json                # Modern Standard Arabic translation dictionary (358 keys)
├── components/
│   ├── LanguageSwitcher.tsx   # Dropdown, compact toggle, and segmented selector components
│   ├── Navigation.tsx         # Responsive desktop sidebar & mobile bar with RTL mirroring
│   ├── AiCopilotDrawer.tsx    # Bilingual Gemini Copilot UI with executive Arabic prompts
│   ├── public/                # Public landing page & AuthModal with embedded language switcher
│   ├── modals/                # Create RFQ, Award, and SOX Waiver modals with bilingual workflows
│   └── views/                 # Localized views (Overview, RFQs, Bids, Vendors, POs, Profile, Org)
scripts/
├── verify-translations.ts     # Automated CI script validating 100% key and parameter parity (358 units)
└── test-security-suite.ts     # 14 security & governance compliance tests
```

---

## 4. Directional Layout & Typography

### HTML Entry & Font Stack (`index.html` & `src/index.css`)
Google Fonts loads both `IBM Plex Sans` (Latin) and `IBM Plex Sans Arabic`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

In `src/index.css`:
```css
:root {
  --font-arabic: 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

[lang="ar"],
.font-arabic {
  font-family: var(--font-arabic);
}
```

### Tailwind RTL Classes
Instead of hardcoding physical left/right rules (`ml-4`, `text-left`), components use:
- **Directional modifiers**: `rtl:rotate-180`, `rtl:space-x-reverse`, `rtl:text-right`, `rtl:border-l-0 rtl:border-r-4`.
- **Logical borders and padding**: Flexbox with gap utilities (`gap-3`) automatically reverses in RTL mode.
- **Directional icon flipping**: Direction-indicative glyphs such as Chevrons (`ChevronRight`), back buttons, and arrows are flipped via `rtl:rotate-180`. Symmetrical icons (Search, Bell, Settings, Filter, ShieldCheck) remain unflipped.

---

## 5. BiDi Isolation Standards

Arabic is an RTL language, but numbers, technical identifiers, SKU codes, and email addresses are inherently LTR. If placed in an RTL sentence without isolation, punctuation and hyphens can render incorrectly (e.g., `RFQ-2025-001` becoming `001-2025-RFQ`).

### Standard Component Pattern
Always wrap alphanumeric identifiers in `<bdi>` with `dir="ltr"`:

```tsx
// Pattern A: Inline JSX
<span className="font-mono text-xs font-semibold" dir="ltr">
  <bdi dir="ltr">{rfq.rfqNumber}</bdi>
</span>

// Pattern B: Formatter Utility
import { renderIsolatedCode } from '../lib/formatters';
<span>{renderIsolatedCode(po.poNumber)}</span>
```

### Formatter Helpers (`src/lib/formatters.ts`)
- `formatCurrency(amount, currency = 'USD')`: Formats via `Intl.NumberFormat` respecting current active locale (`en-US` or `ar-SA`).
- `formatNumber(value, options)`: Formats integers and floating values with locale-sensitive thousands separators.
- `formatPercent(value, decimals = 1)`: Formats percentages cleanly.
- `formatDate(date, options)`: Formats dates with Gregorian calendar localized in Arabic or English.
- `renderIsolatedCode(code)`: Wraps arbitrary technical codes in `<bdi dir="ltr">`.

---

## 6. Procurement Domain Glossary (Modern Standard Arabic)

| English Term | Modern Standard Arabic | Context & Fiduciary Rationale |
| :--- | :--- | :--- |
| **Strategic Sourcing** | التوريد الاستراتيجي | Formal enterprise terminology for end-to-end procurement. |
| **Request for Quotation (RFQ)** | طلب عروض أسعار (RFQ) | Preserves the acronym in isolation for ERP cross-referencing. |
| **Purchase Order (PO)** | أمر شراء (PO) | Standard commercial designation. |
| **Sole-Source Waiver** | إعفاء المورد الوحيد | Form CS-8 exception justification. |
| **Dual Sign-Off** | التوقيع الثنائي المعتمد | SOX Section 404 segregation of duties requirement. |
| **Vendor Scorecard** | بطاقة تقييم المورد | Multi-criteria vendor evaluation. |
| **Total Cost of Ownership (TCO)** | التكلفة الكلية للملكية | Long-term capital and operational expenditure. |
| **Line Items / SKUs** | بنود التوريد / رموز المنتجات | Bill of materials line items. |
| **Lead Time** | مدة التوريد والتسليم | Time from PO dispatch to warehouse delivery. |
| **Probationary Tier** | الفئة التجريبية / تحت المراقبة | High-risk supplier status requiring escrow or oversight. |
| **Fiduciary Duty** | الواجب الائتماني | Executive expenditure stewardship. |

---

## 7. Automated Translation Verification

Run the CI translation integrity test at any time:
```bash
npm run verify:i18n
```

Verification guarantees:
1. Exact 1-to-1 key parity between `en.json` and `ar.json` (358 translation units).
2. Exact matching of interpolation parameter tokens (e.g. `{{poNumber}}`, `{{rfqNumber}}`, `{{role}}`).
3. Zero untranslated keys or orphaned translations.
