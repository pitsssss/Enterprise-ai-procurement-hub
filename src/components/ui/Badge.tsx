import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
  }[size];

  const variantStyles = {
    default:
      'bg-[#F6F5F1] text-[#34484B] border border-[#DDE3E1] dark:bg-[#162B27] dark:text-[#C2D3CF] dark:border-[#24423D]',
    primary:
      'bg-[#173E38]/10 text-[#173E38] border border-[#173E38]/20 dark:bg-[#2E7A6F]/20 dark:text-[#A7D5CD] dark:border-[#2E7A6F]/30',
    accent:
      'bg-[#C17C43]/10 text-[#C17C43] border border-[#C17C43]/25 dark:bg-[#D48D55]/20 dark:text-[#E3A675] dark:border-[#D48D55]/30',
    success:
      'bg-[#1B6A4A]/10 text-[#1B6A4A] border border-[#1B6A4A]/20 dark:bg-[#38B482]/15 dark:text-[#38B482] dark:border-[#38B482]/30',
    warning:
      'bg-[#9A5918]/10 text-[#9A5918] border border-[#9A5918]/25 dark:bg-[#E28E36]/15 dark:text-[#E28E36] dark:border-[#E28E36]/30',
    danger:
      'bg-[#A22424]/10 text-[#A22424] border border-[#A22424]/20 dark:bg-[#EA5454]/15 dark:text-[#EA5454] dark:border-[#EA5454]/30',
    info:
      'bg-[#1F567A]/10 text-[#1F567A] border border-[#1F567A]/20 dark:bg-[#4DA6E3]/15 dark:text-[#4DA6E3] dark:border-[#4DA6E3]/30',
  }[variant];

  const dotColor = {
    default: 'bg-[#647A7B] dark:bg-[#8BA39F]',
    primary: 'bg-[#173E38] dark:bg-[#4EA89A]',
    accent: 'bg-[#C17C43] dark:bg-[#D48D55]',
    success: 'bg-[#1B6A4A] dark:bg-[#38B482]',
    warning: 'bg-[#9A5918] dark:bg-[#E28E36]',
    danger: 'bg-[#A22424] dark:bg-[#EA5454]',
    info: 'bg-[#1F567A] dark:bg-[#4DA6E3]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center rounded-md select-none tracking-tight ${sizeStyles} ${variantStyles} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
};
