import React from 'react';
import { Button } from './Button';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox className="h-8 w-8 text-[#647A7B] dark:text-[#8BA39F]" />,
  title,
  description,
  action,
  secondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl border border-dashed border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#11211E]/50 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D] shadow-2xs mb-3.5">
        {icon}
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-[#17272A] dark:text-[#EBF1F0] tracking-tight">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F] leading-relaxed">
        {description}
      </p>

      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {action && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
