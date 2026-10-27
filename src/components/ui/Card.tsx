import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'surface' | 'subtle' | 'outline';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  variant = 'surface',
  interactive = false,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  }[padding];

  const variantStyles = {
    surface:
      'bg-white dark:bg-[#11211E] border border-[#DDE3E1] dark:border-[#24423D] shadow-xs',
    subtle:
      'bg-[#FAF9F6] dark:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D]',
    outline:
      'bg-transparent border border-[#DDE3E1] dark:border-[#24423D]',
  }[variant];

  const interactiveStyles = interactive
    ? 'hover:border-[#BAC6C3] dark:hover:border-[#335952] hover:shadow-sm cursor-pointer transition-all duration-150 active:scale-[0.995]'
    : '';

  return (
    <div
      className={`rounded-xl transition-colors ${paddingStyles} ${variantStyles} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
