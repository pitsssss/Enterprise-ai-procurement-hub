import React, { useState } from 'react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X, CheckCircle2 } from 'lucide-react';

interface ContactSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ContactSalesModal: React.FC<ContactSalesModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [annualSpend, setAnnualSpend] = useState('$50M - $250M');
  const [erpSystem, setErpSystem] = useState('SAP S/4HANA');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#11211E] border border-[#DDE3E1] dark:border-[#24423D] p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto touch-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0] p-1 rounded-md"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1B6A4A]/10 text-[#1B6A4A] dark:bg-[#38B482]/20 dark:text-[#38B482]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-[#17272A] dark:text-[#EBF1F0]">
              Consultation Scheduled
            </h3>
            <p className="text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F] max-w-sm mx-auto">
              A Strategic Sourcing Principal will review your procurement volume ({annualSpend}) and connect within 1 business day.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Logo size="md" variant="compact" />
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
                  Enterprise Architecture Consultation
                </h2>
                <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                  Discuss deployment options, ERP connectors, and custom SOX policy thresholds.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Executive Name"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Corporate Email"
                  type="email"
                  required
                  placeholder="m.vance@fortune500.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Organization / Company"
                  required
                  placeholder="e.g. Apex Global Industries"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <Select
                  label="Annual Procurement Spend"
                  value={annualSpend}
                  onChange={(e) => setAnnualSpend(e.target.value)}
                  options={[
                    { value: '$10M - $50M', label: '$10M - $50M USD' },
                    { value: '$50M - $250M', label: '$50M - $250M USD' },
                    { value: '$250M - $1B', label: '$250M - $1B USD' },
                    { value: '$1B+', label: '$1B+ Enterprise Tier' },
                  ]}
                />
              </div>

              <Select
                label="Primary ERP / SCM Core"
                value={erpSystem}
                onChange={(e) => setErpSystem(e.target.value)}
                options={[
                  { value: 'SAP S/4HANA', label: 'SAP S/4HANA (Cloud / On-Prem)' },
                  { value: 'Workday Financials', label: 'Workday Financial Management' },
                  { value: 'Oracle Cloud ERP', label: 'Oracle Cloud ERP / NetSuite' },
                  { value: 'Coupa', label: 'Coupa Business Spend Management' },
                  { value: 'Custom ERP / REST', label: 'Custom In-House Architecture' },
                ]}
              />

              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#34484B] dark:text-[#C2D3CF]">
                  Specific Requirements or Policy Challenges
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Automated dual-authorization enforcement, multi-supplier quote scoring, custom SOX form workflows..."
                  className="w-full rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#162B27] p-2.5 text-xs text-[#17272A] dark:text-[#EBF1F0] placeholder-[#92A4A3] focus:outline-none focus:border-[#173E38] dark:focus:border-[#2E7A6F] focus:ring-1 focus:ring-[#173E38]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <Button variant="secondary" size="md" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button variant="accent" size="md" type="submit" isLoading={isSubmitting}>
                  Request Enterprise Briefing
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
