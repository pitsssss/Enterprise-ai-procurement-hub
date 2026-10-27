# Synthetix Sourcing
### Enterprise AI Procurement Hub

**An interactive procurement management prototype** bringing sourcing analytics, RFQs, supplier bid evaluation, vendor governance, purchase order workflows, and an AI-assisted procurement experience into one workspace.

> **Project status:** Interactive demo / prototype. Sample procurement data and purchasing actions are simulated; this is **not** a production procurement system.

<!-- TODO (before publishing): Insert the actual public deployment URL only after opening and verifying it. -->
**Live demo:** Not yet linked — add the verified public URL after publishing from Google AI Studio.

<!-- TODO (optional): Add real screenshots from the current app, not generated mockups. -->

## Overview

Synthetix Sourcing explores how procurement teams can manage sourcing activity and make more informed vendor decisions within a single interface. It combines a procurement-oriented dashboard with simulated approval workflows and an AI Copilot designed to assist with procurement-related questions and navigation.

The app was prototyped using **Google AI Studio**. The visible build output indicates a **React + TypeScript** frontend using **Vite**; implementation and runtime details should be confirmed against the current source before publishing technical documentation.

## Core features

| Module | Demo capabilities |
| --- | --- |
| **Spend & Analytics** | Procurement KPIs, pipeline and savings indicators, compliance signals, and strategic insight widgets. |
| **RFQs & Requisitions** | RFQ ledger, filters, budget/deadline details, line-item inspection, and a requisition creation interaction. |
| **Bid Comparisons** | Side-by-side supplier evaluation using delivery lead time, warranty, ESG indicators, and composite scoring. |
| **Vendor Master Data** | Supplier directory, tier classifications, on-time delivery metrics, quality indicators, and vendor audit entry points. |
| **Purchase Orders** | Simulated contract-award-to-PO flow, approval states, compliance holds, and waiver interactions. |
| **AI Procurement Copilot** | Procurement Q&A, contextual navigation, and demo-oriented recommendations; behavior depends on whether a supported live model integration is configured. |

### Typical demo flows

1. Review procurement activity and compliance indicators in **Spend & Analytics**.
2. Explore RFQs and inspect item-level requirements.
3. Compare vendor proposals and their evaluation criteria.
4. **Simulate** an award and examine the resulting purchase order.
5. Explore approval/compliance states and ask the Copilot procurement-related questions.

## AI capabilities and limitations

The reported prototype includes a deterministic, offline-style Copilot experience and a configurable Gemini-powered mode. The **currently implemented model, credentials mechanism, server routing, and tool/action authorization must be checked in the source** before documenting them as verified features.

**Important:** AI-generated guidance and any apparent approvals in the demo are illustrative only. Scores, supplier information, compliance indicators, and records shown in the prototype should not be used for real financial or procurement decisions.

## Technology

**Visible/known from the current project context:**

- React
- TypeScript / TSX
- Vite
- Google AI Studio (app creation and preview)
- Gemini integration / Copilot concept (verify the actual current model and call path)

<!-- TODO: Inspect package.json and the server folder to complete this list with exact libraries and versions. -->

## Getting started locally

The live project was created in Google AI Studio. Local setup instructions must be generated from the **current** `package.json`, lockfile, runtime requirements, and configuration—not guessed.

<!-- TODO: Replace with verified prerequisites, package-manager commands, dev script, build script, ports, and any required environment variables. -->

For a no-local-setup experience, use the app's **Preview** in Google AI Studio or its verified **Live demo** URL when published.

## Deployment

The intended deployment path is Google AI Studio's built-in **Publish** flow (subject to account and hosting eligibility).

<!-- TODO: Add only verified hosting provider, deployment URL, and deployment-specific notes once published. -->

**Deployment URL:** Pending verification.

## Security and data handling

- Never commit `.env` files or API keys to GitHub.
- Do not expose secret API credentials in public frontend code.
- Handle Gemini credentials on a server-side path or approved secrets mechanism where applicable.
- Review simulated actions carefully before adapting them to real procurement operations.
- The current prototype is not evidence of real authentication, authorization, audit logging, SOX compliance, or production security controls.

## Design and responsiveness

The app uses a dark enterprise-style interface with procurement-focused navigation. Mobile responsiveness is **actively being refined**; do not describe it as fully validated until the updated design has been checked across mobile, tablet, and desktop screens.

<!-- TODO: Add verified screenshots and accessibility/responsive testing notes. -->

## Future improvements

- Complete and validate mobile/tablet usability across all workflows.
- Connect real, permission-controlled procurement APIs when moving beyond mock data.
- Add persistent data storage, authentication, role-based access, and audit trails as needed.
- Make AI responses traceable to authorized, current procurement data.
- Introduce automated tests and deployment checks.

## Repository notes

This repository showcases an **AI-assisted interactive prototype**, not a live purchasing platform. Keep its README aligned with the actual source, dependencies, and deployed URL.

<!-- TODO: Add a LICENSE file and its exact name if licensing is intended. Do not assert MIT or another license without choosing one. -->

---

*Built as an exploratory software engineering and AI-enabled procurement experience.*
