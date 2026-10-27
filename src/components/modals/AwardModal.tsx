import React from 'react';
import { Award, X, ShieldCheck } from 'lucide-react';
import { VendorBid } from '../../types/procurement';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] p-5 sm:p-6 shadow-2xl text-xs max-h-[92vh] overflow-y-auto touch-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE3E1] dark:border-[#24423D]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B6A4A]/10 text-[#1B6A4A] dark:bg-[#38B482]/20 dark:text-[#38B482]">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#17272A] dark:text-[#EBF1F0]">
                Authorize Supplier Contract Award
              </h3>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                Generates purchase order and initiates SOX dual-authorization workflow.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0]"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Commitment Specs */}
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-[#FAF9F6] dark:bg-[#162B27] p-4 border border-[#DDE3E1] dark:border-[#24423D] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#647A7B] dark:text-[#8BA39F]">Selected Supplier:</span>
              <span className="font-bold text-[#17272A] dark:text-[#EBF1F0]">{selectedBid.vendorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#647A7B] dark:text-[#8BA39F]">Total Commitment:</span>
              <span className="font-mono font-bold text-[#173E38] dark:text-[#4EA89A] text-sm sm:text-base">
                ${selectedBid.unitPriceTotal.toLocaleString()} USD
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#647A7B] dark:text-[#8BA39F]">Fulfillment Lead Time:</span>
              <span className="font-semibold text-[#17272A] dark:text-[#EBF1F0]">{selectedBid.leadTimeWeeks} Weeks</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#647A7B] dark:text-[#8BA39F]">Warranty Term:</span>
              <span className="font-semibold text-[#17272A] dark:text-[#EBF1F0]">{selectedBid.warrantyMonths} Months</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#647A7B] dark:text-[#8BA39F]">Evaluation Composite:</span>
              <Badge variant="primary" size="sm">
                {selectedBid.aiRecommendationScore} / 100 Score
              </Badge>
            </div>
          </div>

          <div className="rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] p-3 text-[11px] text-[#34484B] dark:text-[#C2D3CF] border border-[#DDE3E1] dark:border-[#24423D] leading-relaxed">
            <strong className="text-[#17272A] dark:text-[#EBF1F0]">Fiduciary Action: </strong>
            Executing this award simulation updates the RFQ state to <Badge variant="success" size="sm">AWARDED</Badge> and generates a formal Purchase Order routed for executive dual sign-off.
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="accent"
              size="md"
              onClick={() => onConfirmAward(selectedBid)}
              leftIcon={<ShieldCheck className="h-4 w-4" />}
            >
              Confirm Award & Route PO
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
