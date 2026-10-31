import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PurchaseOrder } from '../../types/procurement';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency, formatNumber } from '../../lib/formatters';
import {
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  Building,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface PosViewProps {
  pos: PurchaseOrder[];
  onApprovePo: (poId: string) => void;
  onResolveFlag: (poId: string) => void;
  onBatchAudit: () => void;
}

export const PosView: React.FC<PosViewProps> = ({
  pos,
  onApprovePo,
  onResolveFlag,
  onBatchAudit,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'FLAGGED' | 'PENDING_APPROVAL' | 'APPROVED'>('ALL');

  const filteredPos = pos.filter((p) => {
    if (statusFilter === 'ALL') return true;
    return p.status === statusFilter;
  });

  const flaggedCount = pos.filter((p) => p.status === 'FLAGGED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DDE3E1] dark:border-[#24423D] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
            {t('pos.title')}
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
            {t('pos.subtitle')}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onBatchAudit}
          leftIcon={<Sparkles className="h-4 w-4 text-[#C17C43] dark:text-[#D48D55]" />}
        >
          {isArabic ? 'تدقيق جميع الأوامر المفتوحة' : 'Audit All Open Orders'}
        </Button>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto touch-scroll scrollbar-none py-1">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 select-none min-h-[34px] ${
            statusFilter === 'ALL'
              ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F] shadow-2xs font-semibold'
              : 'bg-white dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F] border border-[#DDE3E1] dark:border-[#24423D] hover:bg-[#FAF9F6]'
          }`}
        >
          {isArabic ? `جميع الأوامر (${pos.length})` : `All Orders (${pos.length})`}
        </button>
        <button
          onClick={() => setStatusFilter('FLAGGED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 select-none min-h-[34px] ${
            statusFilter === 'FLAGGED'
              ? 'bg-[#A22424] text-white shadow-2xs font-semibold'
              : 'bg-white dark:bg-[#162B27] text-[#A22424] dark:text-[#EA5454] border border-[#DDE3E1] dark:border-[#24423D] hover:bg-[#FAF9F6]'
          }`}
        >
          {isArabic ? `معلق لضوابط SOX (${flaggedCount})` : `SOX Exceptions (${flaggedCount})`}
        </button>
        <button
          onClick={() => setStatusFilter('PENDING_APPROVAL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 select-none min-h-[34px] ${
            statusFilter === 'PENDING_APPROVAL'
              ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F] shadow-2xs font-semibold'
              : 'bg-white dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F] border border-[#DDE3E1] dark:border-[#24423D] hover:bg-[#FAF9F6]'
          }`}
        >
          {t('status.PENDING_APPROVAL')}
        </button>
        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 select-none min-h-[34px] ${
            statusFilter === 'APPROVED'
              ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F] shadow-2xs font-semibold'
              : 'bg-white dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F] border border-[#DDE3E1] dark:border-[#24423D] hover:bg-[#FAF9F6]'
          }`}
        >
          {isArabic ? 'معتمد ومُرسل' : 'Approved & Dispatched'}
        </button>
      </div>

      {/* 3. Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPos.map((po) => {
          const isFlagged = po.status === 'FLAGGED';
          const isApproved = po.status === 'APPROVED';

          return (
            <Card
              key={po.id}
              padding="md"
              className={`flex flex-col justify-between space-y-4 ${
                isFlagged
                  ? 'border-l-4 rtl:border-l-0 rtl:border-r-4 border-l-[#A22424] rtl:border-r-[#A22424] bg-white dark:bg-[#11211E]'
                  : isApproved
                  ? 'border-l-4 rtl:border-l-0 rtl:border-r-4 border-l-[#1B6A4A] rtl:border-r-[#1B6A4A] bg-white dark:bg-[#11211E]'
                  : 'border-[#DDE3E1] dark:border-[#24423D]'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#173E38] dark:text-[#4EA89A]" dir="ltr">
                        {po.poNumber}
                      </span>
                      <span className="text-[11px] text-[#647A7B] dark:text-[#8BA39F] font-mono">
                        <bdi dir="ltr">Ref: {po.rfqRef}</bdi>
                      </span>
                    </div>
                    <h3 className="mt-1 font-bold text-sm sm:text-base text-[#17272A] dark:text-[#EBF1F0]">
                      {po.vendorName}
                    </h3>
                  </div>

                  <Badge
                    variant={
                      isFlagged
                        ? 'danger'
                        : isApproved
                        ? 'success'
                        : 'warning'
                    }
                    size="sm"
                    dot
                  >
                    {isFlagged
                      ? t('pos.soxHoldBanner')
                      : isApproved
                      ? t('status.APPROVED')
                      : t('status.PENDING_APPROVAL')}
                  </Badge>
                </div>

                {/* Amount & Terms */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D]">
                  <div>
                    <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F] block">{t('pos.colAmount')}</span>
                    <span className="text-base sm:text-lg font-bold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                      {formatCurrency(po.amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F] block">{t('pos.colTerms')}</span>
                    <span className="font-medium text-[#17272A] dark:text-[#EBF1F0]">
                      {po.paymentTerms}
                    </span>
                  </div>
                </div>

                {/* SOX Exception Alert Banner */}
                {isFlagged && po.complianceWarning && (
                  <div className="p-3 rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] border border-[#A22424]/30 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#A22424] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#A22424] dark:text-[#EA5454] leading-relaxed">
                        {po.complianceWarning}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => onResolveFlag(po.id)}
                      leftIcon={<CheckCircle2 className="h-4 w-4" />}
                    >
                      {t('pos.btnSignWaiver')}
                    </Button>
                  </div>
                )}

                {/* Approver Sign-off Details */}
                <div className="flex items-center justify-between text-[11px] text-[#647A7B] dark:text-[#8BA39F] pt-1">
                  <span>{t('pos.colApprover')}: {t(`roles.${po.approverRole}`, po.approverRole)}</span>
                  <span>{isArabic ? 'تاريخ الإصدار' : 'Issued'}: <span dir="ltr">{po.issueDate}</span></span>
                </div>
              </div>

              {/* Action Buttons for Normal Approval */}
              {!isFlagged && !isApproved && (
                <div className="pt-2 border-t border-[#DDE3E1] dark:border-[#24423D]">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => onApprovePo(po.id)}
                    leftIcon={<ShieldCheck className="h-4 w-4" />}
                  >
                    {t('pos.btnApprovePo')}
                  </Button>
                </div>
              )}

              {isApproved && (
                <div className="pt-2 border-t border-[#DDE3E1] dark:border-[#24423D] flex items-center justify-between text-xs">
                  <span className="text-[#1B6A4A] dark:text-[#38B482] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {isArabic ? 'متزامن مع سجل SAP S/4HANA (محاكاة)' : 'Synced to SAP S/4HANA Ledger (Simulated)'}
                  </span>
                  <span className="font-mono text-[10px] text-[#647A7B] dark:text-[#8BA39F]">
                    <bdi dir="ltr">Doc: #SAP-{po.poNumber.slice(-4)}</bdi>
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
