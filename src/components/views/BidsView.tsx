import React from 'react';
import { useTranslation } from 'react-i18next';
import { RFQ, VendorBid } from '../../types/procurement';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency, formatNumber } from '../../lib/formatters';
import {
  Award,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  FileCheck,
  Scale,
  Plus,
} from 'lucide-react';

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
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DDE3E1] dark:border-[#24423D] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
            {t('bids.title')}
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
            {t('bids.subtitle')}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onSimulateIncomingBids}
          leftIcon={<Plus className="h-4 w-4 text-[#C17C43] dark:text-[#D48D55]" />}
        >
          {isArabic ? 'محاكاة استلام عرض إضافي' : 'Simulate Incoming Quote'}
        </Button>
      </div>

      {/* 2. RFQ Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto touch-scroll scrollbar-none py-1">
        {rfqs.map((rfq) => {
          const isSelected = rfq.id === selectedRfqId;
          return (
            <button
              key={rfq.id}
              onClick={() => setSelectedRfqId(rfq.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 select-none min-h-[38px] text-left rtl:text-right border ${
                isSelected
                  ? 'border-[#173E38] bg-[#173E38] text-white dark:border-[#2E7A6F] dark:bg-[#2E7A6F] shadow-2xs font-semibold'
                  : 'border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F] hover:bg-[#FAF9F6] dark:hover:bg-[#1D3732]'
              }`}
            >
              <span className="block font-mono text-[10px] opacity-80" dir="ltr">{rfq.rfqNumber}</span>
              <span className="truncate max-w-[180px] block">{rfq.title}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Active RFQ Target & Constraints Summary Bar */}
      {activeRfq && (
        <Card padding="md" className="bg-[#FAF9F6] dark:bg-[#162B27] border-[#DDE3E1] dark:border-[#24423D]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#173E38] dark:text-[#4EA89A]" dir="ltr">
                  {activeRfq.rfqNumber}
                </span>
                <Badge variant="primary" size="sm">{t(`categories.${activeRfq.category}`, { defaultValue: activeRfq.category })}</Badge>
                <Badge variant="default" size="sm">{activeRfq.department}</Badge>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[#17272A] dark:text-[#EBF1F0]">
                {activeRfq.title}
              </h2>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                {t('rfq.colBudget')}: <strong className="text-[#17272A] dark:text-[#EBF1F0]">{formatCurrency(activeRfq.budget)}</strong> • {t('rfq.lineItems')}: {activeRfq.lineItems.length} {isArabic ? 'بنود' : 'SKUs'}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs shrink-0">
              <div className="text-right rtl:text-left">
                <span className="text-[#647A7B] dark:text-[#8BA39F] block text-[10px]">{t('rfq.colBids')}</span>
                <span className="text-base font-bold tabular-nums text-[#173E38] dark:text-[#4EA89A]">
                  {activeBids.length} {isArabic ? 'عروض مسجلة' : 'Proposals'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 4. Comparative Bid Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeBids.map((bid) => {
          const isTopRecommended = bid.aiRecommendationScore >= 92;
          const varianceUnderBudget = activeRfq ? activeRfq.budget - bid.unitPriceTotal : 0;
          const isUnderBudget = varianceUnderBudget >= 0;

          return (
            <Card
              key={bid.id}
              padding="md"
              className={`flex flex-col justify-between space-y-4 relative ${
                isTopRecommended
                  ? 'border-2 border-[#173E38] dark:border-[#2E7A6F] shadow-sm'
                  : 'border-[#DDE3E1] dark:border-[#24423D]'
              }`}
            >
              {isTopRecommended && (
                <div className="absolute -top-3 left-4 rtl:left-auto rtl:right-4">
                  <Badge variant="primary" size="sm" dot>
                    {isArabic ? 'العرض الأفضل توصية' : 'Top Recommended Offer'}
                  </Badge>
                </div>
              )}

              <div className="space-y-3 pt-1">
                {/* Vendor Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#17272A] dark:text-[#EBF1F0]">
                      {bid.vendorName}
                    </h3>
                    <p className="font-mono text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                      <bdi dir="ltr">{bid.quoteRef}</bdi>
                    </p>
                  </div>

                  <div className="text-right rtl:text-left">
                    <span className="inline-flex items-center gap-1 text-sm font-bold tabular-nums text-[#173E38] dark:text-[#4EA89A]">
                      <Sparkles className="h-3.5 w-3.5 text-[#C17C43] dark:text-[#D48D55]" />
                      <span>{bid.aiRecommendationScore}</span>
                      <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">/ 100</span>
                    </span>
                    <span className="block text-[9px] uppercase tracking-wider text-[#647A7B] dark:text-[#8BA39F] font-semibold">
                      {t('bids.colScore')}
                    </span>
                  </div>
                </div>

                {/* Quoted Commitment */}
                <div className="rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] p-3 border border-[#DDE3E1] dark:border-[#24423D]">
                  <span className="text-[10px] uppercase font-semibold text-[#647A7B] dark:text-[#8BA39F] tracking-wider block">
                    {t('bids.colTotal')}
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-bold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                      {formatCurrency(bid.unitPriceTotal)}
                    </span>
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        isUnderBudget
                          ? 'text-[#1B6A4A] dark:text-[#38B482]'
                          : 'text-[#A22424] dark:text-[#EA5454]'
                      }`}
                    >
                      {isUnderBudget
                        ? `-${formatCurrency(Math.abs(varianceUnderBudget))} ${isArabic ? 'أقل من السقف' : 'Under'}`
                        : `+${formatCurrency(Math.abs(varianceUnderBudget))} ${isArabic ? 'تجاوز الميزانية' : 'Over'}`}
                    </span>
                  </div>
                </div>

                {/* Evaluation Criteria Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E]">
                    <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F] block">{t('bids.colLead')}</span>
                    <span className="font-bold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                      {bid.leadTimeWeeks} {t('bids.weeks')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E]">
                    <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F] block">{t('bids.colWarranty')}</span>
                    <span className="font-bold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                      {bid.warrantyMonths} {t('bids.months')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E]">
                    <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F] block">{t('bids.colEsg')}</span>
                    <span className="font-bold tabular-nums text-[#173E38] dark:text-[#4EA89A]">
                      {bid.esgScore} / 100
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E]">
                    <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F] block">{t('bids.colRisk')}</span>
                    <Badge
                      variant={
                        bid.riskLevel === 'LOW'
                          ? 'success'
                          : bid.riskLevel === 'MEDIUM'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {t(`status.${bid.riskLevel}`, bid.riskLevel)}
                    </Badge>
                  </div>
                </div>

                {/* Strategic Evaluation Rationale */}
                <div className="rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] p-2.5 text-[11px] text-[#34484B] dark:text-[#C2D3CF] border border-[#DDE3E1] dark:border-[#24423D] leading-relaxed">
                  <strong className="text-[#17272A] dark:text-[#EBF1F0]">{t('bids.colDiff')}: </strong>
                  {bid.keyDifferentiator}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  variant={isTopRecommended ? 'primary' : 'secondary'}
                  size="md"
                  fullWidth
                  onClick={() => onSelectBidForAward(bid)}
                  rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}
                >
                  {t('bids.awardAction')}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
