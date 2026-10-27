# Synthetix Sourcing — Enterprise Security & Compliance Architecture

## 1. Statutory Fiduciary Compliance & SOX Section 404
The Synthetix Sourcing platform is engineered to satisfy the rigorous requirements of corporate internal controls over financial reporting under the Sarbanes-Oxley Act of 2002 (SOX), specifically Section 404:

1. **Dual-Custody Authorization**:
   - Single-signoff authority is strictly capped by role delegation ceilings.
   - Any capital expenditure or contract commitment exceeding $100,000 USD requires dual authorization (Requesting Procurement Lead + Treasury Approver).

2. **Single-Source Exception Control ($250,000 Threshold)**:
   - When an RFQ receives fewer than 3 independent competitive bids and exceeds $250,000 USD, it cannot be automatically awarded or dispatched to ERP.
   - The generated Purchase Order is immediately assigned a `FLAGGED` status and placed on an active stop-work `soxHold`.
   - Releasing the hold requires an official **Form CS-8 Sole-Source Waiver**, which can only be authorized by an authenticated `FINANCE` or `ADMIN` signatory.
   - The signatory must provide a formal legal justification statement (e.g., proprietary OEM tooling, emergency infrastructure disruption, or sole patent-holder licensing) which is permanently bound to the transaction.

3. **Immutable Audit Trail**:
   - Every state transition—RFQ publication, bid submission, award confirmation, PO approval, and waiver execution—generates an immutable `AuditEvent`.
   - In `firestore.rules`, the `auditEvents` collection enforces:
     ```javascript
     match /auditEvents/{eventId} {
       allow read: if isMember(orgId);
       allow create: if isMember(orgId);
       allow update, delete: if false; // Permanent immutability
     }
     ```
   - No user, including tenant administrators, can modify or delete existing audit entries.

## 2. Firestore Security Rules (8 Pillars of Hardened Defense)

1. **Pillar 1: Master Gate**
   All access to cloud database documents requires an authenticated cryptographic session token issued by Firebase Auth:
   ```javascript
   function isAuth() {
     return request.auth != null;
   }
   ```

2. **Pillar 2: Relational Organization Membership Checks**
   Data cannot be leaked across organizations. A caller can only query or read documents if their user ID is registered in the organization's member roster:
   ```javascript
   function isMember(orgId) {
     return isAuth() && exists(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid));
   }
   ```

3. **Pillar 3: Role-Based Authorization Gates**
   Document write access is constrained by the caller's verified member record:
   - `ADMIN`: Tenant administration, member role modifications, and emergency statutory overrides.
   - `PROCUREMENT_MANAGER`: Requisition approvals, vendor onboarding, and contract award reviews.
   - `BUYER`: Draft and publish RFQs, manage supplier communications, and evaluate proposals.
   - `APPROVER`: Signatory budget approvals on purchase orders up to delegation ceilings.
   - `FINANCE`: Form CS-8 Sole-Source waiver authorization, treasury audit, and payment release.
   - `AUDITOR`: Complete read-only transparency across all procurement artifacts without modification permissions.

4. **Pillar 4: User Profile Isolation**
   User profiles (`/userProfiles/{userId}`) can only be written by the matching authenticated user:
   ```javascript
   match /userProfiles/{userId} {
     allow read: if isAuth();
     allow write: if isAuth() && request.auth.uid == userId;
   }
   ```

5. **Pillar 5: Multi-Tenant Workspace Protection**
   Organization documents (`/organizations/{orgId}`) are protected from unauthorized creation or modification. New organizations can only be created with the caller as the designated owner.

6. **Pillar 6: Zero Blanket Rules**
   No blanket collection wildcard rules exist. Every entity (`rfqs`, `vendors`, `bids`, `pos`, `auditEvents`, `notifications`) has distinct validation conditions.

7. **Pillar 7: Client-Side Error Normalization**
   Every database access is wrapped in `handleFirestoreError`, preventing silent failures or sensitive stack leakage.

8. **Pillar 8: Deployment Verification**
   Rules are validated with ESLint security standards and deployed directly to Google Cloud via `rpc_action(service_name: "fax", method_name: "DeployRules")`.

## 3. Server-Side Gemini AI Sandboxing
- The AI Copilot operates via an Express backend endpoint (`/api/gemini/copilot`).
- AI inference does not execute raw shell commands or direct SQL/NoSQL injections.
- All contextual entities passed to the model are pre-filtered and scoped to the user's active tenant organization.
- Suggested actions from the model (e.g. `APPROVE_PO`, `OPEN_COMPARISON`) are purely declarative tokens that must be confirmed by the human user through the established UI workflow with RBAC checks.
