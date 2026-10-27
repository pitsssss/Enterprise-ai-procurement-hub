# Synthetix Sourcing — Authentication & Role-Based Access Control (RBAC)

## 1. Authentication Lifecycle
Synthetix Sourcing implements real Firebase Authentication with Google Sign-In as the primary enterprise identity protocol.

### 1.1 Sign-In Flow
1. **User Initiation**: The user navigates to the landing page or opens the `AuthModal` dialog.
2. **Provider Dispatch**: Clicking **"Continue with Google Account"** invokes `signInWithPopup(auth, googleProvider)`.
3. **Session Establishment**: Firebase securely exchanges OAuth tokens and establishes a client-side session stored in indexedDB.
4. **State Listener**: The `onAuthStateChanged` subscriber in `AuthProvider` fires with the verified `firebaseUser`.
5. **Profile Hydration & Tenant Provisioning**:
   - `getOrCreateUserProfile(firebaseUser)` checks `/userProfiles/{uid}` in Firestore.
   - If not found, a new profile is created with default preferences (`language: 'en'`, `theme: 'light'`).
   - The user is bound to the default organization workspace (`org-synthetix-enterprise`) as an `ADMIN` signatory.
   - If the workspace is new, initial enterprise seed datasets (RFQs, Vendors, Bids, POs, and opening Audit log) are automatically populated.
6. **Workspace Unlocked**: The application transitions from the public landing view to the interactive procurement dashboard.

### 1.2 Sign-Out Flow
- Clicking **"Sign Out"** in the Signatory Profile view invokes `signOut(auth)`.
- All local user state, profile context, and member credentials are immediately cleared.
- Real-time Firestore subscriptions are unsubscribed.
- The UI safely returns to the public landing page.

## 2. Granular Role Hierarchy
The platform defines six formal procurement roles:

```
                      ┌───────────────┐
                      │     ADMIN     │
                      └───────┬───────┘
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
  ┌─────────▼──────────┐              ┌─────────▼──────────┐
  │ PROCUREMENT_MGR   │              │      FINANCE       │
  └─────────┬──────────┘              └─────────┬──────────┘
            │                                   │
  ┌─────────▼──────────┐              ┌─────────▼──────────┐
  │       BUYER        │              │      APPROVER      │
  └────────────────────┘              └────────────────────┘
            │                                   │
            └─────────────────┬─────────────────┘
                              │
                      ┌───────▼───────┐
                      │    AUDITOR    │
                      └───────────────┘
```

### 2.1 Role Definitions
1. **ADMIN**:
   - Organization governance and workspace policy configuration.
   - Manage team member rosters and assign signatory roles.
   - Execute emergency Form CS-8 Sole-Source waivers.
   - Delegated authorization ceiling: **$1,000,000 USD**.

2. **PROCUREMENT_MANAGER**:
   - Supervise sourcing pipelines and review draft RFQs.
   - Onboard, tier, and restrict vendors in the Vendor Master.
   - Review bid matrices and sign off on contract awards.
   - Delegated authorization ceiling: **$150,000 USD**.

3. **BUYER**:
   - Draft and publish capital requisitions (RFQs) and define SKU line items.
   - Solicit quotes and ingest incoming supplier bids.
   - Prepare award recommendations.
   - Delegated authorization ceiling: **$50,000 USD**.

4. **APPROVER**:
   - Financial authority signatory for purchase order budget release.
   - Review capital allocation against corporate departmental spend caps.
   - Delegated authorization ceiling: **$250,000 USD**.

5. **FINANCE**:
   - Corporate treasury oversight and SOX Section 404 statutory compliance.
   - Sole authority (along with ADMIN) to authorize **Form CS-8 Sole-Source Waivers** on orders exceeding $250k.
   - Delegated authorization ceiling: **$500,000 USD**.

6. **AUDITOR**:
   - Read-only fiduciary oversight for internal compliance teams and Big Four external auditors.
   - Full visibility into bidding histories, scorecards, PO authorizations, and immutable audit logs.
   - Zero modification authority (delegation ceiling: **$0 USD**).

## 3. Interactive Role Delegation Testing
In the **Signatory Profile** view (`UserProfileView`), users can use the **Simulate Role Delegation** switcher to instantly switch between all six roles. This allows product teams, auditors, and stakeholders to test the dynamic enforcement of Firestore security rules and UI permission states in real time.
