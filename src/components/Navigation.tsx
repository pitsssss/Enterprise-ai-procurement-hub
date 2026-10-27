import React from 'react';
import {
  FileText,
  ShoppingCart,
  TrendingUp,
  LayoutDashboard,
  Award,
  Building2,
  Sparkles,
  Plus,
  Search,
  X,
  Bot,
} from 'lucide-react';

export type TabType = 'overview' | 'rfqs' | 'bids' | 'vendors' | 'pos';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  rfqsCount: number;
  vendorsCount: number;
  flaggedPosCount: number;
  onOpenCreateRfq: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileSearchOpen: boolean;
  setIsMobileSearchOpen: (open: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  rfqsCount,
  vendorsCount,
  flaggedPosCount,
  onOpenCreateRfq,
  onToggleCopilot,
  isCopilotOpen,
  searchQuery,
  setSearchQuery,
  isMobileSearchOpen,
  setIsMobileSearchOpen,
}) => {
  const getSectionTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Dashboard';
      case 'rfqs':
        return `RFQs (${rfqsCount})`;
      case 'bids':
        return 'Bid Matrix';
      case 'vendors':
        return `Vendors (${vendorsCount})`;
      case 'pos':
        return flaggedPosCount > 0 ? `Orders (${flaggedPosCount} Flag)` : 'Purchase Orders';
      default:
        return 'Sourcing';
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP SIDEBAR (Visible ONLY on md+ screens >= 768px) */}
      {/* ========================================================= */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-900/95 shrink-0 h-full">
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
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{rfqsCount}</span>
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
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{vendorsCount}</span>
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
      {/* 2. MOBILE TOP APP BAR (Visible ONLY on <= 767px mobile) */}
      {/* ========================================================= */}
      <header className="md:hidden sticky top-0 z-30 flex flex-col w-full border-b border-slate-800/90 bg-slate-900/95 backdrop-blur-md shrink-0">
        <div className="flex h-14 items-center justify-between px-3.5 sm:px-4">
          {/* Brand & Section Indicator */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/30 shrink-0">
              <Sparkles className="h-4 w-4 text-indigo-100" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-tight text-white truncate">Synthetix</span>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[9px] font-bold text-indigo-300 border border-indigo-500/30">
                  AI Hub
                </span>
              </div>
              <p className="text-[11px] font-semibold text-indigo-400 truncate leading-tight">
                {getSectionTitle()}
              </p>
            </div>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all ${
                isMobileSearchOpen || searchQuery
                  ? 'border-indigo-500/50 bg-indigo-600/20 text-indigo-300 shadow-sm'
                  : 'border-slate-800 bg-slate-850 text-slate-400 active:bg-slate-800'
              }`}
              aria-label="Toggle search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Quick Requisition Create Button */}
            <button
              onClick={onOpenCreateRfq}
              className="flex items-center justify-center gap-1 rounded-xl bg-indigo-600 px-3 h-10 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 active:scale-95 transition-all"
              aria-label="Create requisition"
            >
              <Plus className="h-4 w-4" />
              <span>RFQ</span>
            </button>
          </div>
        </div>

        {/* Expandable Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="px-3.5 pb-2.5 pt-1 border-t border-slate-800/60 bg-slate-950/80 animate-in fade-in duration-150">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Search RFQs, suppliers, line items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-850 py-2 pl-9 pr-9 text-xs text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-slate-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Visible on <= 767px screens) */}
      {/* ========================================================= */}
      <nav
        role="navigation"
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-800/90 bg-slate-900/98 backdrop-blur-xl pb-safe pt-1 text-[11px] font-medium text-slate-400 shadow-2xl"
      >
        {/* 1. Dashboard View */}
        <button
          onClick={() => setActiveTab('overview')}
          aria-current={activeTab === 'overview' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all ${
            activeTab === 'overview'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200 active:text-indigo-300'
          }`}
        >
          {activeTab === 'overview' && (
            <span className="absolute top-0 h-0.5 w-6 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
          )}
          <LayoutDashboard className="h-5 w-5 mb-0.5 shrink-0" />
          <span className="tracking-tight text-[10px] sm:text-[11px]">Dashboard</span>
        </button>

        {/* 2. RFQs View */}
        <button
          onClick={() => setActiveTab('rfqs')}
          aria-current={activeTab === 'rfqs' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all ${
            activeTab === 'rfqs'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200 active:text-indigo-300'
          }`}
        >
          {activeTab === 'rfqs' && (
            <span className="absolute top-0 h-0.5 w-6 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
          )}
          <div className="relative">
            <FileText className="h-5 w-5 mb-0.5 shrink-0" />
            <span className="absolute -top-1 -right-2.5 rounded-full bg-slate-800 border border-slate-700 px-1 py-0.2 text-[9px] font-semibold text-slate-200">
              {rfqsCount}
            </span>
          </div>
          <span className="tracking-tight text-[10px] sm:text-[11px]">RFQs</span>
        </button>

        {/* 3. Bids View */}
        <button
          onClick={() => setActiveTab('bids')}
          aria-current={activeTab === 'bids' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all ${
            activeTab === 'bids'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200 active:text-indigo-300'
          }`}
        >
          {activeTab === 'bids' && (
            <span className="absolute top-0 h-0.5 w-6 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
          )}
          <div className="relative">
            <Award className="h-5 w-5 mb-0.5 shrink-0" />
            <span className="absolute -top-0.5 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-pulse ring-2 ring-slate-900" />
          </div>
          <span className="tracking-tight text-[10px] sm:text-[11px]">Bids</span>
        </button>

        {/* 4. Vendors View */}
        <button
          onClick={() => setActiveTab('vendors')}
          aria-current={activeTab === 'vendors' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all ${
            activeTab === 'vendors'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200 active:text-indigo-300'
          }`}
        >
          {activeTab === 'vendors' && (
            <span className="absolute top-0 h-0.5 w-6 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
          )}
          <Building2 className="h-5 w-5 mb-0.5 shrink-0" />
          <span className="tracking-tight text-[10px] sm:text-[11px]">Vendors</span>
        </button>

        {/* 5. POs View */}
        <button
          onClick={() => setActiveTab('pos')}
          aria-current={activeTab === 'pos' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all ${
            activeTab === 'pos'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200 active:text-indigo-300'
          }`}
        >
          {activeTab === 'pos' && (
            <span className="absolute top-0 h-0.5 w-6 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
          )}
          <div className="relative">
            <ShoppingCart className="h-5 w-5 mb-0.5 shrink-0" />
            {flaggedPosCount > 0 && (
              <span className="absolute -top-1 -right-2.5 rounded-full bg-amber-500/30 border border-amber-500/60 px-1 text-[9px] font-bold text-amber-300 leading-none py-0.5">
                {flaggedPosCount}
              </span>
            )}
          </div>
          <span className="tracking-tight text-[10px] sm:text-[11px]">POs</span>
        </button>
      </nav>
    </>
  );
};
