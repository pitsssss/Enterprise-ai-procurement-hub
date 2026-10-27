import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Bot,
  Search,
  Plus,
  Sparkles,
} from 'lucide-react';

import { RFQ, VendorBid, Vendor, PurchaseOrder, ChatMessage, RFQStatus } from './types/procurement';
import { INITIAL_RFQS, INITIAL_BIDS, INITIAL_VENDORS, INITIAL_POS } from './data/mockData';
import { ProcurementAIService } from './services/aiService';

import { Navigation, TabType } from './components/Navigation';
import { AiCopilotDrawer } from './components/AiCopilotDrawer';
import { OverviewView } from './components/views/OverviewView';
import { RfqsView } from './components/views/RfqsView';
import { BidsView } from './components/views/BidsView';
import { VendorsView } from './components/views/VendorsView';
import { PosView } from './components/views/PosView';
import { CreateRfqModal } from './components/modals/CreateRfqModal';
import { AwardModal } from './components/modals/AwardModal';

export default function App() {
  // Core Application Data State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [bids, setBids] = useState<VendorBid[]>(INITIAL_BIDS);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [pos, setPos] = useState<PurchaseOrder[]>(INITIAL_POS);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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

  // AI Copilot State (Default closed on mobile, open on desktop)
  const [copilotDrawerOpen, setCopilotDrawerOpen] = useState(false);
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
        r.rfqNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = rfqCategoryFilter === 'ALL' || r.category === rfqCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [rfqs, searchQuery, rfqCategoryFilter]);

  // Filtered Vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = vendorTierFilter === 'ALL' || v.tier === vendorTierFilter;
      return matchesSearch && matchesTier;
    });
  }, [vendors, searchQuery, vendorTierFilter]);

  // Key Calculations
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

    // Open Copilot when a prompt is dispatched
    setCopilotDrawerOpen(true);

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
      setCopilotDrawerOpen(false); // Close mobile copilot so user sees the new tab
    } else if (action.actionType === 'OPEN_COMPARISON') {
      setSelectedRfqId(action.payload);
      setActiveTab('bids');
      setCopilotDrawerOpen(false);
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
    <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* ========================================================= */}
      {/* 1. NAVIGATION (Desktop Sidebar + Mobile Top App Bar + Bottom Nav) */}
      {/* ========================================================= */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        rfqsCount={rfqs.length}
        vendorsCount={vendors.length}
        flaggedPosCount={flaggedPosCount}
        onOpenCreateRfq={() => setIsCreateRfqModalOpen(true)}
        onToggleCopilot={() => setCopilotDrawerOpen(!copilotDrawerOpen)}
        isCopilotOpen={copilotDrawerOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobileSearchOpen={isMobileSearchOpen}
        setIsMobileSearchOpen={setIsMobileSearchOpen}
      />

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE VIEWPORT */}
      {/* ========================================================= */}
      <main className="flex flex-1 flex-col overflow-hidden bg-slate-950 md:bg-slate-900/40 min-w-0">
        {/* Desktop Top Header Bar (Hidden on <= 767px Mobile) */}
        <header className="hidden md:flex h-16 items-center justify-between border-b border-slate-800 px-6 backdrop-blur-md bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search RFQs, suppliers, line items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-[11px]">
                FY-2025 Global Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateRfqModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 active:scale-98 transition-all min-h-[38px]"
            >
              <Plus className="h-4 w-4" />
              <span>Create Requisition</span>
            </button>

            <button
              onClick={() => setCopilotDrawerOpen(!copilotDrawerOpen)}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                copilotDrawerOpen
                  ? 'border-indigo-500/50 bg-indigo-600/20 text-indigo-300 shadow-sm shadow-indigo-500/20'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Bot className="h-4 w-4 text-indigo-400" />
              <span>AI Copilot</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>
        </header>

        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed top-16 sm:top-20 left-3 right-3 sm:left-auto sm:right-8 sm:w-auto z-50 flex items-center gap-3 rounded-2xl border border-indigo-500/40 bg-slate-900/95 p-3.5 sm:p-4 text-xs shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200 max-w-md">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-white text-xs sm:text-sm">{toastMessage.title}</p>
              <p className="text-slate-300 mt-0.5 text-[11px] sm:text-xs leading-relaxed">{toastMessage.desc}</p>
            </div>
          </div>
        )}

        {/* Content Body View Manager (With extra bottom padding for mobile bottom bar + FAB) */}
        <div className="flex-1 overflow-y-auto touch-scroll p-3.5 sm:p-6 pb-28 md:pb-6 min-w-0">
          {activeTab === 'overview' && (
            <OverviewView
              rfqs={rfqs}
              pos={pos}
              totalPipelineSpend={totalPipelineSpend}
              flaggedPosCount={flaggedPosCount}
              onSelectRfqForBids={(rfqId) => {
                setSelectedRfqId(rfqId);
                setActiveTab('bids');
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSendPrompt={handleSendPrompt}
              onResolveFlag={handleResolveFlag}
            />
          )}

          {activeTab === 'rfqs' && (
            <RfqsView
              filteredRfqs={filteredRfqs}
              activeRfq={activeRfq}
              selectedRfqId={selectedRfqId}
              setSelectedRfqId={setSelectedRfqId}
              rfqCategoryFilter={rfqCategoryFilter}
              setRfqCategoryFilter={setRfqCategoryFilter}
              onOpenCreateModal={() => setIsCreateRfqModalOpen(true)}
              onEvaluateBids={(rfqId) => {
                setSelectedRfqId(rfqId);
                setActiveTab('bids');
              }}
              onSendPrompt={handleSendPrompt}
            />
          )}

          {activeTab === 'bids' && (
            <BidsView
              rfqs={rfqs}
              activeRfq={activeRfq}
              selectedRfqId={selectedRfqId}
              setSelectedRfqId={setSelectedRfqId}
              activeBids={activeBidsForCurrentRfq}
              onSelectBidForAward={(bid) => {
                setSelectedBidForAward(bid);
                setIsAwardModalOpen(true);
              }}
              onSimulateIncomingBids={() => {
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
                    r.id === activeRfq.id
                      ? { ...r, bidsReceivedCount: r.bidsReceivedCount + 1, status: 'EVALUATION' }
                      : r
                  )
                );
                showToast('Simulated Supplier Bid Received', `Apex Data submitted quote for ${activeRfq.rfqNumber}.`);
              }}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorsView
              filteredVendors={filteredVendors}
              vendorTierFilter={vendorTierFilter}
              setVendorTierFilter={setVendorTierFilter}
              onAuditVendor={(vendorName) => {
                handleSendPrompt(`Audit performance history and ESG risks for ${vendorName}`);
              }}
            />
          )}

          {activeTab === 'pos' && (
            <PosView
              pos={pos}
              onApprovePo={handleApprovePo}
              onResolveFlag={handleResolveFlag}
              onBatchAudit={() => {
                handleSendPrompt('Audit all open purchase orders for compliance');
              }}
            />
          )}
        </div>

        {/* Floating AI Copilot Trigger for Mobile (< md screens) */}
        <div className="md:hidden fixed bottom-20 right-4 z-30">
          <button
            onClick={() => setCopilotDrawerOpen(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-600/40 border border-indigo-400/40 active:scale-95 transition-all"
            aria-label="Open AI Copilot Chat"
          >
            <Sparkles className="h-4 w-4 text-indigo-100" />
            <span>AI Copilot</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 3. AI SOURCING COPILOT (Full-screen sheet on mobile, right drawer on desktop) */}
      {/* ========================================================= */}
      <AiCopilotDrawer
        isOpen={copilotDrawerOpen}
        onClose={() => setCopilotDrawerOpen(false)}
        chatMessages={chatMessages}
        isAiTyping={isAiTyping}
        chatInput={chatInput}
        setChatInput={setChatInput}
        onSendPrompt={handleSendPrompt}
        onExecuteSuggestedAction={handleExecuteSuggestedAction}
        useLiveGemini={useLiveGemini}
        setUseLiveGemini={setUseLiveGemini}
      />

      {/* ========================================================= */}
      {/* 4. MODALS (CREATE RFQ & AWARD BID) */}
      {/* ========================================================= */}
      <CreateRfqModal
        isOpen={isCreateRfqModalOpen}
        onClose={() => setIsCreateRfqModalOpen(false)}
        title={newRfqTitle}
        setTitle={setNewRfqTitle}
        category={newRfqCategory}
        setCategory={setNewRfqCategory}
        budget={newRfqBudget}
        setBudget={setNewRfqBudget}
        department={newRfqDept}
        setDepartment={setNewRfqDept}
        onSubmit={handleCreateNewRfq}
      />

      <AwardModal
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
        selectedBid={selectedBidForAward}
        onConfirmAward={handleAwardBid}
      />
    </div>
  );
}
