export type RFQStatus = 'DRAFT' | 'OPEN_FOR_BIDS' | 'EVALUATION' | 'AWARDED' | 'CANCELLED';
export type POStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'DISPATCHED' | 'DELIVERED' | 'FLAGGED';
export type VendorTier = 'TIER_1_STRATEGIC' | 'PREFERRED' | 'APPROVED' | 'PROBATIONARY';

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
  createdAt: string;
}

export interface VendorBid {
  id: string;
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
