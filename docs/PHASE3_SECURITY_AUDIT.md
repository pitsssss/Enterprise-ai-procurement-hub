# Synthetix Sourcing — Phase 3 Security Audit & Hardening Report

**Audit Date**: October 31, 2026  
**Auditor**: Principal Software Security Engineer, Firebase Architect, & Senior QA Engineer  
**Scope**: Authentication, Multi-Tenant Isolation, Role-Based Access Control (RBAC), Backend API Security, Firestore Security Rules, Separation of Duties, and Fiduciary Procurement Governance.  
**Target Application**: Synthetix Sourcing — Enterprise AI Procurement Hub (`d4360f16-b72f-4232-9a0f-779ee560ad79`)  
**Firestore Database ID**: `ai-studio-synthetixsourcin-d4360f16-b72f-4232-9a0f-779ee560ad79`  

---

## Executive Summary

A comprehensive architectural and security code audit was performed on the Synthetix Sourcing Phase 3 implementation. Several critical vulnerabilities were discovered in the prototype implementation—including global auto-joining of new users into the default enterprise organization with `ADMIN` privileges, lack of authentication on the server-side Gemini copilot endpoint, self-approval vulnerabilities on purchase orders, and client-side privilege escalation via the role switcher.

All identified vulnerabilities have been remediated in the codebase and verified through an automated security test suite (`scripts/test-security-suite.ts`) and Firestore security rules deployment via `DeployRules`. The visual identity, responsive mobile design, and bilingual Arabic/English localization remain completely intact.

---

## 1. Vulnerabilities Discovered and Remediated

### Vulnerability 1: Insecure Default Tenant Assignment with Automatic Admin Privileges (CRITICAL)
- **Severity**: Critical (CVSS 9.8)
- **Root Cause**: In `src/services/firestoreService.ts` (`getOrCreateUserProfile`), any newly authenticated user was automatically provisioned into `'org-synthetix-enterprise'` and given the `ADMIN` role. Furthermore, `firestore.rules` allowed `request.auth.uid == memberId` on member creation without invitation verification.
- **Impact**: Any external user signing in via Google could read, modify, and delete the enterprise tenant's RFQs, bids, vendor master records, and purchase orders.
- **Remediation**:
  1. Rewrote `getOrCreateUserProfile`: New users can join existing organizations **only** if an authorized invitation matching their verified email exists in `userInvitations/{email}`.
  2. If no invitation exists, the system provisions an isolated personal tenant (`org-${uid}`) where the user is owner and admin.
  3. Hardened `firestore.rules`: Member creation requires either `isAdmin(orgId)` or a valid invitation document in `organizations/{orgId}/invitations/{request.auth.token.email}` with matching role.

### Vulnerability 2: Unauthenticated and Unbounded AI Copilot Endpoint (HIGH)
- **Severity**: High (CVSS 8.6)
- **Root Cause**: The `/api/gemini/copilot` Express route in `server.ts` accepted unauthenticated POST requests from any client on the internet without verifying Firebase ID tokens, allowing unauthorized API quota consumption and data exfiltration.
- **Impact**: Attackers could bypass authentication, abuse server-side Gemini API quotas, and inject forged tenant contexts.
- **Remediation**:
  1. Installed `jose` and implemented remote Google JWKS token verification (`https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`).
  2. Protected `/api/gemini/copilot` with Bearer token validation matching the project audience (`disco-spark-w8p5g`) and issuer (`https://securetoken.google.com/disco-spark-w8p5g`). Unauthenticated or invalid token requests are rejected with `HTTP 401 Unauthorized`.
  3. Added an in-memory sliding window rate limiter (max 25 requests per minute per UID/IP).
  4. Updated `src/services/aiService.ts` to attach `auth.currentUser.getIdToken()`.

### Vulnerability 3: Privilege Escalation via Client-Side Role Switcher (HIGH)
- **Severity**: High (CVSS 8.2)
- **Root Cause**: The `switchRole` function in `AuthContext.tsx` previously issued updates to `organizations/{orgId}/members/{user.uid}` in Firestore, allowing any user to promote themselves to `ADMIN` or `FINANCE`.
- **Impact**: Any buyer or auditor could escalate their permissions to authorize waivers and approve high-value purchase orders.
- **Remediation**:
  1. Decoupled `switchRole` in `AuthContext.tsx` from database mutation. It is now strictly a local UI preview mode (`isSimulatingRole`).
  2. The user's real persistent role (`actualRole`) is read from Firestore and cannot be self-modified.
  3. Added Firestore rule check: `allow update: if isAuth() && isAdmin(orgId) && (request.auth.uid != memberId)`.
  4. Displayed a prominent UI warning banner whenever preview mode is active, stating that real database authorization is enforced by Firestore rules.

### Vulnerability 4: Absence of Separation of Duties (Self-Approval of POs & Waivers) (HIGH)
- **Severity**: High (CVSS 7.8)
- **Root Cause**: Requisition buyers could award a contract and subsequently approve the resulting Purchase Order or authorize their own Form CS-8 Sole-Source waiver.
- **Impact**: Direct violation of internal financial controls and corporate fiduciary policies.
- **Remediation**:
  1. Added `createdBy: actor.uid` and `createdByEmail: actor.email` to `PurchaseOrder` upon bid award.
  2. Enforced separation of duties in both `approvePurchaseOrder`, `resolveSoxWaiver`, and `firestore.rules`:
     `resource.data.createdBy != request.auth.uid && resource.data.createdByEmail != request.auth.token.email`.
  3. Requisition creators are prohibited from self-approving orders or authorizing waivers for their own orders.

### Vulnerability 5: Missing Dual Sign-Off Distinction (MEDIUM)
- **Severity**: Medium (CVSS 6.5)
- **Root Cause**: The individual authorizing the Form CS-8 Sole-Source waiver could also execute the final PO approval, collapsing a two-person dual authorization into a single signatory.
- **Impact**: Circumvention of dual fiduciary oversight on high-value orders ($\ge \$250,000$).
- **Remediation**:
  1. Enforced distinct signers in `approvePurchaseOrder`: `poData.waiverSignedBy !== actor.email`.
  2. Enforced in `firestore.rules`: `resource.data.waiverSignedBy == null || resource.data.waiverSignedBy != request.auth.token.email`.

### Vulnerability 6: Misleading Regulatory and Integration Claims (LOW)
- **Severity**: Low (Informational / Governance Risk)
- **Root Cause**: UI copy claimed "Statutory SOX Section 404 statutory limits", "SOX SEC 404 Compliant Certification", "Cryptographically verifiable immutable ledger", and "Live SAP S/4HANA & Workday production endpoints" without genuine external integrations.
- **Impact**: Regulatory and legal risk from claiming certification or genuine ERP integrations that do not exist.
- **Remediation**:
  1. Clarified that the $100,000 and $250,000 thresholds are **corporate internal policy thresholds** established under SOX Section 404 control frameworks, not statutory law.
  2. Labeled ERP connectors in `OrganizationSettingsView.tsx`, `PosView.tsx`, and `LandingPage.tsx` as **Simulated Gateways** (`Simulated` / `محاكاة`).
  3. Re-labeled the audit trail as **"Append-Only Attributed Audit Trail"** and enforced verified `actorId == request.auth.uid` validation.

---

## 2. Verified Features & Test Results

An automated security test suite was authored and executed (`npm run test:security` via `scripts/test-security-suite.ts`):

```
======================================================
  Synthetix Sourcing - Phase 3 Comprehensive Security Audit
======================================================
✅ [1. Tenant Isolation] Cross-tenant read/write blocked (Org Alpha -> Org Beta)
✅ [1. Tenant Isolation] Uninvited new user cannot join existing enterprise org
✅ [2. RBAC & Anti-Escalation] Self-promotion / Role escalation blocked
✅ [2. RBAC & Anti-Escalation] Admin cannot delete organization owner
✅ [2. RBAC & Anti-Escalation] Auditor role is strictly read-only for RFQs/POs
✅ [3. Procurement Governance] Self-approval blocked (Separation of Duties)
✅ [3. Procurement Governance] High-value order requires Form CS-8 waiver authorization prior to approval
✅ [3. Procurement Governance] Dual sign-off enforcement (Approver must be distinct from waiver signatory)
✅ [3. Procurement Governance] Requisition creator cannot sign Form CS-8 waiver for their own requisition
✅ [4. Audit Integrity] Audit log events cannot be updated or deleted (Append-only)
✅ [4. Audit Integrity] Audit event forgery blocked (Actor attribution validation)
✅ [5. Backend & AI Security] Server health and Gemini key configuration verified
✅ [5. Backend & AI Security] Unauthenticated request to /api/gemini/copilot rejected (401 Unauthorized)
✅ [5. Backend & AI Security] Invalid/Forged JWT Bearer token rejected (401 Unauthorized)
======================================================
Total Security Scenarios Evaluated: 14
Passed:                             14
Failed:                             0
======================================================
✅ 100% of Security and Governance Scenarios PASSED!
```

Additionally, the internationalization dictionary integrity verification was executed:
```
English (en) total translation units: 319
Arabic (ar) total translation units:  319
✅ 100% of English keys are present in Arabic.
✅ 100% of Arabic keys are present in Arabic.
✅ All interpolation parameters (e.g. {{param}}) match perfectly.
Translation integrity verification PASSED with 100% parity!
```

---

## 3. RBAC Procurement Role Permission Matrix

| Role | Create RFQ | Award Bid | Approve PO | Authorize Form CS-8 Waiver | Manage Org Members | Read Audit Trail |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **ADMIN** | ✅ | ✅ | ✅* | ✅* | ✅ | ✅ |
| **PROCUREMENT_MANAGER** | ✅ | ✅ | ✅* | ❌ | ❌ | ✅ |
| **BUYER** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **APPROVER** | ❌ | ❌ | ✅* | ❌ | ❌ | ✅ |
| **FINANCE** | ❌ | ❌ | ✅* | ✅* | ❌ | ✅ |
| **AUDITOR** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

*\*Subject to separation of duties (creator cannot self-approve; waiver signer cannot be final PO approver).*

---

## 4. Remaining Risks & Operational Recommendations

1. **Firebase Authentication Provider Restriction**:
   - Currently, Google Sign-In is configured. If email/password authentication is enabled in the Firebase Console, email verification must be enforced (`user.emailVerified == true`) to prevent email-spoofing attacks against the invitation directory.
2. **Rate Limiting Persistence Across Server Restarts**:
   - The rate limiter on `/api/gemini/copilot` uses in-memory tracking. For clustered horizontal multi-instance deployments, integrate Redis or Cloud Memorystore for shared token bucket rate limiting.
3. **External ERP Connectivity**:
   - SAP and Workday gateways are currently operating in high-fidelity simulated sandbox mode. When enterprise customers request live ERP connectivity, implement mutual TLS (mTLS) or OAuth2 client credentials flows via an encrypted secrets manager.

---

## 5. Release Blockers

There are **zero remaining blocking security defects** preventing progression. All 14 security test assertions, TypeScript compilation (`tsc --noEmit`), and build compilation (`vite build`) pass with zero errors.

---

## 6. Security Readiness Statement

The Phase 3 implementation of Synthetix Sourcing is **hardened and verified**. The application satisfies enterprise multi-tenant isolation, cryptographically verified backend authentication, strict RBAC authorization, separation of duties, and append-only audit activity logging. The existing published deployment remains preserved until stakeholder sign-off.
