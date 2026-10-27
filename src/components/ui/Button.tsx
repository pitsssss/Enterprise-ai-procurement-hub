import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173E38] dark:focus-visible:ring-[#2E7A6F] focus-visible:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.99]';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 min-h-[32px] gap-1.5',
    md: 'text-xs sm:text-sm px-3.5 py-2 min-h-[38px] gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 min-h-[44px] gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#173E38] hover:bg-[#12312C] text-white shadow-xs hover:shadow border border-transparent dark:bg-[#2E7A6F] dark:hover:bg-[#388D81]',
    accent:
      'bg-[#C17C43] hover:bg-[#A86731] text-white shadow-xs hover:shadow border border-transparent dark:bg-[#D48D55] dark:hover:bg-[#E09F6B]',
    secondary:
      'bg-white dark:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D] text-[#17272A] dark:text-[#EBF1F0] hover:bg-[#F6F5F1] dark:hover:bg-[#1D3732] shadow-2xs',
    ghost:
      'bg-transparent text-[#34484B] dark:text-[#C2D3CF] hover:bg-[#173E38]/5 dark:hover:bg-white/5 border border-transparent',
    danger:
      'bg-[#A22424] hover:bg-[#881D1D] text-white shadow-xs border border-transparent',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
