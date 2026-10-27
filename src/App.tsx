import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  Send,
  RefreshCw,
  FileCheck,
  Building2,
  DollarSign,
  Info,
  XCircle,
  Plus,
  Check,
  ShieldCheck,
  Award,
  FileSpreadsheet,
  HelpCircle,
  Bot,
  Zap,
} from 'lucide-react';

import { RFQ, VendorBid, Vendor, PurchaseOrder, ChatMessage, RFQStatus } from './types/procurement';
import { INITIAL_RFQS, INITIAL_BIDS, INITIAL_VENDORS, INITIAL_POS } from './data/mockData';
import { ProcurementAIService } from './services/aiService';

export default function App() {
  // Core Application Data State
  const [activeTab, setActiveTab] = useState<'overview' | 'rfqs' | 'bids' | 'vendors' | 'pos'>('overview');
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [bids, setBids] = useState<VendorBid[]>(INITIAL_BIDS);
  const [vendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [pos, setPos] = useState<PurchaseOrder[]>(INITIAL_POS);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [rfqCategoryFilter, setRfqCategoryFilter] = useState('ALL');
  const [selectedRfqId, setSelectedRfqId] = useState<string>('rfq-101');
  const [vendorTierFilter, setVendorTierFilter] = useState('ALL');

  // Modals & Action States
  const [isCreateRfqModalOpen, setIsCreateRfqModalOpen] = useState(false);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [selectedBidForAward, setSelectedBidForAward] = useState<VendorBid | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'warn' } | null>(null);

  // New RFQ Form State
  const [newRfqTitle, setNewRfqTitle] = useState('');
  const [newRfqCategory, setNewRfqCategory] = useState<'IT Hardware' | 'Precision Machining' | 'Facility Operations' | 'Logistics' | 'Raw Materials'>('IT Hardware');
  const [newRfqBudget, setNewRfqBudget] = useState(150000);
  const [newRfqDept, setNewRfqDept] = useState('Infrastructure Engineering');

  // AI Copilot State
  const [copilotDrawerOpen, setCopilotDrawerOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [useLiveGemini, setUseLiveGemini] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      timestamp: '09:15 AM',
      mode: 'SIMULATED_PRESET',
      content: 'Welcome to Synthetix Sourcing. I continuously monitor open RFQs, evaluate supplier bids against SLA/ESG benchmarks, and flag SOX delegation compliance risks.\n\nTry asking: "Compare bids for RFQ-2025-0891" or "Audit compliance on PO-2025-10493".',
      citations: ['Corp Procurement Manual v4.2', 'SOX Compliance Rulebook 2025'],
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  // Show Auto-Dismiss Toast
  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Active RFQ object for vendor comparison
  const activeRfq = useMemo(() => {
    return rfqs.find((r) => r.id === selectedRfqId) || rfqs[0] || INITIAL_RFQS[0];
  }, [rfqs, selectedRfqId]);

  // Filtered RFQs
  const filteredRfqs = useMemo(() => {
    return rfqs.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.rfqNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = rfqCategoryFilter === 'ALL' || r.category === rfqCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [rfqs, searchQuery, rfqCategoryFilter]);

  // Filtered Vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = vendorTierFilter === 'ALL' || v.tier === vendorTierFilter;
      return matchesSearch && matchesTier;
    });
  }, [vendors, searchQuery, vendorTierFilter]);

  // Calculations
  const totalPipelineSpend = useMemo(() => rfqs.reduce((acc, c) => acc + c.estTotalValue, 0), [rfqs]);
  const flaggedPosCount = useMemo(() => pos.filter((p) => p.status === 'FLAGGED').length, [pos]);
  const activeBidsForCurrentRfq = useMemo(
    () => bids.filter((b) => b.rfqId === activeRfq?.id),
    [bids, activeRfq]
  );

  // AI Chat Submission
  const handleSendPrompt = async (promptText?: string) => {
    const text = promptText || chatInput;
    if (!text.trim() || isAiTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'SIMULATED_PRESET',
      content: text,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!promptText) setChatInput('');
    setIsAiTyping(true);

    try {
      const aiResponse = await ProcurementAIService.queryAssistant(
        text,
        { activeRfq, rfqs, pos, bids },
        useLiveGemini
      );
      setChatMessages((prev) => [
        ...prev,
        {
          ...aiResponse,
          id: `ai-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'SIMULATED_PRESET',
          content: 'Inference completed via fallback offline intelligence core.',
          citations: ['Local Procurement Knowledge Base v4.2'],
        },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleExecuteSuggestedAction = (action?: ChatMessage['suggestedAction']) => {
    if (!action) return;
    if (action.actionType === 'NAVIGATE_TAB') {
      setActiveTab(action.payload as any);
    } else if (action.actionType === 'OPEN_COMPARISON') {
      setSelectedRfqId(action.payload);
      setActiveTab('bids');
    } else if (action.actionType === 'APPROVE_PO') {
      handleApprovePo(action.payload);
    }
  };

  // Handlers for Interactive Demo Actions
  const handleApprovePo = (poId: string) => {
    setPos((prev) =>
      prev.map((item) => {
        if (item.id === poId) {
          return {
            ...item,
            status: 'APPROVED',
            complianceWarning: undefined,
            complianceCleared: true,
          };
        }
        return item;
      })
    );
    showToast('Purchase Order Approved', `PO ${poId} authorized for commitment release.`);
  };

  const handleResolveFlag = (poId: string) => {
    setPos((prev) =>
      prev.map((item) => {
        if (item.id === poId) {
          return {
            ...item,
            status: 'PENDING_APPROVAL',
            complianceWarning: 'Form CS-8 Sole-Source Waiver attached & countersigned by Legal',
            complianceCleared: true,
          };
        }
        return item;
      })
    );
    showToast('Exception Waiver Attached', 'Form CS-8 Sole-Source document validated by Legal.', 'info');
  };

  const handleAwardBid = (bid: VendorBid) => {
    // Award RFQ and generate PO
    setRfqs((prev) =>
      prev.map((r) => (r.id === bid.rfqId ? { ...r, status: 'AWARDED' as RFQStatus } : r))
    );

    const newPo: PurchaseOrder = {
      id: `po-${Date.now().toString().slice(-4)}`,
      poNumber: `PO-2025-${Math.floor(10000 + Math.random() * 90000)}`,
      rfqRef: activeRfq?.rfqNumber || 'RFQ-2025-0891',
      vendorName: bid.vendorName,
      amount: bid.unitPriceTotal,
      currency: 'USD',
      status: 'APPROVED',
      issueDate: new Date().toISOString().split('T')[0],
      approverRole: 'VP of Global Procurement',
      paymentTerms: 'Net 45',
    };

    setPos((prev) => [newPo, ...prev]);
    setIsAwardModalOpen(false);
    showToast('Contract Award Executed', `Awarded to ${bid.vendorName}. Generated Purchase Order ${newPo.poNumber}.`);
    setActiveTab('pos');
  };

  const handleCreateNewRfq = (e: React.FormEvent) => {
    e.preventDefault();
    const rfqNum = `RFQ-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const created: RFQ = {
      id: `rfq-${Date.now()}`,
      rfqNumber: rfqNum,
      title: newRfqTitle || 'Procurement Package',
      category: newRfqCategory,
      department: newRfqDept,
      budget: Number(newRfqBudget),
      estTotalValue: Number(newRfqBudget) * 0.95,
      status: 'OPEN_FOR_BIDS',
      deadline: '2025-05-30',
      lineItems: [
        {
          id: `li-${Date.now()}`,
          sku: 'SKU-NEW-PKG',
          description: 'Custom verified enterprise line package',
          quantity: 10,
          unit: 'Units',
          targetPrice: Number(newRfqBudget) / 10,
        },
      ],
      invitedVendorsCount: 3,
      bidsReceivedCount: 0,
      policyNotes: 'Automated standard SOX dual-approval guidelines applied.',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRfqs((prev) => [created, ...prev]);
    setIsCreateRfqModalOpen(false);
    setNewRfqTitle('');
    showToast('RFQ Published to Vendor Network', `${rfqNum} is now active.`);
    setActiveTab('rfqs');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* ========================================================= */}
      {/* 1. LEFT NAVIGATION DRAWER */}
      {/* ========================================================= */}
      <aside className="flex w-64 flex-col border-r border-slate-800 bg-slate-900/95 shrink-0">
        {/* App Title Header */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="h-5 w-5 text-indigo-100" />
          </div>
          <div className="overflow-hidden">
            <h1 className="truncate text-sm font-semibold tracking-wide text-white">Synthetix Sourcing</h1>
            <p className="text-[11px] font-medium text-indigo-400">Autonomous Enterprise AI</p>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 space-y-1.5 p-3 text-sm font-medium overflow-y-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
              activeTab === 'overview'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Spend & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('rfqs')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
              activeTab === 'rfqs'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4" />
              <span>RFQs & Requisitions</span>
            </div>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{rfqs.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('bids')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
              activeTab === 'bids'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award className="h-4 w-4" />
              <span>Bid Comparisons</span>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
              activeTab === 'vendors'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4" />
              <span>Vendor Master Data</span>
            </div>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{vendors.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
              activeTab === 'pos'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-4 w-4" />
              <span>Purchase Orders</span>
            </div>
            {flaggedPosCount > 0 && (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/30">
                {flaggedPosCount} Flag
              </span>
            )}
          </button>
        </nav>

        {/* AI Governance Card */}
        <div className="m-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Governance</span>
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Active v4.2
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Pre-award anti-collusion, ESG scoring, and threshold authorization checks active.
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-500">
            <span>Server Proxy</span>
            <span className="text-indigo-400 font-mono">Gemini 3.8 Flash</span>
          </div>
        </div>

        {/* Current Operator Profile */}
        <div className="flex items-center gap-3 border-t border-slate-800 p-3.5 bg-slate-900/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-950 text-xs font-semibold text-indigo-300 border border-indigo-700/50">
            SC
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-xs font-medium text-slate-200">Sarah Chen</p>
            <p className="truncate text-[11px] text-slate-400">Strategic Sourcing Director</p>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE VIEWPORT */}
      {/* ========================================================= */}
      <main className="flex flex-1 flex-col overflow-hidden bg-slate-900/40">
        {/* Top Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800 px-6 backdrop-blur-md bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search RFQ IDs, vendors, line items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/90 py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
              <span className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[11px]">
                FY-2025 Global Sourcing Core
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateRfqModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Requisition</span>
            </button>

            <button
              onClick={() => setCopilotDrawerOpen(!copilotDrawerOpen)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                copilotDrawerOpen
                  ? 'border-indigo-500/50 bg-indigo-600/20 text-indigo-300 shadow-sm shadow-indigo-500/20'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Bot className="h-4 w-4 text-indigo-400" />
              <span>AI Copilot</span>
              <span className="ml-0.5 rounded-full bg-indigo-500/30 px-1.5 py-0.2 text-[10px] text-indigo-200 font-mono">
                Active
              </span>
            </button>
          </div>
        </header>

        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed top-18 right-8 z-50 flex items-center gap-3 rounded-xl border border-indigo-500/40 bg-slate-900/95 p-4 text-xs shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">{toastMessage.title}</p>
              <p className="text-slate-300 mt-0.5">{toastMessage.desc}</p>
            </div>
          </div>
        )}

        {/* Content Body View Manager */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* -------------------------------------------------- */}
          {/* VIEW: EXECUTIVE SPEND & ANALYTICS */}
          {/* -------------------------------------------------- */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Header Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-850 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">Pipeline Spend Under Review</span>
                    <DollarSign className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">
                    ${(totalPipelineSpend / 1000).toFixed(1)}k USD
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>{rfqs.length} Total active RFQ events</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-850 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">AI Negotiated Savings (YTD)</span>
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">$148,200 USD</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-400">
                    <span>12.4% avg variance below baseline</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-850 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">SOX & Audit Compliance Exceptions</span>
                    <ShieldAlert className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-amber-400">
                    {flaggedPosCount} Action Required
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <span>Single-source threshold exceeded</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-850 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">Avg Supplier Turnaround</span>
                    <Clock className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">6.2 Business Days</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
                    <span>2.4 days faster with automated RFQ</span>
                  </div>
                </div>
              </div>

              {/* Highlight AI Autonomous Recommendation Card */}
              <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 p-5 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                      <Bot className="h-3.5 w-3.5" />
                      <span>AI Sourcing Trade-Off Ready</span>
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      RFQ-2025-0891: Apex Data Infrastructures is optimal choice (Score: 95/100)
                    </h3>
                    <p className="max-w-2xl text-xs text-slate-300">
                      Apex Data’s $388,500 quote saves 5 weeks of critical lead-time compared to HyperScale, avoiding an estimated $42,000 in scheduled engineering idle costs.
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => {
                        setSelectedRfqId('rfq-101');
                        setActiveTab('bids');
                      }}
                      className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-colors"
                    >
                      Open Evaluation Matrix
                    </button>
                    <button
                      onClick={() => handleSendPrompt('Draft a $378,000 counter-offer for Apex Data')}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      Draft Counter-Offer
                    </button>
                  </div>
                </div>
              </div>

              {/* Dual Column Analytics Widgets */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent RFQs */}
                <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-850 p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Priority Requisitions Under Review</h4>
                      <p className="text-xs text-slate-400">Real-time status of active bidding competitions</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('rfqs')}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                    >
                      View All ({rfqs.length}) &rarr;
                    </button>
                  </div>
                  <div className="mt-3 divide-y divide-slate-800">
                    {rfqs.slice(0, 3).map((rfq) => (
                      <div key={rfq.id} className="flex items-center justify-between py-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-400">{rfq.rfqNumber}</span>
                            <span className="text-xs font-semibold text-slate-200">{rfq.title}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>{rfq.category}</span>
                            <span>•</span>
                            <span>Budget: ${rfq.budget.toLocaleString()} USD</span>
                            <span>•</span>
                            <span>{rfq.bidsReceivedCount} Bids</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                              rfq.status === 'EVALUATION'
                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                                : rfq.status === 'AWARDED'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                            }`}
                          >
                            {rfq.status.replace('_', ' ')}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedRfqId(rfq.id);
                              setActiveTab('bids');
                            }}
                            className="rounded border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policy Governance Watchdog */}
                <div className="rounded-xl border border-slate-800 bg-slate-850 p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-sm font-semibold text-white">Compliance Watchdog</h4>
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                      Policy v4.2
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {pos
                      .filter((p) => p.status === 'FLAGGED')
                      .map((p) => (
                        <div key={p.id} className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-3">
                          <div className="flex items-start gap-2 text-rose-300">
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                            <div>
                              <p className="font-bold text-xs">{p.poNumber} — Threshold Block</p>
                              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                                {p.complianceWarning}
                              </p>
                              <button
                                onClick={() => handleResolveFlag(p.id)}
                                className="mt-2 rounded bg-rose-600/30 px-2 py-1 text-[10px] font-semibold text-rose-200 border border-rose-500/30 hover:bg-rose-600/40"
                              >
                                Attach Simulated Form CS-8 &rarr;
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Dual-Approval Audit Active</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        All purchase commitments over $50,000 USD require secondary VP signoff. Anti-split logic running continuously.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* VIEW: RFQ MANAGEMENT */}
          {/* -------------------------------------------------- */}
          {activeTab === 'rfqs' && (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Requests For Quotation (RFQs)</h2>
                  <p className="text-xs text-slate-400">
                    Create specifications, track supplier submissions, and run automated AI spec verification
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={rfqCategoryFilter}
                    onChange={(e) => setRfqCategoryFilter(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="ALL">All Sourcing Categories</option>
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Precision Machining">Precision Machining</option>
                    <option value="Facility Operations">Facility Operations</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Raw Materials">Raw Materials</option>
                  </select>

                  <button
                    onClick={() => setIsCreateRfqModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-500"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New RFQ</span>
                  </button>
                </div>
              </div>

              {/* RFQ Ledger Table */}
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-850 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Title & Department</th>
                      <th className="px-4 py-3">Target Budget</th>
                      <th className="px-4 py-3">Bids Received</th>
                      <th className="px-4 py-3">Deadline</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredRfqs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          <FileSpreadsheet className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                          No RFQs found matching the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredRfqs.map((rfq) => (
                        <tr key={rfq.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3.5 font-mono font-medium text-indigo-400">
                            {rfq.rfqNumber}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-white">{rfq.title}</div>
                            <div className="text-[11px] text-slate-400">
                              {rfq.category} • {rfq.department}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-mono">
                            <div>${rfq.budget.toLocaleString()} USD</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-white">{rfq.bidsReceivedCount}</span>
                            <span className="text-slate-400"> / {rfq.invitedVendorsCount} invited</span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400">{rfq.deadline}</td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                                rfq.status === 'EVALUATION'
                                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                                  : rfq.status === 'AWARDED'
                                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                  : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                              }`}
                            >
                              {rfq.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedRfqId(rfq.id);
                                setActiveTab('bids');
                              }}
                              className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                            >
                              Evaluate Bids
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Selected RFQ Spec Inspector */}
              {activeRfq && (
                <div className="rounded-xl border border-slate-800 bg-slate-850 p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-indigo-400" />
                      <h3 className="text-sm font-semibold text-white">
                        Line-Item Specification Sheet: {activeRfq.rfqNumber}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleSendPrompt(`Analyze specification compliance for ${activeRfq.rfqNumber}`)}
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      <Bot className="h-3.5 w-3.5" />
                      <span>Run AI Spec Feasibility</span>
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {activeRfq.lineItems.map((item) => (
                      <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-indigo-300">{item.sku}</span>
                          <span className="text-xs font-semibold text-white">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-300">{item.description}</p>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                          <span>Target: ${item.targetPrice.toLocaleString()} / unit</span>
                          <span className="font-semibold text-slate-200">
                            Line Total: ${(item.quantity * item.targetPrice).toLocaleString()} USD
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeRfq.policyNotes && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg bg-indigo-950/30 border border-indigo-500/20 p-3 text-xs text-indigo-300">
                      <Info className="h-4 w-4 shrink-0 mt-0.5 text-indigo-400" />
                      <span>{activeRfq.policyNotes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* VIEW: BID COMPARISONS & MATRIX */}
          {/* -------------------------------------------------- */}
          {activeTab === 'bids' && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">Vendor Bid Matrix & Scoring</h2>
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-mono font-medium text-indigo-300">
                      {activeRfq?.rfqNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    AI-weighted scoring factoring Price, Lead Time, Warranty, ESG, and Quality SLAs
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Select Event:</span>
                  <select
                    value={selectedRfqId}
                    onChange={(e) => setSelectedRfqId(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200 focus:outline-none"
                  >
                    {rfqs.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.rfqNumber} — {r.title.slice(0, 24)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bid Comparison Cards */}
              {activeBidsForCurrentRfq.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-850 p-12 text-center text-slate-400">
                  <HelpCircle className="mx-auto h-10 w-10 text-slate-600 mb-2" />
                  <p className="text-sm font-semibold text-white">No Supplier Bids Submitted Yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    This RFQ is currently waiting for vendors to submit technical proposals.
                  </p>
                  <button
                    onClick={() => {
                      if (!activeRfq) return;
                      const mockBid: VendorBid = {
                        id: `bid-${Date.now()}`,
                        rfqId: activeRfq.id,
                        vendorId: 'v-1',
                        vendorName: 'Apex Data Infrastructures',
                        unitPriceTotal: activeRfq.budget * 0.92,
                        leadTimeWeeks: 4,
                        warrantyMonths: 36,
                        esgScore: 91,
                        complianceRate: 98.5,
                        riskLevel: 'LOW',
                        aiRecommendationScore: 94,
                        keyDifferentiator: 'Direct Tier-1 allocation with accelerated QA testing and fast dispatch.',
                        quoteRef: `QU-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
                        submissionDate: new Date().toISOString().split('T')[0],
                      };
                      setBids((prev) => [mockBid, ...prev]);
                      setRfqs((prev) =>
                        prev.map((r) =>
                          r.id === activeRfq.id ? { ...r, bidsReceivedCount: r.bidsReceivedCount + 1, status: 'EVALUATION' } : r
                        )
                      );
                      showToast('Simulated Supplier Bid Received', `Apex Data submitted quote for ${activeRfq.rfqNumber}.`);
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
                  >
                    <Bot className="h-3.5 w-3.5" />
                    <span>Simulate Incoming Supplier Bids</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {activeBidsForCurrentRfq.map((bid) => {
                    const isTopScore = bid.aiRecommendationScore >= 90;
                    return (
                      <div
                        key={bid.id}
                        className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all ${
                          isTopScore
                            ? 'border-indigo-500/60 bg-gradient-to-b from-indigo-950/40 via-slate-850 to-slate-900 ring-1 ring-indigo-500/30'
                            : 'border-slate-800 bg-slate-850'
                        }`}
                      >
                        {isTopScore && (
                          <div className="absolute -top-2.5 right-4 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                            Top AI Recommendation
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-white">{bid.vendorName}</h3>
                              <span className="font-mono text-[11px] text-slate-400">{bid.quoteRef}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 uppercase">AI Score</span>
                              <p className="font-mono text-base font-bold text-emerald-400">
                                {bid.aiRecommendationScore}/100
                              </p>
                            </div>
                          </div>

                          {/* Pricing & Terms */}
                          <div className="mt-4 rounded-lg bg-slate-900/80 p-3 border border-slate-800 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Total Quote</span>
                              <span className="font-mono text-sm font-bold text-white">
                                ${bid.unitPriceTotal.toLocaleString()} USD
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Lead Time</span>
                              <span className="font-semibold text-slate-200">{bid.leadTimeWeeks} Weeks</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Warranty</span>
                              <span className="font-semibold text-slate-200">{bid.warrantyMonths} Months</span>
                            </div>
                          </div>

                          {/* ESG & Compliance Bars */}
                          <div className="mt-4 space-y-2 text-xs">
                            <div>
                              <div className="flex justify-between text-slate-400 mb-1">
                                <span>ESG Sustainability Rating</span>
                                <span className="font-bold text-slate-200">{bid.esgScore}/100</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-slate-800">
                                <div
                                  className="h-1.5 rounded-full bg-emerald-500"
                                  style={{ width: `${bid.esgScore}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-slate-400 mb-1">
                                <span>Contract SLA Compliance</span>
                                <span className="font-bold text-slate-200">{bid.complianceRate}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-slate-800">
                                <div
                                  className="h-1.5 rounded-full bg-indigo-500"
                                  style={{ width: `${bid.complianceRate}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-slate-400">Risk Assessment:</span>
                              <span
                                className={`font-semibold ${
                                  bid.riskLevel === 'LOW'
                                    ? 'text-emerald-400'
                                    : bid.riskLevel === 'MEDIUM'
                                    ? 'text-amber-400'
                                    : 'text-rose-400'
                                }`}
                              >
                                {bid.riskLevel} RISK
                              </span>
                            </div>
                          </div>

                          {/* AI Evaluation Qualitative Note */}
                          <div className="mt-4 rounded border border-slate-800 bg-slate-900/50 p-2.5 text-[11px] leading-relaxed text-slate-300">
                            <span className="font-semibold text-indigo-300">Trade-Off Note: </span>
                            {bid.keyDifferentiator}
                          </div>
                        </div>

                        {/* Award Simulator Action */}
                        <div className="mt-5 border-t border-slate-800 pt-3">
                          <button
                            onClick={() => {
                              setSelectedBidForAward(bid);
                              setIsAwardModalOpen(true);
                            }}
                            className={`w-full rounded-lg py-2 text-xs font-semibold transition-all ${
                              isTopScore
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500'
                                : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {isTopScore ? 'Simulate Contract Award' : 'Select For Formal Review'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* VIEW: VENDOR MASTER DATA */}
          {/* -------------------------------------------------- */}
          {activeTab === 'vendors' && (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Vendor Repository & Performance</h2>
                  <p className="text-xs text-slate-400">
                    Global supplier master records with real-time ESG metrics and on-time delivery audits
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={vendorTierFilter}
                    onChange={(e) => setVendorTierFilter(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="ALL">All Supplier Tiers</option>
                    <option value="TIER_1_STRATEGIC">Tier 1 Strategic</option>
                    <option value="PREFERRED">Preferred</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PROBATIONARY">Probationary</option>
                  </select>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-850 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Supplier Name</th>
                      <th className="px-4 py-3">Tier & Category</th>
                      <th className="px-4 py-3">Country</th>
                      <th className="px-4 py-3">On-Time Delivery</th>
                      <th className="px-4 py-3">Quality Score</th>
                      <th className="px-4 py-3">Annual Volume</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-white">
                          <div>{vendor.name}</div>
                          <div className="text-[11px] text-slate-400">{vendor.contactEmail}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                            {vendor.tier.replace('_', ' ')}
                          </span>
                          <div className="text-[11px] text-slate-400 mt-1">{vendor.category}</div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{vendor.country}</td>
                        <td className="px-4 py-3.5 font-mono text-emerald-400">
                          {vendor.onTimeDeliveryRate}%
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-200">
                          {vendor.qualityScore}%
                        </td>
                        <td className="px-4 py-3.5 font-mono">
                          ${vendor.annualSpendUSD.toLocaleString()} USD
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                              vendor.status === 'ACTIVE'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                            }`}
                          >
                            {vendor.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => {
                              setCopilotDrawerOpen(true);
                              handleSendPrompt(`Audit performance history and ESG risks for ${vendor.name}`);
                            }}
                            className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700"
                          >
                            Audit Vendor
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* VIEW: PURCHASE ORDERS WORKFLOW */}
          {/* -------------------------------------------------- */}
          {activeTab === 'pos' && (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Purchase Orders & Approval Controls</h2>
                  <p className="text-xs text-slate-400">
                    Verify SOX delegations, release payment vouchers, and clear single-source exception flags
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCopilotDrawerOpen(true);
                    handleSendPrompt('Audit all open purchase orders for compliance');
                  }}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
                >
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  <span>Batch Audit Ledger</span>
                </button>
              </div>

              <div className="space-y-3">
                {pos.map((po) => (
                  <div
                    key={po.id}
                    className={`rounded-xl border p-4 transition-all ${
                      po.status === 'FLAGGED'
                        ? 'border-amber-500/40 bg-slate-850 ring-1 ring-amber-500/20'
                        : 'border-slate-800 bg-slate-850'
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-white">{po.poNumber}</span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                              po.status === 'APPROVED'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : po.status === 'FLAGGED'
                                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                                : po.status === 'DISPATCHED'
                                ? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
                                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                            }`}
                          >
                            {po.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400">Terms: {po.paymentTerms}</span>
                        </div>
                        <div className="text-xs text-slate-300">
                          Supplier: <span className="font-medium text-white">{po.vendorName}</span> • Linked Requisition:{' '}
                          <span className="font-mono text-indigo-400">{po.rfqRef}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase">Commitment Value</span>
                          <p className="font-mono text-base font-bold text-white">
                            ${po.amount.toLocaleString()} {po.currency}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {po.status === 'FLAGGED' ? (
                            <button
                              onClick={() => handleResolveFlag(po.id)}
                              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-500"
                            >
                              Resolve Compliance
                            </button>
                          ) : po.status === 'PENDING_APPROVAL' ? (
                            <button
                              onClick={() => handleApprovePo(po.id)}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500"
                            >
                              Authorize PO
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                              <Check className="h-3.5 w-3.5 text-emerald-400" /> Approved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {po.complianceWarning && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-950/20 border border-rose-500/30 p-2.5 text-xs text-rose-300">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                        <div>
                          <span className="font-semibold">Audit Flag: </span>
                          {po.complianceWarning}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* 3. RIGHT AI SOURCING COPILOT (INTELLIGENCE SERVICE) */}
      {/* ========================================================= */}
      {copilotDrawerOpen && (
        <aside className="flex w-96 flex-col border-l border-slate-800 bg-slate-900/95 backdrop-blur-md shrink-0">
          {/* Copilot Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">AI Sourcing Copilot</h3>
                <p className="text-[10px] text-slate-400">
                  {useLiveGemini ? 'Gemini 3.8 Flash (Server-Side)' : 'Deterministic Simulation Engine'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCopilotDrawerOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>

          {/* Gemini Mode Toggle Bar */}
          <div className="border-b border-slate-800 bg-slate-950/50 p-2.5 text-[11px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Inference Core:</span>
              <div className="flex items-center gap-1 rounded bg-slate-800 p-0.5 border border-slate-700">
                <button
                  onClick={() => setUseLiveGemini(false)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    !useLiveGemini ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Offline Presets
                </button>
                <button
                  onClick={() => setUseLiveGemini(true)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    useLiveGemini ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Gemini Live
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span className="flex items-center gap-1 text-emerald-400">
                <Zap className="h-3 w-3" />
                <span>Zero-Latency Copilot Bridge</span>
              </span>
              <span className="text-indigo-400 font-mono">v4.2</span>
            </div>
          </div>

          {/* Chat Transcript */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'border border-slate-800 bg-slate-850 text-slate-200'
                  }`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="mb-1.5 flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                      <span className="font-bold text-indigo-400">
                        {msg.mode === 'GEMINI_LIVE' ? '✨ GEMINI 3.8 FLASH' : '🛡️ SIMULATED SOURCING AI'}
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-line text-xs">{msg.content}</div>

                  {/* Citations Footer */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 border-t border-slate-800 pt-2 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-400">Governance Evidence:</span>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside text-indigo-300">
                        {msg.citations.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* In-Message Interactive Action CTA */}
                  {msg.suggestedAction && (
                    <button
                      onClick={() => handleExecuteSuggestedAction(msg.suggestedAction)}
                      className="mt-3 flex items-center gap-1.5 rounded bg-indigo-500/20 border border-indigo-400/30 px-2.5 py-1 text-[11px] font-medium text-indigo-200 hover:bg-indigo-500/30"
                    >
                      <span>{msg.suggestedAction.label}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <span className="mt-1 px-1 text-[10px] text-slate-500">{msg.timestamp}</span>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-850 p-3 text-slate-400 text-xs">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                <span>Scanning compliance rulebooks & supplier data...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick AI Prompts Bar */}
          <div className="border-t border-slate-800 bg-slate-950/60 p-2.5">
            <p className="mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Suggested Inquiries
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSendPrompt('Compare bids for RFQ-2025-0891 and give me the best trade-off')}
                className="rounded-full border border-slate-700 bg-slate-850 px-2.5 py-1 text-[10px] text-slate-300 hover:border-indigo-500 hover:text-white"
              >
                ⚖️ Compare Bids
              </button>
              <button
                onClick={() => handleSendPrompt('Audit PO-2025-10493 compliance flag')}
                className="rounded-full border border-slate-700 bg-slate-850 px-2.5 py-1 text-[10px] text-slate-300 hover:border-indigo-500 hover:text-white"
              >
                🚨 Check PO Flag
              </button>
              <button
                onClick={() => handleSendPrompt('Show cost savings and price benchmarking')}
                className="rounded-full border border-slate-700 bg-slate-850 px-2.5 py-1 text-[10px] text-slate-300 hover:border-indigo-500 hover:text-white"
              >
                💰 Spend Analytics
              </button>
            </div>
          </div>

          {/* User Chat Input Box */}
          <div className="border-t border-slate-800 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="relative"
            >
              <input
                type="text"
                placeholder="Ask Copilot about bids, SOX rules, or RFQs..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-3 pr-9 text-xs text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isAiTyping || !chatInput.trim()}
                className="absolute right-1.5 top-1.5 rounded-md bg-indigo-600 p-1 text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </aside>
      )}

      {/* ========================================================= */}
      {/* 4. MODALS (CREATE RFQ & AWARD BID) */}
      {/* ========================================================= */}
      {/* Modal: Create Requisition */}
      {isCreateRfqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Draft New RFQ Requisition</h3>
              </div>
              <button
                onClick={() => setIsCreateRfqModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewRfq} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Requisition Title</label>
                <input
                  type="text"
                  required
                  value={newRfqTitle}
                  onChange={(e) => setNewRfqTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Liquid Cooled Data Center Pods"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newRfqCategory}
                    onChange={(e) => setNewRfqCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-200 focus:outline-none"
                  >
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Precision Machining">Precision Machining</option>
                    <option value="Facility Operations">Facility Operations</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Raw Materials">Raw Materials</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Budget (USD)</label>
                  <input
                    type="number"
                    min={1000}
                    value={newRfqBudget}
                    onChange={(e) => setNewRfqBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Requesting Department</label>
                <input
                  type="text"
                  value={newRfqDept}
                  onChange={(e) => setNewRfqDept(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-3 text-[11px] text-indigo-300 flex items-start gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                <span>
                  Our AI engine will auto-verify line-item standard tolerances and invite 3 Tier-1 approved suppliers upon publishing.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateRfqModalOpen(false)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-indigo-500"
                >
                  Publish Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Simulate Awarding Contract */}
      {isAwardModalOpen && selectedBidForAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Confirm Supplier Award Simulation</h3>
              </div>
              <button
                onClick={() => setIsAwardModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-slate-800/80 p-3.5 border border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Supplier:</span>
                  <span className="font-bold text-white">{selectedBidForAward.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Commitment:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ${selectedBidForAward.unitPriceTotal.toLocaleString()} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fulfillment Schedule:</span>
                  <span className="text-slate-200">{selectedBidForAward.leadTimeWeeks} Weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Compliance Fit:</span>
                  <span className="font-bold text-indigo-300">
                    {selectedBidForAward.aiRecommendationScore}% Optimal
                  </span>
                </div>
              </div>

              <p className="text-slate-400 text-[11px] leading-relaxed">
                Awarding this bid will automatically generate an approved Purchase Order, register the warranty milestones, and update the sourcing ledger.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-slate-800 pt-3">
              <button
                onClick={() => setIsAwardModalOpen(false)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAwardBid(selectedBidForAward)}
                className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-emerald-500"
              >
                Confirm & Generate PO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
