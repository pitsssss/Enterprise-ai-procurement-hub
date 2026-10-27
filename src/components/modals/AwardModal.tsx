import React from 'react';
import { Award, X } from 'lucide-react';
import { VendorBid } from '../../types/procurement';

interface AwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBid: VendorBid | null;
  onConfirmAward: (bid: VendorBid) => void;
}

export const AwardModal: React.FC<AwardModalProps> = ({
  isOpen,
  onClose,
  selectedBid,
  onConfirmAward,
}) => {
  if (!isOpen || !selectedBid) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl text-xs max-h-[92vh] overflow-y-auto touch-scroll">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Award className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white">Confirm Supplier Award Simulation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Commitment Specs */}
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Selected Supplier:</span>
              <span className="font-bold text-white text-xs sm:text-sm">{selectedBid.vendorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Commitment:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm sm:text-base">
                ${selectedBid.unitPriceTotal.toLocaleString()} USD
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Fulfillment Schedule:</span>
              <span className="text-slate-200 font-semibold">{selectedBid.leadTimeWeeks} Weeks</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">AI Compliance Fit:</span>
              <span className="font-bold text-indigo-300">
                {selectedBid.aiRecommendationScore}% Optimal
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Awarding this bid will automatically generate an approved Purchase Order, register warranty milestones, and update the sourcing ledger.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 mt-5 border-t border-slate-800 pt-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 active:scale-98 transition-all min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmAward(selectedBid)}
            className="w-full sm:w-auto rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-500 active:scale-98 transition-all min-h-[44px]"
          >
            Confirm & Generate PO
          </button>
        </div>
      </div>
    </div>
  );
};
