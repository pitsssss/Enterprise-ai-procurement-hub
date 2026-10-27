import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefixText?: string;
  suffixText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      prefixText,
      suffixText,
      id,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#34484B] dark:text-[#C2D3CF]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[#647A7B] dark:text-[#8BA39F] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}

          {prefixText && (
            <span className="absolute left-3 text-xs font-mono text-[#647A7B] dark:text-[#8BA39F] pointer-events-none select-none">
              {prefixText}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full rounded-lg border bg-white dark:bg-[#162B27] px-3 py-2 text-xs sm:text-sm text-[#17272A] dark:text-[#EBF1F0] placeholder-[#92A4A3] dark:placeholder-[#59736F] transition-colors focus:outline-none focus:border-[#173E38] focus:ring-1 focus:ring-[#173E38] dark:focus:border-[#2E7A6F] dark:focus:ring-[#2E7A6F] disabled:bg-[#EEF7F5] dark:disabled:bg-[#122522] disabled:opacity-60 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-9' : prefixText ? 'pl-8' : ''
            } ${rightIcon ? 'pr-9' : suffixText ? 'pr-10' : ''} ${
              error
                ? 'border-[#A22424] focus:border-[#A22424] focus:ring-[#A22424]'
                : 'border-[#DDE3E1] dark:border-[#24423D]'
            } ${className}`}
            {...props}
          />

          {suffixText && (
            <span className="absolute right-3 text-xs font-medium text-[#647A7B] dark:text-[#8BA39F] pointer-events-none select-none">
              {suffixText}
            </span>
          )}

          {rightIcon && (
            <span className="absolute right-3 text-[#647A7B] dark:text-[#8BA39F] pointer-events-none flex items-center justify-center">
              {rightIcon}
            </span>
          )}
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

Input.displayName = 'Input';
