# Synthetix Sourcing — Data Model & Entity Specifications

## 1. Schema Overview
All procurement records are structured hierarchically under the tenant's organization root to enforce logical separation and database security rules.

```
Firestore Root
│
├── userProfiles/{userId}
│
└── organizations/{orgId}
    ├── members/{userId}
    ├── rfqs/{rfqId}
    ├── vendors/{vendorId}
    ├── bids/{bidId}
    ├── pos/{poId}
    ├── auditEvents/{eventId}
    └── notifications/{notifId}
```

## 2. Entity Details

### 2.1 `userProfiles`
Collection: `/userProfiles/{userId}`
Key: Firebase Auth UID (`request.auth.uid`)
- `uid` (string, required): Matches Firebase Auth UID.
- `email` (string, required): Primary work email address.
- `displayName` (string, required): Full signatory name.
- `photoURL` (string, optional): Profile avatar image URI.
- `currentOrgId` (string, required): Pointer to the active tenant workspace.
- `language` (string, required): Preferred UI language (`'en'` | `'ar'`).
- `theme` (string, required): Preferred visual theme (`'light'` | `'dark'`).
- `title` (string, optional): Corporate designation (e.g., "VP of Strategic Procurement").
- `department` (string, optional): Cost center or business unit.
- `updatedAt` (ISO8601 string, required): Last modification timestamp.

### 2.2 `organizations`
Collection: `/organizations/{orgId}`
- `id` (string, required): Organization slug/UUID.
- `name` (string, required): Corporate entity name.
- `slug` (string, required): URL/Subdomain friendly identifier.
- `defaultCurrency` (string, required): Base accounting currency (e.g., `'USD'`).
- `soxComplianceEnabled` (boolean, required): Whether dual-signoff and statutory thresholds are active.
- `soxThresholdUSD` (number, required): Threshold exceeding which sole-source awards require Form CS-8 waiver (default: 250,000).
- `createdAt` (ISO8601 string, required): Provisioning date.
- `ownerUid` (string, required): UID of the initiating administrator.

### 2.3 `members`
Subcollection: `/organizations/{orgId}/members/{userId}`
- `uid` (string, required): User UID.
- `orgId` (string, required): Parent organization ID.
- `email` (string, required): Corporate email address.
- `displayName` (string, required): User display name.
- `role` (enum, required): `'ADMIN'` | `'PROCUREMENT_MANAGER'` | `'BUYER'` | `'APPROVER'` | `'FINANCE'` | `'AUDITOR'`.
- `department` (string, optional): Department assignment.
- `joinedAt` (ISO8601 string, required): Timestamp of workspace induction.

### 2.4 `rfqs`
Subcollection: `/organizations/{orgId}/rfqs/{rfqId}`
- `id` (string, required): Document ID.
- `orgId` (string, required): Tenant organization ID.
- `rfqNumber` (string, required): Human-readable requisition reference (e.g. `'RFQ-2025-0891'`).
- `title` (string, required): Requisition title.
- `category` (string, required): Sourcing commodity (`'IT Hardware'` | `'Facility Operations'` | `'Precision Machining'` | `'Raw Materials'` | `'Logistics'`).
- `department` (string, required): Requesting department / cost center.
- `budget` (number, required): Authorized capital budget in USD.
- `estTotalValue` (number, required): Estimated contract value based on market indexes.
- `status` (enum, required): `'DRAFT'` | `'OPEN_FOR_BIDS'` | `'EVALUATION'` | `'AWARDED'` | `'CANCELLED'`.
- `deadline` (string, required): Bidding closure date.
- `lineItems` (array of LineItem objects):
  - `id` (string): Item identifier.
  - `sku` (string): Stock keeping unit.
  - `description` (string): Detailed technical specification.
  - `quantity` (number): Order volume.
  - `unit` (string): Measure unit.
  - `targetPrice` (number): Benchmark unit ceiling.
- `invitedVendorsCount` (number, required): Number of solicited vendors.
- `bidsReceivedCount` (number, required): Count of incoming supplier proposals.
- `createdBy` (string, required): UID of requisition author.
- `createdAt` (string, required): Date created.
- `awardedBidId` (string, optional): Pointer to the winning proposal document.
- `awardedVendorName` (string, optional): Winning supplier designation.
- `awardedAt` (ISO8601 string, optional): Formal award timestamp.

### 2.5 `vendors`
Subcollection: `/organizations/{orgId}/vendors/{vendorId}`
- `id` (string, required): Unique vendor code (e.g. `'v-1'`).
- `orgId` (string, required): Tenant ID.
- `name` (string, required): Legal company name.
- `tier` (enum, required): `'TIER_1_STRATEGIC'` | `'PREFERRED'` | `'APPROVED'` | `'PROBATIONARY'`.
- `category` (string, required): Industry sector.
- `country` (string, required): Domicile country code.
- `activeContractsCount` (number, required): In-flight active commitments.
- `onTimeDeliveryRate` (number, required): Percentage score (0–100).
- `qualityScore` (number, required): Percentage score (0–100).
- `esgScore` (number, required): Composite sustainability rating (0–100).
- `status` (enum, required): `'ACTIVE'` | `'RESTRICTED'` | `'PENDING_AUDIT'`.
- `contactEmail` (string, required): Supplier sales/rep email.
- `annualSpendUSD` (number, required): Trailing 12-month spend volume.

### 2.6 `bids`
Subcollection: `/organizations/{orgId}/bids/{bidId}`
- `id` (string, required): Document ID.
- `orgId` (string, required): Tenant ID.
- `rfqId` (string, required): Foreign key referencing RFQ.
- `vendorId` (string, required): Foreign key referencing vendor.
- `vendorName` (string, required): Denormalized supplier name for efficient rendering.
- `unitPriceTotal` (number, required): Commercial offer total.
- `leadTimeWeeks` (number, required): Production to dispatch lead duration.
- `warrantyMonths` (number, required): Fiduciary warranty duration.
- `esgScore` (number, required): ESG sustainability score.
- `complianceRate` (number, required): Specification compliance percentage.
- `riskLevel` (enum, required): `'LOW'` | `'MEDIUM'` | `'HIGH'`.
- `aiRecommendationScore` (number, required): Algorithmically calculated composite suitability index (0–100).
- `keyDifferentiator` (string, required): Executive summary differentiator.
- `quoteRef` (string, required): Supplier formal quotation reference (e.g. `'QU-2025-4192'`).
- `submissionDate` (string, required): Proposal timestamp.

### 2.7 `pos` (Purchase Orders)
Subcollection: `/organizations/{orgId}/pos/{poId}`
- `id` (string, required): Document ID.
- `orgId` (string, required): Tenant ID.
- `poNumber` (string, required): ERP PO reference (e.g. `'PO-2025-0720'`).
- `rfqRef` (string, required): Originating RFQ reference.
- `vendorName` (string, required): Awarded vendor legal entity.
- `amount` (number, required): Financial obligation total in USD.
- `currency` (string, required): Currency identifier (`'USD'`).
- `status` (enum, required): `'PENDING_APPROVAL'` | `'APPROVED'` | `'DISPATCHED'` | `'DELIVERED'` | `'FLAGGED'`.
- `issueDate` (string, required): Generation date.
- `approverRole` (string, required): Designate signatory level.
- `paymentTerms` (string, required): Commercial terms (e.g. `'Net 45 Enterprise'`).
- `complianceWarning` (string, optional): Specific SOX Section 404 statutory exception note.
- `complianceCleared` (boolean, optional): Flag indicating whether all required waivers have been executed.
- `soxHold` (boolean, optional): Active stop-work order flag for single-source allocations > $250k.
- `waiverSignedBy` (string, optional): Finance / Admin signatory email who signed Form CS-8.
- `waiverSignedAt` (ISO8601 string, optional): Timestamp of waiver execution.
- `waiverJustification` (string, optional): Recorded statutory justification reason.
- `approvedBy` (string, optional): Signatory email who authorized dispatch.
- `approvedAt` (ISO8601 string, optional): Approval timestamp.

### 2.8 `auditEvents`
Subcollection: `/organizations/{orgId}/auditEvents/{eventId}`
- `id` (string, required): Unique audit event UUID.
- `orgId` (string, required): Tenant ID.
- `actorId` (string, required): Signatory UID.
- `actorEmail` (string, required): Signatory email.
- `actorRole` (enum, required): Role active during action execution.
- `action` (string, required): Standardized event verb (e.g. `'RFQ_CREATED'`, `'BID_AWARDED'`, `'PO_APPROVED'`, `'SOX_WAIVER_AUTHORIZED'`).
- `entityType` (enum, required): `'RFQ'` | `'BID'` | `'PURCHASE_ORDER'` | `'VENDOR'` | `'MEMBER'` | `'ORGANIZATION'`.
- `entityId` (string, required): Key of affected document.
- `summary` (string, required): Human-readable event narration.
- `details` (string, optional): Additional contextual metadata or justification text.
- `timestamp` (ISO8601 string, required): Cryptographically ordered creation time.
*Note: Under firestore.rules, auditEvents are strictly immutable: `allow update, delete: if false;`.*
