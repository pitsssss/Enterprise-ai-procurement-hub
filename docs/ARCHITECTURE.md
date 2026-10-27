# Synthetix Sourcing — Enterprise Architecture Specification

## 1. Executive System Overview
Synthetix Sourcing is an enterprise-grade AI Strategic Procurement & Sourcing platform designed for fiduciary compliance, multi-vendor bid convergence, and Sarbanes-Oxley (SOX) Section 404 dual-custody authorization.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Web Client (React 19 + Vite)                     │
│  - Precision & Trust Design System (Tailwind CSS v4)                   │
│  - Real-time Subscriptions (onSnapshot) & Protected App Routes         │
│  - Dual-Locale Typography: IBM Plex Sans (EN) & IBM Plex Arabic (AR)   │
└───────────────────▲───────────────────────────────▲────────────────────┘
                    │ Firebase Auth (Google Sign-In)│ Firestore SDK
                    ▼                               ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│  Firebase Authentication     │        │  Cloud Firestore Database    │
│  - Google Sign-In Popup      │        │  - Multi-tenant Organization │
│  - Persistent Sessions       │        │  - Subcollections per org    │
│  - Token Refresh & Security  │        │  - Immutable Audit Events    │
└──────────────────────────────┘        └──────────────▲───────────────┘
                                                       │ Rules Gate
                                        ┌──────────────┴───────────────┐
                                        │  firestore.rules (8 Pillars) │
                                        │  - Relational Member Check   │
                                        │  - Role-Based Access Control │
                                        │  - Append-Only Audit Trail   │
                                        └──────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                      Express Backend (Node.js/TSX)                     │
│  - Port 3000 Unified Server with Vite dev middleware                   │
│  - Server-side Gemini 3.8 Flash Engine (/api/gemini/copilot)           │
│  - Grounded Procurement Prompts & Fiduciary Heuristics                 │
└────────────────────────────────────────────────────────────────────────┘
```

## 2. Authentication Architecture
- **Identity Provider**: Real Google Sign-In via Firebase Auth (`signInWithPopup(auth, googleProvider)`).
- **Session Persistence**: Automated browser session persistence monitored through `onAuthStateChanged`.
- **Identity Initialization**:
  1. On first login, the user's Google UID triggers `getOrCreateUserProfile()`.
  2. The user profile is created under `/userProfiles/{userId}`.
  3. The user is assigned to an enterprise organization workspace (`organizations/{orgId}`) as a validated member with the `ADMIN` role.
  4. Workspaces are automatically initialized with initial procurement seed data (RFQs, Vendors, Bids, POs, and opening audit entries).
- **Safe Session Termination**: Complete cache eviction and cryptographic credential purge via `signOut(auth)`.

## 3. Database Architecture & Multi-Tenancy
Data isolation is strictly enforced through Firestore collection hierarchies:
- **Global Collection**:
  - `/userProfiles/{userId}`: Global identity, interface theme, language preference, and pointer to active `currentOrgId`.
- **Tenant Isolation**:
  - `/organizations/{orgId}`: Workspace configurations and SOX policy rules.
  - `/organizations/{orgId}/members/{userId}`: Member roster with granular procurement roles.
  - `/organizations/{orgId}/rfqs/{rfqId}`: Requisitions, target prices, and awarded quotes.
  - `/organizations/{orgId}/vendors/{vendorId}`: Vendor master records, ESG scores, and tier allocations.
  - `/organizations/{orgId}/bids/{bidId}`: Quotations, unit prices, warranty periods, and risk levels.
  - `/organizations/{orgId}/pos/{poId}`: Purchase orders, dual-custody authorization states, and SOX Form CS-8 waivers.
  - `/organizations/{orgId}/auditEvents/{eventId}`: Strictly append-only, immutable transaction ledger.
  - `/organizations/{orgId}/notifications/{notifId}`: Real-time procurement notifications and alerts.

## 4. Role-Based Access Control (RBAC) Matrix
| Permission / Action | ADMIN | PROCUREMENT_MANAGER | BUYER | APPROVER | FINANCE | AUDITOR |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Create Requisition (RFQ)** | Yes | Yes | Yes | No | No | No |
| **Evaluate & View Bids** | Yes | Yes | Yes | Yes | Yes | Yes |
| **Authorize Contract Award** | Yes | Yes | Yes | No | No | No |
| **Standard PO Approval (<$250k)** | Yes | Yes | No | Yes | Yes | No |
| **Sign Form CS-8 Sole-Source Waiver** | Yes | No | No | No | Yes | No |
| **Invite & Manage Members** | Yes | No | No | No | No | No |
| **View Immutable Audit Logs** | Yes | Yes | Yes | Yes | Yes | Yes |

## 5. Server-Side AI Copilot (Gemini 3.8 Flash)
- **Engine**: `@google/genai` TypeScript SDK using `gemini-3.8-flash`.
- **Endpoint**: `/api/gemini/copilot`.
- **Security Boundary**: The client sends only organization-scoped context. The server system instruction grounds inference in FAR 52.204-24, SOX Section 404 thresholds, and TCO evaluations. No client-side LLM API keys are exposed.
