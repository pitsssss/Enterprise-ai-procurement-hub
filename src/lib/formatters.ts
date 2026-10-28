import i18n from '../i18n';

/**
 * Enterprise locale-aware currency formatter.
 * Ensures consistent rendering across LTR and RTL contexts.
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  localeOverride?: string
): string {
  const currentLocale = localeOverride || (i18n.language === 'ar' ? 'ar-SA' : 'en-US');
  try {
    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString()}`;
  }
}

/**
 * Enterprise locale-aware number formatter.
 */
export function formatNumber(value: number, localeOverride?: string): string {
  const currentLocale = localeOverride || (i18n.language === 'ar' ? 'ar-SA' : 'en-US');
  try {
    return new Intl.NumberFormat(currentLocale).format(value);
  } catch {
    return value.toLocaleString();
  }
}

/**
 * Enterprise locale-aware percent formatter (expects 0-100 or 0-1 based on isDecimal).
 */
export function formatPercent(rate: number, isDecimal: boolean = false, localeOverride?: string): string {
  const currentLocale = localeOverride || (i18n.language === 'ar' ? 'ar-SA' : 'en-US');
  const normalized = isDecimal ? rate : rate / 100;
  try {
    return new Intl.NumberFormat(currentLocale, {
      style: 'percent',
      maximumFractionDigits: 1,
    }).format(normalized);
  } catch {
    return `${rate}%`;
  }
}

/**
 * Enterprise locale-aware date formatter.
 */
export function formatDate(dateStr: string, localeOverride?: string): string {
  if (!dateStr) return '';
  const currentLocale = localeOverride || (i18n.language === 'ar' ? 'ar-SA' : 'en-US');
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat(currentLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Directional isolation wrapper for Technical IDs (RFQs, POs, SKUs, serials).
 * In RTL, ensures Latin alphanumeric strings like "RFQ-2025-001" or "PO-2025-8841"
 * are rendered without reversed hyphen ordering.
 */
export function renderIsolatedCode(code: string): string {
  return `\u2066${code}\u2069`; // Unicode LTR isolate
}
