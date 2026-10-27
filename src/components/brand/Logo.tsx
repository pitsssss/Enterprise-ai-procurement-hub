import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'compact' | 'mark-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'auto' | 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  theme = 'auto',
}) => {
  // Dimensions based on size
  const markDimensions = {
    sm: { width: 22, height: 22 },
    md: { width: 28, height: 28 },
    lg: { width: 36, height: 36 },
    xl: { width: 48, height: 48 },
  }[size];

  const textSizes = {
    sm: { title: 'text-xs', sub: 'text-[9px]' },
    md: { title: 'text-sm font-semibold tracking-tight', sub: 'text-[10px] tracking-wider' },
    lg: { title: 'text-base font-semibold tracking-tight', sub: 'text-[11px] tracking-wider' },
    xl: { title: 'text-xl font-bold tracking-tight', sub: 'text-xs tracking-wider' },
  }[size];

  // Colors adapt according to theme class or prop
  const markColor = theme === 'dark' ? '#2E7A6F' : '#173E38';
  const copperAccent = theme === 'dark' ? '#D48D55' : '#C17C43';
  const gridLines = theme === 'dark' ? '#335952' : '#BAC6C3';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Nexus Brand Mark */}
      <svg
        width={markDimensions.width}
        height={markDimensions.height}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200"
        aria-hidden="true"
      >
        {/* Calibrated Geometric Foundation: Octagonal alignment field */}
        <rect
          x="1"
          y="1"
          width="34"
          height="34"
          rx="7"
          fill="currentColor"
          className="text-[#173E38] dark:text-[#162B27]"
        />

        {/* Structural precision crosshair grid */}
        <line
          x1="18"
          y1="5"
          x2="18"
          y2="31"
          stroke={gridLines}
          strokeWidth="1"
          strokeDasharray="2 2"
          strokeOpacity="0.45"
        />
        <line
          x1="5"
          y1="18"
          x2="31"
          y2="18"
          stroke={gridLines}
          strokeWidth="1"
          strokeDasharray="2 2"
          strokeOpacity="0.45"
        />

        {/* Outer Isometric Diamond: Scope & Boundaries */}
        <path
          d="M18 7L29 18L18 29L7 18Z"
          stroke={gridLines}
          strokeWidth="1.25"
          strokeOpacity="0.6"
          fill="none"
        />

        {/* Strategic Convergence Prisms: 3 Quadrants meeting at the nexus */}
        {/* Prism 1: Demand & Specification (Top-Left) */}
        <path
          d="M10 16L18 8V18H8L10 16Z"
          fill="#FFFFFF"
          fillOpacity="0.88"
        />

        {/* Prism 2: Market Bids & Supplier Intelligence (Top-Right) */}
        <path
          d="M26 16L18 8V18H28L26 16Z"
          fill={copperAccent}
          fillOpacity="0.95"
        />

        {/* Prism 3: Fiduciary Trust & Dual-Signoff Settlement (Bottom Anchor) */}
        <path
          d="M18 18L26 26H10L18 18Z"
          fill="#FFFFFF"
          fillOpacity="0.75"
        />

        {/* Central Calibrated Nexus Core (The Decision Point) */}
        <circle
          cx="18"
          cy="18"
          r="3"
          fill={copperAccent}
        />
        <circle
          cx="18"
          cy="18"
          r="1.25"
          fill="#FFFFFF"
        />
      </svg>

      {/* Brand Typography */}
      {variant !== 'mark-only' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`${textSizes.title} text-[#17272A] dark:text-[#EBF1F0]`}>
              Synthetix
            </span>
            {variant === 'horizontal' && (
              <span className="rounded-[4px] bg-[#C17C43]/15 text-[#C17C43] dark:bg-[#D48D55]/20 dark:text-[#D48D55] px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
                SaaS
              </span>
            )}
          </div>
          {variant === 'horizontal' && (
            <span className={`${textSizes.sub} text-[#647A7B] dark:text-[#8BA39F] uppercase font-medium mt-0.5`}>
              Enterprise Sourcing
            </span>
          )}
        </div>
      )}
    </div>
  );
};
