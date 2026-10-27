import { RFQ, VendorBid, Vendor, PurchaseOrder } from '../types/procurement';

export const INITIAL_RFQS: RFQ[] = [
  {
    id: 'rfq-101',
    rfqNumber: 'RFQ-2025-0891',
    title: 'Enterprise High-Density GPU Compute Nodes',
    category: 'IT Hardware',
    department: 'AI Research & Platform Eng',
    budget: 420000,
    estTotalValue: 388500,
    status: 'EVALUATION',
    deadline: '2025-04-18',
    lineItems: [
      { id: 'li-1', sku: 'GPU-H200-SXM', description: 'NVIDIA H200 141GB SXM5 Server Unit', quantity: 4, unit: 'Chassis', targetPrice: 85000 },
      { id: 'li-2', sku: 'IB-400G-SW', description: '400Gb/s Quantum-2 InfiniBand Switch', quantity: 2, unit: 'Units', targetPrice: 16500 }
    ],
    invitedVendorsCount: 4,
    bidsReceivedCount: 3,
    policyNotes: 'High capital item ($300k+). Mandatory dual sign-off from IT Sec & Group Treasury.',
    createdAt: '2025-03-01'
  },
  {
    id: 'rfq-102',
    rfqNumber: 'RFQ-2025-0892',
    title: 'Aerospace Titanium Fasteners Batch B',
    category: 'Precision Machining',
    department: 'Advanced Prototyping Facility',
    budget: 85000,
    estTotalValue: 92000,
    status: 'OPEN_FOR_BIDS',
    deadline: '2025-04-25',
    lineItems: [
      { id: 'li-3', sku: 'TI-FAST-6AL4V', description: 'Grade 5 Ti-6Al-4V Socket Cap M8x1.25', quantity: 15000, unit: 'Pieces', targetPrice: 5.5 }
    ],
    invitedVendorsCount: 5,
    bidsReceivedCount: 2,
    policyNotes: 'Current quoted totals run 8.2% over budget baseline. AI recommended counter-offer target: $83,500.',
    createdAt: '2025-03-12'
  },
  {
    id: 'rfq-103',
    rfqNumber: 'RFQ-2025-0888',
    title: 'Cleanroom HVAC Annual Maintenance & HEPA Certification',
    category: 'Facility Operations',
    department: 'Semiconductor Fabrication Lab',
    budget: 135000,
    estTotalValue: 128400,
    status: 'AWARDED',
    deadline: '2025-03-20',
    lineItems: [
      { id: 'li-4', sku: 'HVAC-SERV-CR', description: 'ISO Class 4 Periodic Certification & Replacement', quantity: 4, unit: 'Quarters', targetPrice: 32100 }
    ],
    invitedVendorsCount: 3,
    bidsReceivedCount: 3,
    policyNotes: 'Contract executed under Master Services Agreement §8.2.',
    createdAt: '2025-02-15'
  },
  {
    id: 'rfq-104',
    rfqNumber: 'RFQ-2025-0895',
    title: 'Cold-Chain Global Air Logistics Support',
    category: 'Logistics',
    department: 'Global Supply Chain Operations',
    budget: 210000,
    estTotalValue: 198000,
    status: 'DRAFT',
    deadline: '2025-05-10',
    lineItems: [
      { id: 'li-5', sku: 'LOG-CC-AIR', description: 'Temp-controlled pallet shipment (-20°C monitored)', quantity: 24, unit: 'Sorties', targetPrice: 8250 }
    ],
    invitedVendorsCount: 0,
    bidsReceivedCount: 0,
    policyNotes: 'Draft phase. Needs dangerous goods handling certification on file.',
    createdAt: '2025-03-28'
  }
];

export const INITIAL_BIDS: VendorBid[] = [
  {
    id: 'bid-01',
    rfqId: 'rfq-101',
    vendorId: 'v-1',
    vendorName: 'Apex Data Infrastructures',
    unitPriceTotal: 388500,
    leadTimeWeeks: 4,
    warrantyMonths: 36,
    esgScore: 92,
    complianceRate: 99.4,
    riskLevel: 'LOW',
    aiRecommendationScore: 95,
    keyDifferentiator: 'Direct Tier-1 OEM partner, 4-week delivery, 3-year full enterprise SLA.',
    quoteRef: 'QU-APX-8821',
    submissionDate: '2025-03-22'
  },
  {
    id: 'bid-02',
    rfqId: 'rfq-101',
    vendorId: 'v-2',
    vendorName: 'HyperScale Grid Tech',
    unitPriceTotal: 365000,
    leadTimeWeeks: 9,
    warrantyMonths: 24,
    esgScore: 78,
    complianceRate: 88.0,
    riskLevel: 'MEDIUM',
    aiRecommendationScore: 81,
    keyDifferentiator: 'Lowest initial quote, but 9-week shipping introduces high milestone delay penalty.',
    quoteRef: 'HS-BID-901',
    submissionDate: '2025-03-23'
  },
  {
    id: 'bid-03',
    rfqId: 'rfq-101',
    vendorId: 'v-3',
    vendorName: 'Synapse Server Works GmbH',
    unitPriceTotal: 412000,
    leadTimeWeeks: 5,
    warrantyMonths: 48,
    esgScore: 88,
    complianceRate: 96.5,
    riskLevel: 'LOW',
    aiRecommendationScore: 79,
    keyDifferentiator: 'Longest warranty (48 mo) but bids near max cap of $420,000.',
    quoteRef: 'SSW-EU-441',
    submissionDate: '2025-03-24'
  },
  {
    id: 'bid-04',
    rfqId: 'rfq-102',
    vendorId: 'v-4',
    vendorName: 'AeroPrecision Alloys Ltd',
    unitPriceTotal: 92000,
    leadTimeWeeks: 3,
    warrantyMonths: 12,
    esgScore: 85,
    complianceRate: 97.0,
    riskLevel: 'LOW',
    aiRecommendationScore: 88,
    keyDifferentiator: 'Direct mill certificates, fully compliant with AS9100 aerospace rev D.',
    quoteRef: 'APA-002-TI',
    submissionDate: '2025-03-25'
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'v-1',
    name: 'Apex Data Infrastructures',
    tier: 'TIER_1_STRATEGIC',
    category: 'IT Hardware',
    country: 'United States',
    activeContractsCount: 6,
    onTimeDeliveryRate: 98.4,
    qualityScore: 99.1,
    esgScore: 92,
    status: 'ACTIVE',
    contactEmail: 'enterprise-contracts@apexdata.com',
    annualSpendUSD: 1420000
  },
  {
    id: 'v-2',
    name: 'HyperScale Grid Tech',
    tier: 'PREFERRED',
    category: 'IT Hardware',
    country: 'Taiwan',
    activeContractsCount: 2,
    onTimeDeliveryRate: 89.2,
    qualityScore: 94.0,
    esgScore: 78,
    status: 'ACTIVE',
    contactEmail: 'bids@hyperscalegrid.com',
    annualSpendUSD: 680000
  },
  {
    id: 'v-3',
    name: 'Synapse Server Works GmbH',
    tier: 'APPROVED',
    category: 'IT Hardware',
    country: 'Germany',
    activeContractsCount: 1,
    onTimeDeliveryRate: 96.0,
    qualityScore: 97.5,
    esgScore: 88,
    status: 'ACTIVE',
    contactEmail: 'procurement-eu@synapseservers.de',
    annualSpendUSD: 410000
  },
  {
    id: 'v-4',
    name: 'AeroPrecision Alloys Ltd',
    tier: 'TIER_1_STRATEGIC',
    category: 'Precision Machining',
    country: 'United Kingdom',
    activeContractsCount: 4,
    onTimeDeliveryRate: 99.0,
    qualityScore: 99.8,
    esgScore: 85,
    status: 'ACTIVE',
    contactEmail: 'orders@aeroprecision.co.uk',
    annualSpendUSD: 890000
  },
  {
    id: 'v-5',
    name: 'Global Silicon Wafer Corp',
    tier: 'PROBATIONARY',
    category: 'Raw Materials',
    country: 'South Korea',
    activeContractsCount: 1,
    onTimeDeliveryRate: 82.5,
    qualityScore: 91.2,
    esgScore: 66,
    status: 'PENDING_AUDIT',
    contactEmail: 'compliance@globalsiliconwafer.kr',
    annualSpendUSD: 512000
  }
];

export const INITIAL_POS: PurchaseOrder[] = [
  {
    id: 'po-901',
    poNumber: 'PO-2025-10492',
    rfqRef: 'RFQ-2025-0888',
    vendorName: 'AeroClean Air Systems Inc.',
    amount: 128400,
    currency: 'USD',
    status: 'APPROVED',
    issueDate: '2025-03-24',
    approverRole: 'VP of Operations',
    paymentTerms: 'Net 45'
  },
  {
    id: 'po-902',
    poNumber: 'PO-2025-10493',
    rfqRef: 'RFQ-2025-0870',
    vendorName: 'Global Silicon Wafer Corp',
    amount: 512000,
    currency: 'USD',
    status: 'FLAGGED',
    issueDate: '2025-03-26',
    approverRole: 'Director of Sourcing',
    paymentTerms: 'Net 60',
    complianceWarning: 'Exceeds single-source delegation limit ($250,000) without Form CS-8 signed by Group Legal.',
    complianceCleared: false
  },
  {
    id: 'po-903',
    poNumber: 'PO-2025-10494',
    rfqRef: 'RFQ-2025-0865',
    vendorName: 'OmniCables Logistics',
    amount: 14200,
    currency: 'USD',
    status: 'PENDING_APPROVAL',
    issueDate: '2025-03-28',
    approverRole: 'Procurement Specialist',
    paymentTerms: 'Net 30'
  },
  {
    id: 'po-904',
    poNumber: 'PO-2025-10495',
    rfqRef: 'RFQ-2025-0860',
    vendorName: 'Apex Data Infrastructures',
    amount: 88500,
    currency: 'USD',
    status: 'DISPATCHED',
    issueDate: '2025-03-15',
    approverRole: 'Lead Sourcing Director',
    paymentTerms: 'Net 30'
  }
];
