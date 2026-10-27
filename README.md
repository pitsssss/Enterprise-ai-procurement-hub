# Synthetix Sourcing
### Enterprise AI Procurement Hub

**An interactive procurement management prototype** bringing sourcing analytics, RFQs, supplier bid evaluation, vendor governance, purchase order workflows, and an AI-assisted procurement experience into one workspace.

> **Project status:** Interactive demo / prototype. Sample procurement data and purchasing actions are simulated; this is **not** a production procurement system.

**🌐 Live demo:** [https://synthetix-sourcing-enterprise-ai-procurement-hub.ai.studio/](https://synthetix-sourcing-enterprise-ai-procurement-hub.ai.studio/)

---

## Overview

Synthetix Sourcing explores how procurement teams can manage sourcing activity and make more informed vendor decisions within a single interface.

It combines a procurement-oriented dashboard with simulated approval workflows and an AI Copilot designed to assist with procurement-related questions and navigation.

The app was prototyped using **Google AI Studio**. The visible build output indicates a **React + TypeScript** frontend using **Vite**; implementation and runtime details should be confirmed against the current source before publishing technical documentation.

## Core Features

| Module | Demo Capabilities |
| --- | --- |
| **Spend & Analytics** | Procurement KPIs, pipeline and savings indicators, compliance signals, and strategic insight widgets. |
| **RFQs & Requisitions** | RFQ ledger, filters, budget/deadline details, line-item inspection, and a requisition creation interaction. |
| **Bid Comparisons** | Supplier evaluation using delivery lead time, warranty, ESG indicators, and composite scoring. |
| **Vendor Master Data** | Supplier directory, tier classifications, on-time delivery metrics, quality indicators, and vendor audit entry points. |
| **Purchase Orders** | Simulated contract-award-to-PO flow, approval states, compliance holds, and waiver interactions. |
| **AI Procurement Copilot** | Procurement Q&A, contextual navigation, and demo-oriented recommendations. Behavior depends on whether a supported live model integration is configured. |

## Typical Demo Workflows

1. Review procurement activity and compliance indicators in **Spend & Analytics**.
2. Explore RFQs and inspect item-level requirements.
3. Compare vendor proposals and their evaluation criteria.
4. **Simulate** an award and examine the resulting purchase order.
5. Explore approval and compliance states.
6. Ask the AI Copilot procurement-related questions.

---

## AI Procurement Copilot

The prototype includes an AI-assisted procurement experience designed to support procurement analysis and operational navigation.

### Reported Capabilities

- Procurement-related conversational assistance.
- Supplier comparison and bid evaluation insights.
- Contextual navigation between application modules.
- Procurement policy and compliance-related guidance.
- Demo-oriented AI recommendations.
- Deterministic offline-style responses and a configurable Gemini-powered mode.

### AI Integration Notes

The currently implemented Gemini model, credential handling, server routing, and authorization mechanisms should be verified against the latest source code.

**Important:** AI-generated guidance and any apparent approvals are illustrative only. Scores, supplier information, compliance indicators, and records shown in the prototype should not be used for real financial or procurement decisions.

---

## Technology Stack

The following technologies have been identified from the available project context:

| Technology | Purpose |
| --- | --- |
| **React** | Component-based frontend development |
| **TypeScript / TSX** | Typed application development |
| **Vite** | Frontend build tooling |
| **Google AI Studio** | AI-assisted application prototyping and preview |
| **Google Gemini** | AI Copilot integration concept |

Additional libraries, dependencies, and backend implementation details should be verified against the current project files.

---

## Getting Started

### Live Demo

You can explore the deployed prototype directly without installing any dependencies.

**[Launch Synthetix Sourcing](https://synthetix-sourcing-enterprise-ai-procurement-hub.ai.studio/)**

### Local Development

The project was created using Google AI Studio.

Local setup instructions should be generated from the current `package.json`, lockfile, runtime configuration, and environment requirements.

Before running the application locally, review:

- Required Node.js version.
- Package manager and dependencies.
- Available development and build scripts.
- Environment variable requirements.
- Backend and Gemini API configuration.

Do not commit API keys, authentication tokens, or other secrets to the repository.

---

## Deployment

Synthetix Sourcing is available through a Google AI Studio live-app URL.

**Live Application:**

https://synthetix-sourcing-enterprise-ai-procurement-hub.ai.studio/

Additional hosting configuration and deployment details should be verified from the project's current settings.

---

## Security and Data Handling

The application is intended as an interactive prototype.

Before using similar functionality in a production procurement environment:

- Keep API keys and credentials out of public frontend code.
- Avoid committing `.env` files or secrets.
- Implement server-side authentication and authorization.
- Enforce role-based permissions for procurement actions.
- Validate all data and business operations.
- Introduce secure audit trails and approval controls.
- Restrict AI tools and actions to explicitly authorized operations.
- Verify security and compliance requirements independently.

The current prototype does not establish production-grade authentication, authorization, audit logging, or SOX compliance.

---

## Design and Responsiveness

The application uses a modern, dark-themed enterprise interface designed around procurement operations and AI-assisted workflows.

### Design Objectives

- Clear information hierarchy.
- Consistent navigation across modules.
- Readable procurement analytics.
- Interactive data visualization.
- Efficient supplier evaluation.
- Accessible procurement workflows.
- Responsive desktop, tablet, and mobile layouts.

Mobile responsiveness is being refined and should be validated across supported screen sizes before being described as fully complete.

---

## Future Improvements

- Complete mobile and tablet UX validation.
- Integrate real procurement backend APIs.
- Implement persistent data storage.
- Add user authentication and role-based access.
- Introduce auditable approval workflows.
- Connect AI responses to authorized procurement data.
- Implement automated unit and integration tests.
- Add monitoring, logging, and deployment checks.
- Improve accessibility and performance.

---

## Project Scope

Synthetix Sourcing is an **AI-assisted procurement management prototype** developed to explore modern enterprise software interfaces, procurement workflows, and AI integration opportunities.

The project demonstrates procurement-oriented UI interactions and simulated business processes.

It is not a live procurement or purchasing platform.

---

*Built as an exploratory software engineering and AI-enabled procurement experience.*
