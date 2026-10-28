import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, X, ShieldCheck, FileCheck } from 'lucide-react';
import { PurchaseOrder } from '../../types/procurement';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../lib/formatters';

interface ResolveSoxWaiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: PurchaseOrder | null;
  onConfirmWaiver: (po: PurchaseOrder, justification: string) => Promise<void>;
  userRole: string;
}

export const ResolveSoxWaiverModal: React.FC<ResolveSoxWaiverModalProps> = ({
  isOpen,
  onClose,
  purchaseOrder,
  onConfirmWaiver,
  userRole,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const defaultJustification = isArabic
    ? 'استثناء مبرر للمورد الوحيد بموجب معايير الحوكمة المالية: تتطلب الملكية الفكرية الحصرية ومواصفات المصنع الأصلية الترسية المباشرة دون طرح منافسة ثانوية.'
    : 'Sole source exception authorized under FAR 6.302-1: Proprietary IP and OEM tooling compatibility require immediate award without secondary solicitation.';

  const [justification, setJustification] = useState(defaultJustification);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToFiduciaryTerms, setAgreedToFiduciaryTerms] = useState(false);

  if (!isOpen || !purchaseOrder) return null;

  const isAuthorized = ['ADMIN', 'FINANCE'].includes(userRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToFiduciaryTerms || !isAuthorized) return;
    setIsSubmitting(true);
    try {
      await onConfirmWaiver(purchaseOrder, justification);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] p-5 sm:p-6 shadow-2xl text-xs max-h-[92vh] overflow-y-auto touch-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE3E1] dark:border-[#24423D]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A22424]/10 text-[#A22424] dark:bg-[#EA5454]/20 dark:text-[#EA5454]">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#17272A] dark:text-[#EBF1F0]">
                  {t('pos.modalTitle')}
                </h3>
                <Badge variant="danger" size="sm">SOX Sec 404</Badge>
              </div>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                {t('pos.poTarget')}: <bdi dir="ltr">{purchaseOrder.poNumber}</bdi> ({formatCurrency(purchaseOrder.amount)})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0]"
            aria-label={t('common.close')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Warning Callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold text-xs">
                {isArabic ? 'تحذير الامتثال القانوني والمالي' : 'Statutory Compliance Warning'}
              </p>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                {t('pos.soxHoldNotice')}
              </p>
            </div>
          </div>
        </div>

        {!isAuthorized ? (
          <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs">
            <p className="font-semibold">{isArabic ? 'صلاحيات الدور الوظيفي غير كافية' : 'Insufficient Role Authority'}</p>
            <p className="mt-1 text-[11px]">
              {isArabic
                ? `دورك الحالي هو ${t(`roles.${userRole}`, userRole)}. لا يمكن توقيع نموذج CS-8 إلا بواسطة مفوضي المالية (FINANCE) أو مدراء النظام (ADMIN).`
                : `Your current role is ${userRole}. Form CS-8 Sole-Source waivers can only be authorized by FINANCE or ADMIN signatories.`}
            </p>
            <p className="mt-2 text-[10px] text-gray-500">
              {isArabic ? 'تلميح: يمكنك محاكاة تغيير دورك في شاشة ملف المفوض لاختبار هذا المسار.' : 'Tip: You can switch roles in the Signatory Profile view to test and audit this authorization workflow.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                {t('pos.fieldJustification')}
              </label>
              <textarea
                rows={3}
                required
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder={t('pos.justificationPlaceholder')}
                className="w-full rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#162B27] p-2.5 text-xs text-[#17272A] dark:text-[#EBF1F0] focus:border-[#173E38] focus:outline-none"
              />
              <p className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">
                {t('pos.fidoNotice')}
              </p>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={agreedToFiduciaryTerms}
                onChange={(e) => setAgreedToFiduciaryTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#DDE3E1] text-[#173E38] focus:ring-[#173E38]"
              />
              <span className="text-[11px] text-[#34484B] dark:text-[#C2D3CF] leading-normal">
                {isArabic
                  ? 'أقر بصفتي مفوضاً معتمداً بأن شروط التوريد من مصدر وحيد قد تم فحصها، وأن الأسعار عادلة ومعقولة، ولا يوجد أي تعارض مصالح.'
                  : 'I attest as an authorized corporate signatory that sole-source procurement terms have been vetted, vendor pricing is fair and reasonable, and no conflicts of interest exist.'}
              </span>
            </label>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#DDE3E1] dark:border-[#24423D]">
              <Button variant="secondary" size="md" onClick={onClose} type="button">
                {t('common.cancel')}
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                isLoading={isSubmitting}
                disabled={!agreedToFiduciaryTerms}
                leftIcon={<ShieldCheck className="h-4 w-4" />}
              >
                {t('pos.btnAuthorizeWaiver')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
