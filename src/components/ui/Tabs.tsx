import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
}) => {
  if (variant === 'pills') {
    return (
      <div
        className={`flex items-center gap-1.5 overflow-x-auto touch-scroll scrollbar-none py-1 ${className}`}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0 select-none min-h-[34px] ${
                isActive
                  ? 'bg-[#173E38] text-white shadow-2xs dark:bg-[#2E7A6F]'
                  : 'bg-white dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F] border border-[#DDE3E1] dark:border-[#24423D] hover:bg-[#FAF9F6] dark:hover:bg-[#1D3732] hover:text-[#17272A] dark:hover:text-[#EBF1F0]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] tabular-nums font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#EEF7F5] dark:bg-[#122522] text-[#173E38] dark:text-[#4EA89A]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Underline variant
  return (
    <div
      className={`flex items-center border-b border-[#DDE3E1] dark:border-[#24423D] gap-6 overflow-x-auto touch-scroll scrollbar-none ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`group relative flex items-center gap-2 py-3 text-xs sm:text-sm font-medium transition-colors shrink-0 select-none min-h-[44px] ${
              isActive
                ? 'text-[#173E38] dark:text-[#4EA89A] font-semibold'
                : 'text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] tabular-nums font-semibold ${
                  isActive
                    ? 'bg-[#173E38]/10 text-[#173E38] dark:bg-[#2E7A6F]/20 dark:text-[#A7D5CD]'
                    : 'bg-[#EEF7F5] dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F]'
                }`}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#173E38] dark:bg-[#4EA89A]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
