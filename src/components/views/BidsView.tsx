import React, { useState } from 'react';
import {
  HelpCircle,
  Bot,
  Award,
  ChevronDown,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { RFQ, VendorBid } from '../../types/procurement';

interface BidsViewProps {
  rfqs: RFQ[];
  activeRfq: RFQ | undefined;
  selectedRfqId: string;
  setSelectedRfqId: (id: string) => void;
  activeBids: VendorBid[];
  onSelectBidForAward: (bid: VendorBid) => void;
  onSimulateIncomingBids: () => void;
}

export const BidsView: React.FC<BidsViewProps> = ({
  rfqs,
  activeRfq,
  selectedRfqId,
  setSelectedRfqId,
  activeBids,
  onSelectBidForAward,
  onSimulateIncomingBids,
}) => {
  // Track expanded breakdown on mobile
  const [expandedBidIds, setExpandedBidIds] = useState<Record<string, boolean>>({});

  const toggleBidDetails = (bidId: string) => {
    setExpandedBidIds((prev) => ({
      ...prev,
      [bidId]: !prev[bidId],
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header and RFQ Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
              Vendor Bid Matrix
            </h1>
            {activeRfq && (
              <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-mono font-bold text-indigo-300">
                {activeRfq.rfqNumber}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-attribute scoring factoring price, lead time, ESG, warranty and SLA compliance
          </p>
        </div>

        {/* Dropdown Requisition Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="rfq-select" className="text-xs text-slate-400 font-semibold shrink-0">
            Requisition:
          </label>
          <select
            id="rfq-select"
            value={selectedRfqId}
            onChange={(e) => setSelectedRfqId(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-850 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[44px]"
          >
            {rfqs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.rfqNumber} — {r.title.slice(0, 24)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      {activeBids.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 sm:p-12 text-center text-slate-400">
          <HelpCircle className="mx-auto h-10 w-10 text-slate-600 mb-2" />
          <h2 className="text-sm font-bold text-white">No Supplier Bids Submitted Yet</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            This RFQ is currently waiting for vendors to submit commercial & technical proposals.
          </p>
          <button
            onClick={onSimulateIncomingBids}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 active:scale-98 transition-all min-h-[44px]"
          >
            <Bot className="h-4 w-4" />
            <span>Simulate Incoming Supplier Bids</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {activeBids.map((bid) => {
            const isTopScore = bid.aiRecommendationScore >= 90;
            const isDetailsExpanded = expandedBidIds[bid.id] ?? true; // expanded by default on desktop, toggleable

            return (
              <div
                key={bid.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all ${
                  isTopScore
                    ? 'border-indigo-500/60 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 ring-1 ring-indigo-500/30 shadow-xl'
                    : 'border-slate-800 bg-slate-900/90 shadow-sm'
                }`}
              >
                {/* Top Recommendation Badge */}
                {isTopScore && (
                  <div className="absolute -top-3 right-4 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md shadow-indigo-600/40 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Top Recommendation</span>
                  </div>
                )}

                <div>
                  {/* Supplier Info & Composite Score */}
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                        {bid.vendorName}
                      </h2>
                      <span className="font-mono text-[11px] text-slate-400">{bid.quoteRef}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                        <span className="font-mono text-lg font-bold text-emerald-400 leading-none">
                          {bid.aiRecommendationScore}
                          <span className="text-xs text-slate-500 font-normal">/100</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Core Commercials Box */}
                  <div className="mt-3.5 rounded-xl bg-slate-950/80 p-3 border border-slate-800/90 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total Quote:</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-white">
                        ${bid.unitPriceTotal.toLocaleString()} USD
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Fulfillment Schedule:</span>
                      <span
                        className={`font-semibold ${
                          bid.leadTimeWeeks <= 4
                            ? 'text-emerald-400'
                            : bid.leadTimeWeeks > 6
                            ? 'text-amber-400'
                            : 'text-slate-200'
                        }`}
                      >
                        {bid.leadTimeWeeks} Weeks
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Warranty Coverage:</span>
                      <span className="font-semibold text-slate-200">{bid.warrantyMonths} Months</span>
                    </div>
                  </div>

                  {/* Progressive Disclosure: ESG, Compliance & Risk */}
                  <div className="mt-3">
                    <button
                      onClick={() => toggleBidDetails(bid.id)}
                      className="md:hidden flex w-full items-center justify-between py-1 text-xs text-slate-400 hover:text-slate-200"
                    >
                      <span className="font-medium">ESG & Compliance Breakdown</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isDetailsExpanded ? 'rotate-180 text-indigo-400' : ''
                        }`}
                      />
                    </button>

                    {isDetailsExpanded && (
                      <div className="mt-2 space-y-2.5 text-xs pt-2 border-t border-slate-800/70 md:border-t-0 md:pt-0">
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>ESG Sustainability Rating</span>
                            <span className="font-bold text-slate-200">{bid.esgScore}/100</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-800">
                            <div
                              className="h-1.5 rounded-full bg-emerald-500"
                              style={{ width: `${bid.esgScore}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Contract SLA Adherence</span>
                            <span className="font-bold text-slate-200">{bid.complianceRate}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-800">
                            <div
                              className="h-1.5 rounded-full bg-indigo-500"
                              style={{ width: `${bid.complianceRate}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-[11px] text-slate-400">Risk Assessment:</span>
                          <span
                            className={`text-[11px] font-bold ${
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
                    )}
                  </div>

                  {/* AI Evaluation Qualitative Note */}
                  <div className="mt-3.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] leading-relaxed text-slate-300">
                    <span className="font-bold text-indigo-300">Trade-Off Analysis: </span>
                    {bid.keyDifferentiator}
                  </div>
                </div>

                {/* Primary Award Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => onSelectBidForAward(bid)}
                    className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all min-h-[44px] flex items-center justify-center active:scale-98 ${
                      isTopScore
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500'
                        : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
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
  );
};
