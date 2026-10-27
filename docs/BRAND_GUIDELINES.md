# Synthetix Sourcing — Brand Guidelines
### Identity Constitution: Precision & Trust

---

## 1. Brand Philosophy & Positioning

Synthetix Sourcing operates at the intersection of **autonomous intelligence** and **strict fiduciary compliance**. In high-stakes enterprise procurement, where capital commitments regularly exceed millions of dollars and single audit infractions carry severe SOX penalties, software cannot look like a consumer chatbot or a neon sci-fi toy.

Our brand identity is grounded in **Precision & Trust**:
- **Calm**: We prioritize high legibility, clean visual resting points, and deliberate whitespace over high-saturation distraction.
- **Intelligent**: Recommendations are presented with statistical transparency, weighted multi-criteria matrices, and verifiable policy citations.
- **Structured**: Information architecture follows strict enterprise hierarchies, high data density, and tabular numerical alignment.
- **Reliable**: Critical procurement actions (such as sole-source exceptions and dual-authorization holds) demand deterministic workflows and explicit approval trails.
- **Sophisticated**: The palette draws inspiration from Swiss editorial architecture and archival fiduciary ledger design.

---

## 2. Brand Mark Architecture

The Synthetix Sourcing brand mark is a bespoke geometric construction representing **multi-vendor proposal alignment, risk assessment matrix, and strategic decision convergence**.

```
         ┌────────────────────────┐
         │      [ 1. SPEC ]       │ Demand & Constraints
         │            \           │
         │             v          │
         │  [ 2. BIDS ] > (●) < [ 3. SOX ] Fiduciary Dual-Custody
         │             ^          │
         │            /           │
         │     [ DECISION NEXUS ] │
         └────────────────────────┘
```

### Visual Metaphor
1. **Calibrated Alignment Field**: An octagonal structural boundary representing institutional policy limits and procurement compliance boundaries.
2. **Three Converging Prisms**:
   - **Top-Left (White/Ink)**: Enterprise requisition demand, SKU specification fidelity, and departmental budget constraints.
   - **Top-Right (Muted Copper `#C17C43`)**: Competitive supplier bids, market intelligence, lead-time differentials, and ESG ratings.
   - **Bottom Anchor (White/Ink)**: Fiduciary trust, dual-custody audit signoffs, and corporate treasury settlement.
3. **The Calibrated Nexus Core**: A centered concentric focal point where diverse variables resolve into an auditable award decision.

### Brand Rules
- **No robot heads, sparkling stars, or glowing purple AI pills.**
- **No drop shadows with high blur or rainbow gradients.**
- **Always maintain a minimum clear space equal to 50% of the mark diameter.**
- **Variants**: Horizontal (Mark + Wordmark + Subtitle), Compact (Mark + Wordmark), and Mark-Only.

---

## 3. Color Token System

The Synthetix palette deliberately pairs organic, archival tones with high-contrast inks.

### Primary Light Theme ("Warm Canvas & Deep Forest")
| Token Name | Hex Code | Role & Usage | Contrast Ratio (WCAG) |
| :--- | :--- | :--- | :--- |
| **Deep Forest** (`--color-primary`) | `#173E38` | Primary brand accent, primary CTA buttons, table headers, key metrics | $10.4:1$ on Canvas (AAA) |
| **Warm Canvas** (`--color-bg-canvas`) | `#F6F5F1` | Global body background, subtle backdrop tint | Base Canvas |
| **Surface White** (`--color-bg-surface`) | `#FFFFFF` | Work cards, data tables, modals, flyout drawers | High contrast surface |
| **Deep Ink** (`--color-text-ink`) | `#17272A` | Primary headings, monetary values, bold titles | $14.2:1$ on Canvas (AAA) |
| **Muted Copper** (`--color-accent`) | `#C17C43` | Strategic highlights, recommended bids, alert indicators | $4.8:1$ on White (AA) |
| **Architectural Border** (`--color-border-subtle`) | `#DDE3E1` | Structural container borders, table dividing rules | Distinct perimeter |
| **Body Ink** (`--color-text-body`) | `#34484B` | Body copy, line-item descriptions, policy annotations | $8.2:1$ on White (AAA) |
| **Muted Steel** (`--color-text-muted`) | `#647A7B` | Secondary captions, timestamps, column labels | $5.1:1$ on White (AA) |

### Complementary Dark Theme ("Deep Forest Night")
| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| **Forest Night Canvas** | `#0B1614` | Deep atmospheric background |
| **Forest Surface** | `#11211E` | Primary card and workspace surface |
| **Elevated Surface** | `#162B27` | Filter chips, table header strips, input containers |
| **Deep Emerald Border** | `#24423D` | Structured container boundaries |
| **Luminous Text** | `#EBF1F0` | High-legibility light text |
| **Copper Glow** | `#D48D55` | Strategic action and top-score highlights |

### Semantic Status Palette
- **Success (`#1B6A4A`)**: Contract Awarded, Cleared PO, SOX Compliant, Tier-1 Certified.
- **Warning (`#9A5918`)**: Pending Dual Signoff, Delivery Lead Time Variance, Over-Budget Warning.
- **Danger (`#A22424`)**: Single-Source SOX Hold, Missing Form CS-8 Justification, Critical Disruption.
- **Info (`#1F567A`)**: System Synchronized, OData Feed Active, Spec Notes.

---

## 4. Typography Standards

The typography system uses **IBM Plex** across Latin and Arabic scripts to communicate industrial rigor, engineering clarity, and financial authority.

- **Primary English Typeface**: `IBM Plex Sans` (Weights: 400 Regular, 500 Medium, 600 SemiBold, 700 Bold)
- **Primary Arabic Typeface**: `IBM Plex Sans Arabic` (Weights: 400 Regular, 500 Medium, 600 SemiBold, 700 Bold)
- **Numerical & Code Typeface**: `IBM Plex Mono` (Weights: 400, 500, 600)

### Tabular Numerals Requirement
All pricing totals, SKU quantities, lead-time weeks, and financial values MUST apply `font-variant-numeric: tabular-nums` (via the utility `.tabular-nums`). This prevents jitter in financial tables and guarantees vertical decimal alignment.

---

## 5. Voice & Terminology Guidelines

| Preferred Enterprise Terminology | Deprecated / Generic AI Terminology |
| :--- | :--- |
| **Autonomous Bid Convergence** | AI Quote Matcher |
| **SOX Dual-Authorization Engine** | Order Approval |
| **Form CS-8 Sole-Source Waiver** | Flag Override |
| **Multi-Criteria Scoring Matrix** | Smart Recommendation |
| **Strategic Sourcing Principal** | Regular User / Buyer |
| **Master Supplier Ledger** | Vendor List |
| **TCO (Total Cost of Ownership)** | Price Calculation |
