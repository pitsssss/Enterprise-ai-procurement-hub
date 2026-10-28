# Synthetix Sourcing — Enterprise Localization & Bilingual (Arabic / English) Architecture

This document provides a comprehensive architectural specification and operating guide for the internationalization (i18n), Modern Standard Arabic localization (l10n), and bidirectional layout (BiDi/RTL) implementation in **Synthetix Sourcing — Enterprise AI Procurement Hub**.

---

## 1. Architectural Overview

Synthetix Sourcing is designed from the ground up to support international multi-enterprise procurement operations with seamless switching between:
- **English (`en`)**: Left-to-Right (`dir="ltr"`), Default typography (`IBM Plex Sans`), standard Western numerical display.
- **Modern Standard Arabic (`ar`)**: Right-to-Left (`dir="rtl"`), Specialized Arabic typography (`IBM Plex Sans Arabic`), domain-authentic enterprise procurement terminology.

### Key Internationalization Principles
1. **Single Responsive Codebase**: No duplicate routes or template branching per language. All views dynamically re-render based on reactive state and directional context.
2. **DOM-Level Synchronization**: Switching languages updates `document.documentElement.lang` (`en` or `ar`), `document.documentElement.dir` (`ltr` or `rtl`), and toggles `.font-arabic` on root elements.
3. **Persisted Preference**: Locale is persisted across sessions in `localStorage` under key `synthetix_locale` and synchronized to the user's Firestore profile (`userProfile.language`) upon authentication.
4. **BiDi Text Isolation**: Any mixed-direction data (RFQ identifiers, PO tracking numbers, SKUs, ISO currency symbols, URLs, and email addresses) is isolated using `<bdi dir="ltr">` or isolate Unicode wrappers to prevent corrupt layout punctuation.
5. **Contextual AI Copilot**: The server-side Gemini AI model detects active locale and generates responses directly in Modern Standard Arabic using accurate procurement terms and citations.

---

## 2. Directory Structure

```
src/
├── i18n.ts                    # i18next configuration, document sync, and storage persistence
├── lib/
│   └── formatters.ts          # Locale-aware formatting (Currency, Numbers, Dates, Isolated codes)
├── locales/
│   ├── en.json                # English master translation dictionary (319+ keys)
│   └── ar.json                # Modern Standard Arabic translation dictionary (319+ keys)
├── components/
│   ├── LanguageSwitcher.tsx   # Dropdown, compact toggle, and segmented selector components
│   ├── Navigation.tsx         # Responsive desktop sidebar & mobile bar with RTL mirroring
│   ├── AiCopilotDrawer.tsx    # Bilingual Gemini Copilot UI with executive Arabic prompts
│   └── views/                 # Fully localized views (Overview, RFQs, Bids, Vendors, POs, etc.)
scripts/
└── verify-translations.ts     # Automated CI script validating 100% key and parameter parity
```

---

## 3. Directional Layout & Typography

### HTML Entry & Font Stack (`index.html` & `src/index.css`)
Google Fonts loads both `IBM Plex Sans` (Latin) and `IBM Plex Sans Arabic`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
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
- **Directional modifiers**: `rtl:rotate-180`, `rtl:space-x-reverse`, `rtl:text-right`.
- **Logical borders and padding**: Flexbox with gap utilities (`gap-3`) automatically reverses in RTL mode.
- **Directional icon flipping**: Direction-indicative glyphs such as Chevrons (`ChevronRight`), back buttons, and arrows are flipped via `rtl:rotate-180`. Symmetrical icons (Search, Bell, Settings, Filter) remain unflipped.

---

## 4. BiDi Isolation Standards

Arabic is an RTL language, but numbers, technical identifiers, SKU codes, and email addresses are inherently LTR. If placed in an RTL sentence without isolation, punctuation and hyphens can render incorrectly (e.g., `RFQ-2025-001` becoming `001-2025-RFQ`).

### Standard Component Pattern
Always wrap alphanumeric identifiers in `<bdi>` with `dir="ltr"`:

```tsx
import { renderIsolatedCode } from '../lib/formatters';

// Pattern A: Helper JSX
<bdi dir="ltr" className="font-mono text-xs font-semibold text-charcoal">
  {rfq.rfqNumber}
</bdi>

// Pattern B: Formatter Utility
<span>{renderIsolatedCode(po.poNumber)}</span>
```

### Formatter Helpers (`src/lib/formatters.ts`)
- `formatCurrency(amount, currency = 'USD')`: Formats via `Intl.NumberFormat` respecting current active locale (`en-US` or `ar-SA`).
- `formatNumber(value, options)`: Formats integers and floating values with locale-sensitive thousands separators.
- `formatPercent(value, decimals = 1)`: Formats percentages cleanly.
- `formatDate(date, options)`: Formats dates with Gregorian calendar localized in Arabic or English.
- `renderIsolatedCode(code)`: Wraps arbitrary technical codes in `<bdi dir="ltr">`.

---

## 5. Enterprise Modern Standard Arabic Procurement Glossary

To maintain credibility in sovereign and enterprise procurement environments (e.g., GCC governmental tenders, Aramco, Sabic, sovereign wealth funds, and multinationals), translations avoid literal machine phrasing.

| English Term | Enterprise Modern Standard Arabic | Context & Notes |
|:---|:---|:---|
| **RFQ (Request for Quotation)** | **طلب عرض أسعار (RFQ)** | Formal tender solicitation |
| **Purchase Order (PO)** | **أمر شراء (PO)** | Legally binding procurement instrument |
| **Line Item / BOM** | **بند التوريد / قائمة المواد** | Bill of Materials specification |
| **Target Price** | **السعر المستهدف** | Benchmark budget pricing per unit |
| **Sole-Source Waiver (Form CS-8)** | **إعفاء المورد الوحيد (نموذج CS-8)** | Statutory single-source justification |
| **SOX Section 404 Compliance** | **ضوابط الامتثال للمادة 404 (SOX)** | Dual-authorization internal control |
| **Dual-Authorization Threshold** | **حد المصادقة الثنائية الإلزامية** | Expenditure threshold requiring two approvals |
| **TCO (Total Cost of Ownership)** | **إجمالي تكلفة الملكية (TCO)** | Lifecycle acquisition and maintenance cost |
| **ESG Score** | **معيار الحوكمة والاستدامة (ESG)** | Environmental, Social, and Governance metric |
| **Delegated Spending Authority** | **حد الصلاحية المالية المفوضة** | Individual signing power |
| **Lead Time** | **مدة التوريد والتسليم** | Delivery cycle duration |
| **ERP Ledger Synchronization** | **مزامنة سجل دفتر الأستاذ (ERP)** | Automated SAP/Oracle sync |
| **Audit Trail** | **سجل التدقيق غير القابل للتعديل** | Cryptographic/immutable change log |
| **Tier 1 Strategic Vendor** | **مورد استراتيجي - فئة أولى** | Critical enterprise vendor partner |
| **Probationary Vendor** | **مورد تحت الاختبار والمراجعة** | High-risk/monitored vendor |

---

## 6. Server-Side Gemini AI Copilot Integration

The Gemini AI copilot (`server.ts` and `src/services/aiService.ts`) supports bidirectional reasoning:

1. **Locale Detection**: Client passes `{ locale: i18n.language }` in the `/api/gemini/copilot` payload. The server also analyzes prompt text for Arabic Unicode ranges (`[\u0600-\u06FF]`).
2. **System Instruction**: When Arabic is detected, Gemini is instructed:
   > *"You are an elite bilingual enterprise procurement AI assistant. The user is communicating in Modern Standard Arabic (العربية الفصحى). Respond in fluent, authoritative Modern Standard Arabic using precise enterprise procurement terminology (طلبات عروض الأسعار، أوامر الشراء، ضوابط الامتثال للمادة 404، إعفاء المورد الوحيد CS-8). Maintain all numbers, codes, and IDs (e.g. RFQ-2025-001, PO-2025-8841) in exact original format."*
3. **Localized Citations & Prompts**: Suggested chips in the drawer provide native Arabic procurement queries (e.g., *"قارن عروض أسعار توريد أجهزة الخوادم"*, *"حلل استثناءات الامتثال لضوابط SOX"*).
4. **Deterministic Fallback Simulation**: Even when offline or running without external Gemini keys, `aiService.ts` contains simulated Arabic analysis matching real enterprise scenarios.

---

## 7. Quality Assurance & CI Verification

To guarantee that no translation key is inadvertently dropped or out of sync:

### Running Verification
```bash
npm run verify:i18n
```
Or directly:
```bash
npx tsx scripts/verify-translations.ts
```

### Verification Checks
1. **Recursive Deep Key Parity**: Confirms that every key present in `en.json` is defined in `ar.json` and vice-versa.
2. **Interpolation Token Consistency**: Verifies that any variable placeholder (e.g., `{{count}}`, `{{budget}}`, `{{poNumber}}`) matches across both language dictionaries.

---

## 8. Developer Quickstart: Adding New Strings

When introducing a new component or field:

1. Open `src/locales/en.json` and add the new key under the appropriate namespace:
   ```json
   "myFeature": {
     "title": "Contract Lifecycle",
     "signAction": "Execute Signature for {{name}}"
   }
   ```
2. Open `src/locales/ar.json` and add the Arabic equivalent:
   ```json
   "myFeature": {
     "title": "دورة حياة العقود",
     "signAction": "اعتماد التوقيع للمستند {{name}}"
   }
   ```
3. Run the verifier:
   ```bash
   npm run verify:i18n
   ```
4. Consume in your React component:
   ```tsx
   import { useTranslation } from 'react-i18next';

   export function MyComponent({ name }: { name: string }) {
     const { t } = useTranslation();
     return <h2>{t('myFeature.signAction', { name })}</h2>;
   }
   ```
