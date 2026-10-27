import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, helperText, error, id, className = '', disabled, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-[#34484B] dark:text-[#C2D3CF]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`w-full appearance-none rounded-lg border bg-white dark:bg-[#162B27] px-3 py-2 pr-9 text-xs sm:text-sm text-[#17272A] dark:text-[#EBF1F0] transition-colors focus:outline-none focus:border-[#173E38] focus:ring-1 focus:ring-[#173E38] dark:focus:border-[#2E7A6F] dark:focus:ring-[#2E7A6F] disabled:bg-[#EEF7F5] dark:disabled:bg-[#122522] disabled:opacity-60 disabled:cursor-not-allowed ${
              error
                ? 'border-[#A22424] focus:border-[#A22424] focus:ring-[#A22424]'
                : 'border-[#DDE3E1] dark:border-[#24423D]'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#647A7B] dark:text-[#8BA39F]" />
        </div>

        {error ? (
          <p className="text-[11px] text-[#A22424] dark:text-[#EA5454]">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
