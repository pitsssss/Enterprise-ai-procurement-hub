export type RFQStatus = 'DRAFT' | 'OPEN_FOR_BIDS' | 'EVALUATION' | 'AWARDED' | 'CANCELLED';
export type POStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'DISPATCHED' | 'DELIVERED' | 'FLAGGED';
export type VendorTier = 'TIER_1_STRATEGIC' | 'PREFERRED' | 'APPROVED' | 'PROBATIONARY';
export type UserRole = 'ADMIN' | 'PROCUREMENT_MANAGER' | 'BUYER' | 'APPROVER' | 'FINANCE' | 'AUDITOR';

export type TabType = 'overview' | 'rfqs' | 'bids' | 'vendors' | 'pos' | 'org' | 'profile';

export interface LineItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unit: string;
  targetPrice: number;
}

export interface RFQ {
  id: string;
  orgId?: string;
  rfqNumber: string;
  title: string;
  category: 'IT Hardware' | 'Facility Operations' | 'Precision Machining' | 'Raw Materials' | 'Logistics';
  department: string;
  budget: number;
  estTotalValue: number;
  status: RFQStatus;
  deadline: string;
  lineItems: LineItem[];
  invitedVendorsCount: number;
  bidsReceivedCount: number;
  policyNotes?: string;
  createdBy?: string;
  createdAt: string;
  awardedBidId?: string;
  awardedVendorName?: string;
  awardedAt?: string;
}

export interface VendorBid {
  id: string;
  orgId?: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  unitPriceTotal: number;
  leadTimeWeeks: number;
  warrantyMonths: number;
  esgScore: number;
  complianceRate: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  aiRecommendationScore: number;
  keyDifferentiator: string;
  quoteRef: string;
  submissionDate: string;
}

export interface Vendor {
  id: string;
  orgId?: string;
  name: string;
  tier: VendorTier;
  category: string;
  country: string;
  activeContractsCount: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  esgScore: number;
  status: 'ACTIVE' | 'RESTRICTED' | 'PENDING_AUDIT';
  contactEmail: string;
  annualSpendUSD: number;
}

export interface PurchaseOrder {
  id: string;
  orgId?: string;
  poNumber: string;
  rfqRef: string;
  vendorName: string;
  amount: number;
  currency: string;
  status: POStatus;
  issueDate: string;
  approverRole: string;
  paymentTerms: string;
  complianceWarning?: string;
  complianceCleared?: boolean;
  soxHold?: boolean;
  createdBy?: string;
  createdByEmail?: string;
  waiverSignedBy?: string;
  waiverSignedAt?: string;
  waiverJustification?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface OrganizationInvitation {
  id: string;
  orgId: string;
  email: string;
  role: UserRole;
  department: string;
  invitedBy: string;
  invitedAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED';
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  defaultCurrency: string;
  soxComplianceEnabled: boolean;
  soxThresholdUSD: number;
  createdAt: string;
  ownerUid: string;
}

export interface OrganizationMember {
  uid: string;
  orgId: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  joinedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  currentOrgId: string;
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  department?: string;
  title?: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  orgId: string;
  actorId: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  entityType: 'RFQ' | 'BID' | 'PURCHASE_ORDER' | 'VENDOR' | 'MEMBER' | 'ORGANIZATION';
  entityId: string;
  summary: string;
  details?: string;
  timestamp: string;
}

export interface ProcurementNotification {
  id: string;
  orgId: string;
  title: string;
  message: string;
  type: 'INFO' | 'ACTION_REQUIRED' | 'WARNING' | 'SUCCESS';
  read: boolean;
  createdAt: string;
  linkTab?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  mode: 'SIMULATED_PRESET' | 'GEMINI_LIVE';
  citations?: string[];
  suggestedAction?: {
    label: string;
    actionType: 'NAVIGATE_TAB' | 'APPLY_FILTER' | 'OPEN_COMPARISON' | 'APPROVE_PO';
    payload: string;
  };
}
