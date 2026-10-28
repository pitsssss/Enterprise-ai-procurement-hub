import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface CreateRfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setTitle: (val: string) => void;
  category: 'IT Hardware' | 'Precision Machining' | 'Facility Operations' | 'Logistics' | 'Raw Materials';
  setCategory: (val: any) => void;
  budget: number;
  setBudget: (val: number) => void;
  department: string;
  setDepartment: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreateRfqModal: React.FC<CreateRfqModalProps> = ({
  isOpen,
  onClose,
  title,
  setTitle,
  category,
  setCategory,
  budget,
  setBudget,
  department,
  setDepartment,
  onSubmit,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto touch-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#DDE3E1] dark:border-[#24423D]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#173E38]/10 text-[#173E38] dark:bg-[#2E7A6F]/20 dark:text-[#4EA89A]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#17272A] dark:text-[#EBF1F0]">
                {t('rfq.modalTitle')}
              </h3>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                {t('rfq.modalSubtitle')}
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

        {/* Form Body */}
        <form onSubmit={onSubmit} className="mt-4 space-y-3.5">
          <Input
            label={t('rfq.fieldTitle')}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isArabic ? 'مثال: توريد أجهزة خوادم ومحولات شبكية دفعة ج' : 'e.g. Next-Gen Enterprise Fiber Switches Batch C'}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label={t('rfq.fieldCategory')}
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { value: 'IT Hardware', label: isArabic ? 'أجهزة تقنية المعلومات' : 'IT Hardware' },
                { value: 'Precision Machining', label: isArabic ? 'التشغيل الدقيق والمعادن' : 'Precision Machining' },
                { value: 'Facility Operations', label: isArabic ? 'عمليات المرافق والتشغيل' : 'Facility Operations' },
                { value: 'Logistics', label: isArabic ? 'اللوجستيات والشحن' : 'Logistics & Distribution' },
                { value: 'Raw Materials', label: isArabic ? 'المواد الخام الأولية' : 'Raw Materials' },
              ]}
            />

            <Input
              label={t('rfq.fieldBudget')}
              type="number"
              required
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              prefixText="$"
            />
          </div>

          <Input
            label={t('rfq.fieldDept')}
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder={isArabic ? 'مثال: هندسة البنية التحتية والمراكز' : 'e.g. Infrastructure Platform Engineering'}
          />

          <div className="rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] p-3 text-[11px] text-[#34484B] dark:text-[#C2D3CF] border border-[#DDE3E1] dark:border-[#24423D] leading-relaxed">
            <strong className="text-[#17272A] dark:text-[#EBF1F0]">
              {isArabic ? 'الفحص المسبق لامتثال SOX: ' : 'SOX Compliance Pre-Check: '}
            </strong>
            {isArabic
              ? 'الطلبات التي تتجاوز $250,000 USD ستفرض تلقائياً نافذة منافسة لـ 3 موردين مستقلين على الأقل وتتطلب توقيع مسؤول الخزينة.'
              : 'Requisitions exceeding $250,000 USD will automatically enforce a minimum 3-vendor competitive bidding window and require Group Treasury co-signature.'}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button variant="secondary" size="md" onClick={onClose} type="button">
              {t('common.cancel')}
            </Button>
            <Button variant="primary" size="md" type="submit">
              {t('rfq.btnCreate')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
