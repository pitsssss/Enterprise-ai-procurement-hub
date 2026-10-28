import React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from './brand/Logo';
import { Badge } from './ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  TrendingUp,
  FileText,
  Award,
  Building2,
  ShoppingCart,
  Sliders,
  User,
  Plus,
  Search,
  X,
  Bot,
  Bell,
  Sun,
  Moon,
  Globe,
  ExternalLink,
} from 'lucide-react';

export type TabType = 'overview' | 'rfqs' | 'bids' | 'vendors' | 'pos' | 'org' | 'profile';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  rfqsCount: number;
  vendorsCount: number;
  flaggedPosCount: number;
  onOpenCreateRfq: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileSearchOpen: boolean;
  setIsMobileSearchOpen: (open: boolean) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onSwitchToPublicSite: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  rfqsCount,
  vendorsCount,
  flaggedPosCount,
  onOpenCreateRfq,
  onToggleCopilot,
  isCopilotOpen,
  searchQuery,
  setSearchQuery,
  isMobileSearchOpen,
  setIsMobileSearchOpen,
  isDark,
  onToggleTheme,
  onOpenNotifications,
  unreadNotificationsCount = 2,
  onSwitchToPublicSite,
}) => {
  const { t } = useTranslation();
  const { user, profile, organization, userRole } = useAuth();
  const userName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Enterprise Signatory';
  const userInitials = (userName || 'SC').slice(0, 2).toUpperCase();

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'overview':
        return t('nav.overview');
      case 'rfqs':
        return `${t('nav.rfqs')} (${rfqsCount})`;
      case 'bids':
        return t('nav.bids');
      case 'vendors':
        return `${t('nav.vendors')} (${vendorsCount})`;
      case 'pos':
        return flaggedPosCount > 0 ? `${t('nav.pos')} (${flaggedPosCount} ${t('nav.holdBadge')})` : t('nav.pos');
      case 'org':
        return t('nav.org');
      case 'profile':
        return t('nav.profile');
      default:
        return t('brand.name');
    }
  };

  const navItems = [
    {
      id: 'overview' as TabType,
      label: t('nav.overview'),
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      id: 'rfqs' as TabType,
      label: t('nav.rfqs'),
      icon: <FileText className="h-4 w-4" />,
      count: rfqsCount,
    },
    {
      id: 'bids' as TabType,
      label: t('nav.bids'),
      icon: <Award className="h-4 w-4" />,
      badge: <span className="h-2 w-2 rounded-full bg-[#C17C43] dark:bg-[#D48D55]" />,
    },
    {
      id: 'vendors' as TabType,
      label: t('nav.vendors'),
      icon: <Building2 className="h-4 w-4" />,
      count: vendorsCount,
    },
    {
      id: 'pos' as TabType,
      label: t('nav.pos'),
      icon: <ShoppingCart className="h-4 w-4" />,
      alertCount: flaggedPosCount,
    },
  ];

  const adminNavItems = [
    {
      id: 'org' as TabType,
      label: t('nav.org'),
      icon: <Sliders className="h-4 w-4" />,
    },
    {
      id: 'profile' as TabType,
      label: t('nav.profile'),
      icon: <User className="h-4 w-4" />,
    },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP ENTERPRISE SIDEBAR (Visible ONLY on >= md screens) */}
      {/* ========================================================= */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] shrink-0 h-full select-none transition-colors">
        {/* App Title Header with Precision Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#DDE3E1] dark:border-[#24423D] px-5">
          <Logo size="md" variant="horizontal" />
        </div>

        {/* Workspace Context Badge */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] px-3 py-2 border border-[#DDE3E1] dark:border-[#24423D] text-[11px]">
            <div className="flex items-center gap-1.5 font-medium text-[#173E38] dark:text-[#4EA89A] min-w-0">
              <span className="h-2 w-2 rounded-full bg-[#1B6A4A] dark:bg-[#38B482] shrink-0" />
              <span className="truncate">{organization?.name || 'Synthetix Global Corp'}</span>
            </div>
            <span className="font-mono text-[10px] text-[#647A7B] dark:text-[#8BA39F] shrink-0 uppercase font-semibold">
              {t(`roles.${userRole}`, userRole)}
            </span>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 space-y-1 px-3 py-2 text-xs font-medium overflow-y-auto touch-scroll">
          <p className="px-2 pb-1.5 pt-2 text-[10px] uppercase font-semibold text-[#647A7B] dark:text-[#8BA39F] tracking-wider">
            {t('nav.operationsTitle')}
          </p>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-all text-left rtl:text-right ${
                  isActive
                    ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F] font-semibold shadow-2xs'
                    : 'text-[#34484B] dark:text-[#C2D3CF] hover:bg-[#FAF9F6] dark:hover:bg-[#162B27] hover:text-[#17272A] dark:hover:text-[#EBF1F0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-[#647A7B] dark:text-[#8BA39F]'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge}
                  {item.count !== undefined && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-mono tabular-nums ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#F6F5F1] dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  {item.alertCount !== undefined && item.alertCount > 0 && (
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                        isActive
                          ? 'bg-[#C17C43] text-white'
                          : 'bg-[#A22424]/10 text-[#A22424] dark:bg-[#EA5454]/20 dark:text-[#EA5454]'
                      }`}
                    >
                      {item.alertCount} {t('nav.holdBadge')}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          <p className="px-2 pb-1.5 pt-4 text-[10px] uppercase font-semibold text-[#647A7B] dark:text-[#8BA39F] tracking-wider">
            {t('nav.governanceTitle')}
          </p>
          {adminNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all text-left rtl:text-right ${
                  isActive
                    ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F] font-semibold shadow-2xs'
                    : 'text-[#34484B] dark:text-[#C2D3CF] hover:bg-[#FAF9F6] dark:hover:bg-[#162B27] hover:text-[#17272A] dark:hover:text-[#EBF1F0]'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-[#647A7B] dark:text-[#8BA39F]'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Public Marketing Site Switcher Link & Language Switcher */}
        <div className="p-3 border-t border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6]/50 dark:bg-[#162B27]/40 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-[#647A7B] dark:text-[#8BA39F]">
              {t('nav.language')}:
            </span>
            <LanguageSwitcher variant="inline" />
          </div>

          <button
            onClick={onSwitchToPublicSite}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#647A7B] dark:text-[#8BA39F] hover:bg-white dark:hover:bg-[#11211E] hover:text-[#17272A] dark:hover:text-[#EBF1F0] border border-transparent hover:border-[#DDE3E1] dark:hover:border-[#24423D] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#C17C43] dark:text-[#D48D55]" />
              <span>{t('nav.publicSite')}</span>
            </div>
            <ExternalLink className="h-3 w-3 rtl:rotate-180" />
          </button>
        </div>

        {/* User Identity Footer */}
        <div className="flex items-center gap-3 border-t border-[#DDE3E1] dark:border-[#24423D] p-3.5 bg-white dark:bg-[#11211E]">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={userName}
              className="h-8 w-8 rounded-lg object-cover border border-[#DDE3E1] dark:border-[#24423D] shrink-0"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#173E38] text-xs font-bold text-white shadow-2xs">
              {userInitials}
            </div>
          )}
          <div
            className="flex-1 overflow-hidden cursor-pointer"
            onClick={() => setActiveTab('profile')}
            title={t('nav.profile')}
          >
            <p className="truncate text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0] hover:text-[#173E38] dark:hover:text-[#4EA89A] transition-colors">
              {userName}
            </p>
            <p className="truncate text-[10px] text-[#647A7B] dark:text-[#8BA39F]">
              {profile?.title || `${t(`roles.${userRole}`, userRole)}`}
            </p>
          </div>
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0] rounded-md transition-colors"
            title={isDark ? t('nav.themeLight') : t('nav.themeDark')}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MOBILE TOP APP BAR (Visible ONLY on <= 767px mobile) */}
      {/* ========================================================= */}
      <header className="md:hidden sticky top-0 z-30 flex flex-col w-full border-b border-[#DDE3E1] dark:border-[#24423D] bg-white/95 dark:bg-[#11211E]/95 backdrop-blur-md shrink-0 select-none">
        <div className="flex h-14 items-center justify-between px-3.5">
          {/* Brand & Section Indicator */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Logo size="sm" variant="mark-only" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0] truncate">
                  {t('brand.shortName')}
                </span>
                <span className="rounded bg-[#C17C43]/15 text-[#C17C43] dark:bg-[#D48D55]/20 dark:text-[#D48D55] px-1 py-0.2 text-[9px] font-semibold">
                  {t('brand.badge')}
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#173E38] dark:text-[#4EA89A] truncate leading-tight">
                {getSectionTitle()}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
                isMobileSearchOpen || searchQuery
                  ? 'border-[#173E38] bg-[#173E38]/10 text-[#173E38] dark:border-[#2E7A6F] dark:text-[#4EA89A]'
                  : 'border-[#DDE3E1] dark:border-[#24423D] text-[#647A7B] dark:text-[#8BA39F]'
              }`}
              aria-label={t('common.search')}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Language Switcher Button for Mobile */}
            <LanguageSwitcher variant="compact" />

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] text-[#647A7B] dark:text-[#8BA39F]"
              aria-label={t('nav.notifications')}
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#C17C43]" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] text-[#647A7B] dark:text-[#8BA39F]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Quick Requisition Create Button */}
            <button
              onClick={onOpenCreateRfq}
              className="flex items-center justify-center gap-1 rounded-lg bg-[#173E38] dark:bg-[#2E7A6F] px-2 h-8 text-xs font-semibold text-white shadow-xs active:scale-95 transition-all"
              aria-label={t('rfq.createButton')}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>RFQ</span>
            </button>
          </div>
        </div>

        {/* Expandable Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="px-3.5 pb-2.5 pt-1 border-t border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27] animate-in fade-in duration-150">
            <div className="relative flex items-center">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 h-4 w-4 text-[#647A7B] dark:text-[#8BA39F] pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder={t('nav.mobileSearchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] py-2 pl-9 pr-9 rtl:pl-9 rtl:pr-9 text-xs text-[#17272A] dark:text-[#EBF1F0] placeholder-[#92A4A3] focus:border-[#173E38] dark:focus:border-[#2E7A6F] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 rtl:right-auto rtl:left-3 p-1 text-[#647A7B] dark:text-[#8BA39F]"
                  aria-label={t('common.clearFilter')}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Visible on <= 767px screens) */}
      {/* ========================================================= */}
      <nav
        role="navigation"
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#DDE3E1] dark:border-[#24423D] bg-white/98 dark:bg-[#11211E]/98 backdrop-blur-xl pb-safe pt-1 text-[10px] font-medium text-[#647A7B] dark:text-[#8BA39F] shadow-lg select-none"
      >
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveTab('overview')}
          aria-current={activeTab === 'overview' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all ${
            activeTab === 'overview'
              ? 'text-[#173E38] dark:text-[#4EA89A] font-bold'
              : 'hover:text-[#17272A] dark:hover:text-[#EBF1F0]'
          }`}
        >
          {activeTab === 'overview' && (
            <span className="absolute top-0 h-0.5 w-6 rounded-full bg-[#173E38] dark:bg-[#4EA89A]" />
          )}
          <TrendingUp className="h-4 w-4 mb-0.5 shrink-0" />
          <span>{t('nav.mobile.dashboard')}</span>
        </button>

        {/* 2. RFQs */}
        <button
          onClick={() => setActiveTab('rfqs')}
          aria-current={activeTab === 'rfqs' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all ${
            activeTab === 'rfqs'
              ? 'text-[#173E38] dark:text-[#4EA89A] font-bold'
              : 'hover:text-[#17272A] dark:hover:text-[#EBF1F0]'
          }`}
        >
          {activeTab === 'rfqs' && (
            <span className="absolute top-0 h-0.5 w-6 rounded-full bg-[#173E38] dark:bg-[#4EA89A]" />
          )}
          <FileText className="h-4 w-4 mb-0.5 shrink-0" />
          <span>{t('nav.mobile.rfqs')}</span>
        </button>

        {/* 3. Bids */}
        <button
          onClick={() => setActiveTab('bids')}
          aria-current={activeTab === 'bids' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all ${
            activeTab === 'bids'
              ? 'text-[#173E38] dark:text-[#4EA89A] font-bold'
              : 'hover:text-[#17272A] dark:hover:text-[#EBF1F0]'
          }`}
        >
          {activeTab === 'bids' && (
            <span className="absolute top-0 h-0.5 w-6 rounded-full bg-[#173E38] dark:bg-[#4EA89A]" />
          )}
          <Award className="h-4 w-4 mb-0.5 shrink-0" />
          <span>{t('nav.mobile.bids')}</span>
        </button>

        {/* 4. Vendors */}
        <button
          onClick={() => setActiveTab('vendors')}
          aria-current={activeTab === 'vendors' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all ${
            activeTab === 'vendors'
              ? 'text-[#173E38] dark:text-[#4EA89A] font-bold'
              : 'hover:text-[#17272A] dark:hover:text-[#EBF1F0]'
          }`}
        >
          {activeTab === 'vendors' && (
            <span className="absolute top-0 h-0.5 w-6 rounded-full bg-[#173E38] dark:bg-[#4EA89A]" />
          )}
          <Building2 className="h-4 w-4 mb-0.5 shrink-0" />
          <span>{t('nav.mobile.vendors')}</span>
        </button>

        {/* 5. POs & Governance */}
        <button
          onClick={() => setActiveTab('pos')}
          aria-current={activeTab === 'pos' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] transition-all ${
            activeTab === 'pos'
              ? 'text-[#173E38] dark:text-[#4EA89A] font-bold'
              : 'hover:text-[#17272A] dark:hover:text-[#EBF1F0]'
          }`}
        >
          {activeTab === 'pos' && (
            <span className="absolute top-0 h-0.5 w-6 rounded-full bg-[#173E38] dark:bg-[#4EA89A]" />
          )}
          <ShoppingCart className="h-4 w-4 mb-0.5 shrink-0" />
          <span>{t('nav.mobile.orders')}</span>
          {flaggedPosCount > 0 && (
            <span className="absolute top-1 right-3 rtl:right-auto rtl:left-3 h-2 w-2 rounded-full bg-[#A22424]" />
          )}
        </button>
      </nav>
    </>
  );
};
