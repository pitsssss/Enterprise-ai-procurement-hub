import React from 'react';
import {
  FileText,
  ShoppingCart,
  TrendingUp,
  Award,
  Building2,
  Sparkles,
  Bot,
  Plus,
  Search,
  X,
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
  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP SIDEBAR (Visible on md+ screens) */}
      {/* ========================================================= */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-900/95 shrink-0">
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
      {/* 2. MOBILE TOP HEADER (Visible on <md screens) */}
      {/* ========================================================= */}
      <header className="md:hidden sticky top-0 z-30 flex flex-col border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="h-4 w-4 text-indigo-100" />
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-wide text-white leading-none">Synthetix</h1>
              <p className="text-[10px] font-medium text-indigo-400 leading-tight">Sourcing AI</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`p-2 rounded-lg border transition-colors ${
                isMobileSearchOpen || searchQuery
                  ? 'border-indigo-500/50 bg-indigo-600/20 text-indigo-300'
                  : 'border-slate-800 bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Toggle search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Quick Create RFQ Action */}
            <button
              onClick={onOpenCreateRfq}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-500 active:scale-95 transition-all"
              aria-label="Create new requisition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New RFQ</span>
            </button>

            {/* AI Copilot Mobile Trigger */}
            <button
              onClick={onToggleCopilot}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                isCopilotOpen
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'border-indigo-500/40 bg-indigo-600/20 text-indigo-300 active:scale-95'
              }`}
              aria-label="Open AI Copilot"
            >
              <Bot className="h-3.5 w-3.5 text-indigo-200" />
              <span className="font-semibold">AI Copilot</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="px-3 pb-2.5 pt-1 border-t border-slate-800/60 bg-slate-950/60 animate-in fade-in duration-150">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search RFQs, vendors, line items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-850 py-1.5 pl-9 pr-8 text-xs text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Visible on <md screens) */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg pb-safe pt-1 text-[11px] font-medium text-slate-400 shadow-2xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] transition-colors ${
            activeTab === 'overview' ? 'text-indigo-400 font-bold' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <TrendingUp className="h-5 w-5 mb-0.5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('rfqs')}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] transition-colors ${
            activeTab === 'rfqs' ? 'text-indigo-400 font-bold' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <FileText className="h-5 w-5 mb-0.5" />
          <span>RFQs</span>
          <span className="absolute top-1 right-3 rounded-full bg-slate-800 px-1 py-0.2 text-[9px] text-slate-300">
            {rfqsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bids')}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] transition-colors ${
            activeTab === 'bids' ? 'text-indigo-400 font-bold' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <Award className="h-5 w-5 mb-0.5" />
          <span>Bids</span>
          <span className="absolute top-1.5 right-4 h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] transition-colors ${
            activeTab === 'vendors' ? 'text-indigo-400 font-bold' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <Building2 className="h-5 w-5 mb-0.5" />
          <span>Vendors</span>
        </button>

        <button
          onClick={() => setActiveTab('pos')}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] transition-colors ${
            activeTab === 'pos' ? 'text-indigo-400 font-bold' : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <ShoppingCart className="h-5 w-5 mb-0.5" />
          <span>Orders</span>
          {flaggedPosCount > 0 && (
            <span className="absolute top-1 right-2.5 rounded-full bg-amber-500/30 border border-amber-500/50 px-1 text-[9px] font-bold text-amber-300">
              {flaggedPosCount}
            </span>
          )}
        </button>
      </nav>
    </>
  );
};
