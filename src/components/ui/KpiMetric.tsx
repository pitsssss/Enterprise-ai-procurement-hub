import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KpiMetricProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    label?: string;
    positive?: boolean; // whether "up" is good or bad (e.g. higher savings is good, higher cost is bad)
  };
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  variant?: 'surface' | 'subtle';
  className?: string;
}

export const KpiMetric: React.FC<KpiMetricProps> = ({
  label,
  value,
  subValue,
  trend,
  icon,
  badge,
  variant = 'surface',
  className = '',
}) => {
  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.direction === 'neutral') return 'text-[#647A7B] dark:text-[#8BA39F]';
    const isGood = trend.positive !== undefined ? trend.positive : trend.direction === 'up';
    return isGood ? 'text-[#1B6A4A] dark:text-[#38B482]' : 'text-[#A22424] dark:text-[#EA5454]';
  };

  const renderTrendIcon = () => {
    if (!trend) return null;
    if (trend.direction === 'up') return <TrendingUp className="h-3.5 w-3.5 shrink-0" />;
    if (trend.direction === 'down') return <TrendingDown className="h-3.5 w-3.5 shrink-0" />;
    return <Minus className="h-3.5 w-3.5 shrink-0" />;
  };

  return (
    <Card variant={variant} padding="md" className={className}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-[#647A7B] dark:text-[#8BA39F] tracking-tight">
          {label}
        </p>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge}
          {icon && <span className="text-[#173E38] dark:text-[#4EA89A]">{icon}</span>}
        </div>
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#17272A] dark:text-[#EBF1F0] tabular-nums">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-[#647A7B] dark:text-[#8BA39F] font-normal">
            {subValue}
          </span>
        )}
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className={`inline-flex items-center gap-1 font-medium tabular-nums ${getTrendColor()}`}>
            {renderTrendIcon()}
            <span>{trend.value}</span>
          </span>
          {trend.label && (
            <span className="text-[11px] text-[#647A7B] dark:text-[#8BA39F] truncate">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
