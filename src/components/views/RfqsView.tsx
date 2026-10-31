import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RFQ } from '../../types/procurement';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency, formatNumber } from '../../lib/formatters';
import {
  FileText,
  Plus,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  Building,
} from 'lucide-react';

interface RfqsViewProps {
  rfqs: RFQ[];
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  onOpenCreateModal: () => void;
  onEvaluateBids: (rfqId: string) => void;
  onSendPrompt: (prompt: string) => void;
}

export const RfqsView: React.FC<RfqsViewProps> = ({
  rfqs,
  categoryFilter,
  setCategoryFilter,
  onOpenCreateModal,
  onEvaluateBids,
  onSendPrompt,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [expandedRfqId, setExpandedRfqId] = useState<string | null>('rfq-101');

  const categories = [
    { id: 'ALL', label: t('rfq.categoryFilter') },
    { id: 'IT Hardware', label: isArabic ? 'أجهزة تقنية المعلومات' : 'IT Hardware' },
    { id: 'Precision Machining', label: isArabic ? 'التشغيل الدقيق والمعادن' : 'Precision Machining' },
    { id: 'Facility Operations', label: isArabic ? 'عمليات المرافق والتشغيل' : 'Facility Operations' },
    { id: 'Logistics', label: isArabic ? 'الخدمات اللوجستية والشحن' : 'Logistics' },
    { id: 'Raw Materials', label: isArabic ? 'المواد الخام الأولية' : 'Raw Materials' },
  ];

  const filteredRfqs = rfqs.filter((r) => {
    if (categoryFilter === 'ALL') return true;
    return r.category === categoryFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedRfqId(expandedRfqId === id ? null : id);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* 1. View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DDE3E1] dark:border-[#24423D] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
            {t('rfq.title')}
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
            {t('rfq.subtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenCreateModal}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          {t('rfq.createButton')}
        </Button>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto touch-scroll scrollbar-none py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 select-none min-h-[34px] ${
              categoryFilter === cat.id
                ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F] shadow-2xs font-semibold'
                : 'bg-white dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F] border border-[#DDE3E1] dark:border-[#24423D] hover:bg-[#FAF9F6] dark:hover:bg-[#1D3732]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. High-Density Desktop Data Table (>= md screens) */}
      <div className="hidden md:block rounded-xl border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] overflow-hidden shadow-xs">
        <table className="w-full text-left rtl:text-right text-xs">
          <thead className="border-b border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27] font-semibold text-[#647A7B] dark:text-[#8BA39F]">
            <tr>
              <th className="py-3 px-4">{t('rfq.colTitle')}</th>
              <th className="py-3 px-4">{t('rfq.colCategory')}</th>
              <th className="py-3 px-4 text-right rtl:text-left">{t('rfq.colBudget')}</th>
              <th className="py-3 px-4 text-center">{t('rfq.colBids')}</th>
              <th className="py-3 px-4">{t('rfq.colStatus')}</th>
              <th className="py-3 px-4 text-right rtl:text-left">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE3E1] dark:divide-[#24423D]">
            {filteredRfqs.map((rfq) => (
              <React.Fragment key={rfq.id}>
                <tr className="hover:bg-[#FAF9F6] dark:hover:bg-[#162B27]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => toggleExpand(rfq.id)}
                        className="mt-0.5 text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0]"
                        aria-label="Toggle details"
                      >
                        {expandedRfqId === rfq.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      <div>
                        <span className="font-mono text-xs font-bold text-[#173E38] dark:text-[#4EA89A]" dir="ltr">
                          {rfq.rfqNumber}
                        </span>
                        <p className="font-semibold text-[#17272A] dark:text-[#EBF1F0] mt-0.5">
                          {rfq.title}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="default" size="sm">{t(`categories.${rfq.category}`, { defaultValue: rfq.category })}</Badge>
                    <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F] mt-1">
                      {rfq.department}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-right rtl:text-left font-semibold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                    {formatCurrency(rfq.budget)}
                    <span className="block text-[10px] text-[#647A7B] dark:text-[#8BA39F] font-normal">
                      {t('rfq.estTotal')}: {formatCurrency(rfq.estTotalValue)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#173E38] dark:text-[#4EA89A] tabular-nums" dir="ltr">
                      {rfq.bidsReceivedCount} / {rfq.invitedVendorsCount}
                    </span>
                    <span className="block text-[10px] text-[#647A7B] dark:text-[#8BA39F]">
                      {isArabic ? 'عروض مسجلة' : 'Quotes Logged'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        rfq.status === 'EVALUATION'
                          ? 'accent'
                          : rfq.status === 'OPEN_FOR_BIDS'
                          ? 'primary'
                          : 'success'
                      }
                      size="sm"
                      dot
                    >
                      {t(`status.${rfq.status}`, rfq.status)}
                    </Badge>
                    <span className="block text-[10px] text-[#647A7B] dark:text-[#8BA39F] mt-0.5">
                      {t('rfq.colDeadline')}: <span dir="ltr">{rfq.deadline}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right rtl:text-left">
                    <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEvaluateBids(rfq.id)}
                      >
                        {t('nav.bids')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSendPrompt(isArabic ? `حلل فروق الأسعار والامتثال لطلب ${rfq.rfqNumber}: ${rfq.title}` : `Analyze price variance and policy compliance for ${rfq.rfqNumber}: ${rfq.title}`)}
                      >
                        {t('nav.copilotButton')}
                      </Button>
                    </div>
                  </td>
                </tr>

                {/* Collapsible Line Items Accordion for Desktop */}
                {expandedRfqId === rfq.id && (
                  <tr className="bg-[#FAF9F6]/80 dark:bg-[#162B27]/40">
                    <td colSpan={6} className="p-4 border-t border-[#DDE3E1] dark:border-[#24423D]">
                      <div className="rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#17272A] dark:text-[#EBF1F0] flex items-center gap-2">
                            <Package className="h-4 w-4 text-[#C17C43] dark:text-[#D48D55]" />
                            <span>{t('rfq.lineItems')} ({rfq.lineItems.length})</span>
                          </p>
                          <span className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                            <span dir="ltr">{rfq.createdAt}</span>
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left rtl:text-right text-xs">
                            <thead className="bg-[#FAF9F6] dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F]">
                              <tr>
                                <th className="p-2">{t('rfq.sku')}</th>
                                <th className="p-2">{t('rfq.description')}</th>
                                <th className="p-2 text-right rtl:text-left">{t('rfq.quantity')}</th>
                                <th className="p-2">{t('rfq.unit')}</th>
                                <th className="p-2 text-right rtl:text-left">{t('rfq.targetPrice')}</th>
                                <th className="p-2 text-right rtl:text-left">{t('rfq.estTotal')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DDE3E1] dark:divide-[#24423D]">
                              {rfq.lineItems.map((item) => (
                                <tr key={item.id}>
                                  <td className="p-2 font-mono font-medium text-[#173E38] dark:text-[#4EA89A]" dir="ltr">
                                    {item.sku}
                                  </td>
                                  <td className="p-2 text-[#17272A] dark:text-[#EBF1F0]">{item.description}</td>
                                  <td className="p-2 text-right rtl:text-left tabular-nums">{formatNumber(item.quantity)}</td>
                                  <td className="p-2 text-[#647A7B] dark:text-[#8BA39F]">{item.unit}</td>
                                  <td className="p-2 text-right rtl:text-left font-mono tabular-nums">{formatCurrency(item.targetPrice)}</td>
                                  <td className="p-2 text-right rtl:text-left font-mono font-semibold tabular-nums">
                                    {formatCurrency(item.quantity * item.targetPrice)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {rfq.policyNotes && (
                          <div className="rounded bg-[#FAF9F6] dark:bg-[#162B27] p-2.5 text-[11px] text-[#647A7B] dark:text-[#8BA39F] border border-[#DDE3E1] dark:border-[#24423D]">
                            <strong className="text-[#17272A] dark:text-[#EBF1F0]">{t('rfq.policyNotes')}: </strong>
                            {rfq.policyNotes}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Responsive Mobile Cards (< md screens) */}
      <div className="md:hidden space-y-3">
        {filteredRfqs.map((rfq) => {
          const isExpanded = expandedRfqId === rfq.id;
          return (
            <Card key={rfq.id} padding="sm" className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#173E38] dark:text-[#4EA89A]" dir="ltr">
                      {rfq.rfqNumber}
                    </span>
                    <Badge variant="default" size="sm">{t(`categories.${rfq.category}`, { defaultValue: rfq.category })}</Badge>
                  </div>
                  <h3 className="mt-1 font-semibold text-xs text-[#17272A] dark:text-[#EBF1F0]">
                    {rfq.title}
                  </h3>
                </div>

                <Badge
                  variant={rfq.status === 'EVALUATION' ? 'accent' : 'primary'}
                  size="sm"
                  dot
                >
                  {t(`status.${rfq.status}`, rfq.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#DDE3E1] dark:border-[#24423D]">
                <div>
                  <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">{t('rfq.colBudget')}</span>
                  <p className="font-bold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                    {formatCurrency(rfq.budget)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">{t('rfq.colBids')}</span>
                  <p className="font-bold tabular-nums text-[#173E38] dark:text-[#4EA89A]" dir="ltr">
                    {rfq.bidsReceivedCount} / {rfq.invitedVendorsCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => toggleExpand(rfq.id)}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#173E38] dark:text-[#4EA89A]"
                >
                  <span>{isExpanded ? (isArabic ? 'إخفاء البنود' : 'Hide Line Items') : (isArabic ? `عرض ${rfq.lineItems.length} بنود` : `View ${rfq.lineItems.length} SKUs`)}</span>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEvaluateBids(rfq.id)}
                  rightIcon={<ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />}
                >
                  {t('nav.bids')}
                </Button>
              </div>

              {/* Mobile Accordion */}
              {isExpanded && (
                <div className="mt-2 space-y-2 border-t border-[#DDE3E1] dark:border-[#24423D] pt-2 text-xs">
                  {rfq.lineItems.map((item) => (
                    <div key={item.id} className="p-2 rounded bg-[#FAF9F6] dark:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D]">
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="font-semibold text-[#173E38] dark:text-[#4EA89A]" dir="ltr">{item.sku}</span>
                        <span className="tabular-nums font-bold">{formatCurrency(item.targetPrice)} / {item.unit}</span>
                      </div>
                      <p className="text-[11px] text-[#34484B] dark:text-[#C2D3CF] mt-0.5">{item.description}</p>
                      <div className="mt-1 flex justify-between text-[10px] text-[#647A7B] dark:text-[#8BA39F]">
                        <span>{t('rfq.quantity')}: {formatNumber(item.quantity)}</span>
                        <span className="tabular-nums font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                          {formatCurrency(item.quantity * item.targetPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
