import React from 'react';
import { HelpCircle, Bot } from 'lucide-react';
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
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* View Header with Responsive Event Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white">Vendor Bid Matrix & Scoring</h2>
            {activeRfq && (
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-mono font-medium text-indigo-300">
                {activeRfq.rfqNumber}
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400">
            AI-weighted scoring factoring Price, Lead Time, Warranty, ESG, and Quality SLAs
          </p>
        </div>

        {/* Event Selector Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Requisition:</span>
          <select
            value={selectedRfqId}
            onChange={(e) => setSelectedRfqId(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[44px]"
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
        <div className="rounded-xl border border-slate-800 bg-slate-850 p-8 sm:p-12 text-center text-slate-400">
          <HelpCircle className="mx-auto h-10 w-10 text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-white">No Supplier Bids Submitted Yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            This RFQ is currently waiting for vendors to submit commercial & technical proposals.
          </p>
          <button
            onClick={onSimulateIncomingBids}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 active:scale-98 transition-all min-h-[44px]"
          >
            <Bot className="h-4 w-4" />
            <span>Simulate Incoming Supplier Bids</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {activeBids.map((bid) => {
            const isTopScore = bid.aiRecommendationScore >= 90;
            return (
              <div
                key={bid.id}
                className={`relative flex flex-col justify-between rounded-xl border p-4 sm:p-5 transition-all ${
                  isTopScore
                    ? 'border-indigo-500/60 bg-gradient-to-b from-indigo-950/40 via-slate-850 to-slate-900 ring-1 ring-indigo-500/30 shadow-lg'
                    : 'border-slate-800 bg-slate-850 shadow-sm'
                }`}
              >
                {isTopScore && (
                  <div className="absolute -top-2.5 right-4 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Top AI Recommendation
                  </div>
                )}

                <div>
                  {/* Vendor Name & AI Score */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">{bid.vendorName}</h3>
                      <span className="font-mono text-[11px] text-slate-400">{bid.quoteRef}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">AI Score</span>
                      <p className="font-mono text-base font-bold text-emerald-400 leading-tight">
                        {bid.aiRecommendationScore}/100
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Terms Box */}
                  <div className="mt-3.5 rounded-lg bg-slate-900/80 p-3 border border-slate-800 space-y-2 text-xs">
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

                  {/* ESG & Compliance Progress Bars */}
                  <div className="mt-3.5 space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                        <span>ESG Sustainability Rating</span>
                        <span className="font-bold text-slate-200">{bid.esgScore}/100</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800">
                        <div
                          className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${bid.esgScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                        <span>Contract SLA Compliance</span>
                        <span className="font-bold text-slate-200">{bid.complianceRate}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800">
                        <div
                          className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
                          style={{ width: `${bid.complianceRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400 text-[11px]">Risk Assessment:</span>
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

                  {/* Qualitative AI Trade-Off Note */}
                  <div className="mt-3.5 rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-[11px] leading-relaxed text-slate-300">
                    <span className="font-semibold text-indigo-300">Trade-Off Note: </span>
                    {bid.keyDifferentiator}
                  </div>
                </div>

                {/* Award Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => onSelectBidForAward(bid)}
                    className={`w-full rounded-lg py-2.5 text-xs font-semibold transition-all min-h-[44px] flex items-center justify-center active:scale-98 ${
                      isTopScore
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500'
                        : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
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
