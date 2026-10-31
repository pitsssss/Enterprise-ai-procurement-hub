import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  Bot,
  Search,
  Plus,
  Sparkles,
  Sun,
  Moon,
  Globe,
  Bell,
  Sliders,
  User,
  ShieldAlert,
  Loader2,
  Lock,
} from 'lucide-react';
import { LanguageSwitcher } from './components/LanguageSwitcher';

import { RFQ, VendorBid, Vendor, PurchaseOrder, ChatMessage, TabType } from './types/procurement';
import { INITIAL_RFQS, INITIAL_BIDS, INITIAL_VENDORS, INITIAL_POS } from './data/mockData';
import { ProcurementAIService } from './services/aiService';
import {
  subscribeRfqs,
  subscribeBids,
  subscribeVendors,
  subscribePos,
  createRfq,
  awardRfqBid,
  approvePurchaseOrder,
  resolveSoxWaiver,
} from './services/firestoreService';
import { useAuth } from './contexts/AuthContext';

import { Navigation } from './components/Navigation';
import { AiCopilotDrawer } from './components/AiCopilotDrawer';
import { OverviewView } from './components/views/OverviewView';
import { RfqsView } from './components/views/RfqsView';
import { BidsView } from './components/views/BidsView';
import { VendorsView } from './components/views/VendorsView';
import { PosView } from './components/views/PosView';
import { OrganizationSettingsView } from './components/views/OrganizationSettingsView';
import { UserProfileView } from './components/views/UserProfileView';
import { NotificationsDrawer } from './components/views/NotificationsDrawer';
import { LandingPage } from './components/public/LandingPage';
import { AuthModal, AuthMode } from './components/public/AuthModal';
import { ContactSalesModal } from './components/public/ContactSalesModal';
import { CreateRfqModal } from './components/modals/CreateRfqModal';
import { AwardModal } from './components/modals/AwardModal';
import { ResolveSoxWaiverModal } from './components/modals/ResolveSoxWaiverModal';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';

export default function App() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const {
    user,
    profile,
    organization,
    actualRole,
    userRole,
    isSimulatingRole,
    clearRoleSimulation,
    loading: authLoading,
    canPerform,
  } = useAuth();

  // Public vs Workspace View Mode
  const [viewMode, setViewMode] = useState<'workspace' | 'public'>('workspace');

  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      return next;
    });
  };

  // Core Application Data State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [bids, setBids] = useState<VendorBid[]>(INITIAL_BIDS);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [pos, setPos] = useState<PurchaseOrder[]>(INITIAL_POS);

  const orgId = organization?.id || 'org-synthetix-enterprise';

  // Live Firestore Data Synchronization
  useEffect(() => {
    if (!user || !orgId) return;

    const unsubRfqs = subscribeRfqs(orgId, (items) => {
      if (items.length > 0) setRfqs(items);
    });
    const unsubBids = subscribeBids(orgId, (items) => {
      if (items.length > 0) setBids(items);
    });
    const unsubVendors = subscribeVendors(orgId, (items) => {
      if (items.length > 0) setVendors(items);
    });
    const unsubPos = subscribePos(orgId, (items) => {
      if (items.length > 0) setPos(items);
    });

    return () => {
      unsubRfqs();
      unsubBids();
      unsubVendors();
      unsubPos();
    };
  }, [user, orgId]);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [rfqCategoryFilter, setRfqCategoryFilter] = useState('ALL');
  const [selectedRfqId, setSelectedRfqId] = useState<string>('rfq-101');
  const [vendorTierFilter, setVendorTierFilter] = useState('ALL');

  // Modals & Action States
  const [isCreateRfqModalOpen, setIsCreateRfqModalOpen] = useState(false);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [selectedBidForAward, setSelectedBidForAward] = useState<VendorBid | null>(null);
  const [isSoxWaiverModalOpen, setIsSoxWaiverModalOpen] = useState(false);
  const [selectedPoForWaiver, setSelectedPoForWaiver] = useState<PurchaseOrder | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'warn' } | null>(null);

  // New RFQ Form State
  const [newRfqTitle, setNewRfqTitle] = useState('');
  const [newRfqCategory, setNewRfqCategory] = useState<'IT Hardware' | 'Precision Machining' | 'Facility Operations' | 'Logistics' | 'Raw Materials'>('IT Hardware');
  const [newRfqBudget, setNewRfqBudget] = useState(150000);
  const [newRfqDept, setNewRfqDept] = useState('Infrastructure Engineering');

  // AI Copilot State
  const [copilotDrawerOpen, setCopilotDrawerOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [useLiveGemini, setUseLiveGemini] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      timestamp: '09:15 AM',
      content: t('copilot.initialWelcome'),
      mode: 'SIMULATED_PRESET',
      citations: ['[SOX-Sec-404]', '[FAR-52.204-24]'],
      suggestedAction: {
        label: t('copilot.actionInspectFlagged'),
        actionType: 'NAVIGATE_TAB',
        payload: 'pos',
      },
    },
  ]);

  // Sync initial welcome message if user toggles language before chatting
  useEffect(() => {
    setChatMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'm-1') {
        return [
          {
            id: 'm-1',
            sender: 'assistant',
            timestamp: '09:15 AM',
            content: t('copilot.initialWelcome'),
            mode: 'SIMULATED_PRESET',
            citations: ['[SOX-Sec-404]', '[FAR-52.204-24]'],
            suggestedAction: {
              label: t('copilot.actionInspectFlagged'),
              actionType: 'NAVIGATE_TAB',
              payload: 'pos',
            },
          },
        ];
      }
      return prev;
    });
  }, [i18n.language, t]);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Keyboard shortcut for Command/Ctrl + K (Quick Search / Copilot)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCopilotDrawerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered RFQs based on search and category
  const filteredRfqs = useMemo(() => {
    return rfqs.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.rfqNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = rfqCategoryFilter === 'ALL' || r.category === rfqCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [rfqs, searchQuery, rfqCategoryFilter]);

  // Active RFQ object
  const activeRfq = useMemo(() => {
    return rfqs.find((r) => r.id === selectedRfqId) || rfqs[0];
  }, [rfqs, selectedRfqId]);

  // Bids for the active RFQ
  const activeBidsForCurrentRfq = useMemo(() => {
    if (!activeRfq) return [];
    return bids.filter((b) => b.rfqId === activeRfq.id);
  }, [bids, activeRfq]);

  // Filtered Vendors based on search and tier
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = vendorTierFilter === 'ALL' || v.tier === vendorTierFilter;
      return matchesSearch && matchesTier;
    });
  }, [vendors, searchQuery, vendorTierFilter]);

  // Calculated Metrics
  const totalPipelineSpend = useMemo(() => {
    return rfqs.reduce((acc, curr) => acc + curr.budget, 0);
  }, [rfqs]);

  const flaggedPosCount = useMemo(() => {
    return pos.filter((p) => p.status === 'FLAGGED').length;
  }, [pos]);

  const openRfqsCount = useMemo(() => {
    return rfqs.filter((r) => r.status === 'OPEN_FOR_BIDS' || r.status === 'EVALUATION').length;
  }, [rfqs]);

  // AI Chat Handler
  const handleSendPrompt = async (promptText?: string) => {
    const text = promptText || chatInput;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text,
      mode: 'SIMULATED_PRESET',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);
    setCopilotDrawerOpen(true);

    const context = {
      rfqs,
      bids,
      pos,
      vendors,
      selectedRfq: activeRfq,
      userRole,
      organizationName: organization?.name,
    };

    try {
      const response = await ProcurementAIService.queryAssistant(text, context, useLiveGemini, i18n.language);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: response.content,
        mode: response.mode,
        citations: response.citations,
        suggestedAction: response.suggestedAction,
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: isArabic
          ? 'تم تقييم مسار المشتريات مقابل ضوابط الإنفاق الداخلية. جميع المعاملات ضمن الصلاحيات المعتمدة.'
          : 'Pipeline evaluated against internal spend controls. All parameters remain within authorized delegations.',
        mode: 'SIMULATED_PRESET',
        citations: ['[SOX-Sec-404]'],
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleExecuteSuggestedAction = (action: ChatMessage['suggestedAction']) => {
    if (!action) return;
    if (action.actionType === 'NAVIGATE_TAB') {
      setActiveTab(action.payload as TabType);
      setCopilotDrawerOpen(false);
    } else if (action.actionType === 'OPEN_COMPARISON') {
      setSelectedRfqId(action.payload);
      setActiveTab('bids');
      setCopilotDrawerOpen(false);
    } else if (action.actionType === 'APPROVE_PO') {
      handleApprovePo(action.payload);
      setCopilotDrawerOpen(false);
    }
  };

  // PO Action Handlers
  const handleApprovePo = async (poId: string) => {
    if (!canPerform('APPROVE_PO')) {
      showToast(
        t('toasts.permissionsDeniedTitle'),
        t('toasts.permissionsDeniedDesc', { role: userRole }),
        'warn'
      );
      return;
    }

    const targetPo = pos.find((p) => p.id === poId);
    if (!targetPo) return;

    try {
      await approvePurchaseOrder(
        orgId,
        poId,
        targetPo.poNumber,
        {
          uid: user?.uid || 'local-actor',
          email: user?.email || 'signatory@synthetix.corp',
          role: userRole,
        }
      );
      showToast(
        t('toasts.dualSignoffTitle'),
        t('toasts.dualSignoffDesc', { poNumber: targetPo.poNumber })
      );
    } catch (err: any) {
      showToast(t('toasts.approvalFailedTitle'), err.message, 'warn');
    }
  };

  const handleOpenWaiverModal = (poId: string) => {
    const targetPo = pos.find((p) => p.id === poId);
    if (targetPo) {
      setSelectedPoForWaiver(targetPo);
      setIsSoxWaiverModalOpen(true);
    }
  };

  const handleConfirmWaiver = async (po: PurchaseOrder, justification: string) => {
    try {
      await resolveSoxWaiver(
        orgId,
        po.id,
        po.poNumber,
        justification,
        {
          uid: user?.uid || 'finance-signatory',
          email: user?.email || 'finance@synthetix.corp',
          role: userRole,
        }
      );
      showToast(
        t('toasts.soxClearedTitle'),
        t('toasts.soxClearedDesc', { poNumber: po.poNumber })
      );
    } catch (err: any) {
      showToast(t('toasts.waiverFailedTitle'), err.message, 'warn');
    }
  };

  // Award Bid Handler
  const handleAwardBid = async (bid: VendorBid) => {
    if (!activeRfq) return;
    if (!canPerform('AWARD_BID')) {
      showToast(
        t('toasts.permissionsDeniedTitle'),
        t('toasts.permissionsDeniedDesc', { role: userRole }),
        'warn'
      );
      return;
    }

    try {
      const { newPo } = await awardRfqBid(
        orgId,
        activeRfq.id,
        bid,
        {
          uid: user?.uid || 'buyer-uid',
          email: user?.email || 'buyer@synthetix.corp',
          role: userRole,
        }
      );

      setIsAwardModalOpen(false);
      setSelectedBidForAward(null);

      const holdSuffix = newPo.status === 'FLAGGED' ? t('toasts.awardHoldSuffix') : '';
      showToast(
        t('toasts.awardFinalizedTitle'),
        t('toasts.awardFinalizedDesc', {
          vendorName: bid.vendorName,
          poNumber: newPo.poNumber,
          holdSuffix,
        })
      );

      setActiveTab('pos');
    } catch (err: any) {
      showToast(t('toasts.awardFailedTitle'), err.message, 'warn');
    }
  };

  // Create New RFQ Requisition Handler
  const handleCreateNewRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRfqTitle.trim()) return;

    if (!canPerform('CREATE_RFQ')) {
      showToast(
        t('toasts.permissionsDeniedTitle'),
        t('toasts.permissionsDeniedDesc', { role: userRole }),
        'warn'
      );
      return;
    }

    const rfqNum = `RFQ-2025-${Math.floor(2000 + Math.random() * 8000)}`;

    try {
      await createRfq(
        orgId,
        {
          rfqNumber: rfqNum,
          title: newRfqTitle,
          category: newRfqCategory,
          department: newRfqDept,
          budget: Number(newRfqBudget),
          estTotalValue: Number(newRfqBudget) * 0.94,
          status: 'OPEN_FOR_BIDS',
          deadline: '2025-06-30',
          lineItems: [
            {
              id: `li-${Date.now()}`,
              sku: 'SKU-NEW-PKG',
              description: 'Custom verified enterprise line package',
              quantity: 10,
              unit: 'Units',
              targetPrice: Number(newRfqBudget) / 10,
            },
          ],
          invitedVendorsCount: 3,
          bidsReceivedCount: 0,
          policyNotes: 'Automated standard SOX dual-approval guidelines applied.',
        },
        {
          uid: user?.uid || 'creator-uid',
          email: user?.email || 'buyer@synthetix.corp',
          role: userRole,
        }
      );

      setIsCreateRfqModalOpen(false);
      setNewRfqTitle('');
      showToast(
        t('toasts.reqPublishedTitle'),
        t('toasts.reqPublishedDesc', { rfqNumber: rfqNum })
      );
      setActiveTab('rfqs');
    } catch (err: any) {
      showToast(t('toasts.reqFailedTitle'), err.message, 'warn');
    }
  };

  // If initial auth is loading:
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F6F5F1] dark:bg-[#0B1614] text-[#17272A] dark:text-[#EBF1F0]">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#173E38] dark:text-[#4EA89A]" />
          <p className="text-xs font-semibold text-[#647A7B] dark:text-[#8BA39F]">
            Authenticating enterprise session & cryptographic keys...
          </p>
        </div>
      </div>
    );
  }

  // If user is in Public Landing Page mode or not authenticated:
  if (viewMode === 'public' || !user) {
    return (
      <>
        <LandingPage
          onEnterApp={() => {
            if (user) {
              setViewMode('workspace');
            } else {
              setAuthMode('signin');
              setIsAuthModalOpen(true);
            }
          }}
          onOpenAuth={(mode = 'signin') => {
            setAuthMode(mode);
            setIsAuthModalOpen(true);
          }}
          onOpenContact={() => setIsContactModalOpen(true)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
          onSuccess={(email) => {
            showToast('Authenticated Successfully', `Welcome to Synthetix Hub, ${email}.`);
            setViewMode('workspace');
          }}
        />

        <ContactSalesModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          onSuccess={() => {
            showToast('Consultation Requested', 'Our Enterprise Sourcing Principal will connect shortly.');
          }}
        />
      </>
    );
  }

  // Workspace Mode:
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden bg-[#F6F5F1] dark:bg-[#0B1614] font-sans text-[#17272A] dark:text-[#EBF1F0] antialiased selection:bg-[#173E38]/15 selection:text-[#173E38] transition-colors">
      {/* ========================================================= */}
      {/* 1. NAVIGATION (Sidebar on desktop, Top App Bar + Bottom Nav on mobile) */}
      {/* ========================================================= */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        rfqsCount={rfqs.length}
        vendorsCount={vendors.length}
        flaggedPosCount={flaggedPosCount}
        onOpenCreateRfq={() => setIsCreateRfqModalOpen(true)}
        onToggleCopilot={() => setCopilotDrawerOpen(!copilotDrawerOpen)}
        isCopilotOpen={copilotDrawerOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobileSearchOpen={isMobileSearchOpen}
        setIsMobileSearchOpen={setIsMobileSearchOpen}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={flaggedPosCount > 0 ? flaggedPosCount + 1 : 1}
        onSwitchToPublicSite={() => setViewMode('public')}
      />

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE VIEWPORT */}
      {/* ========================================================= */}
      <main className="flex flex-1 flex-col overflow-hidden bg-[#F6F5F1] dark:bg-[#0B1614] min-w-0">
        {/* Desktop Top Header Bar (Hidden on <= 767px Mobile) */}
        <header className="hidden md:flex h-16 items-center justify-between border-b border-[#DDE3E1] dark:border-[#24423D] px-6 bg-white/80 dark:bg-[#11211E]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-80">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-2.5 h-4 w-4 text-[#647A7B] dark:text-[#8BA39F] pointer-events-none" />
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27] py-2 pl-9 pr-3 rtl:pl-3 rtl:pr-9 text-xs text-[#17272A] dark:text-[#EBF1F0] placeholder-[#92A4A3] focus:border-[#173E38] dark:focus:border-[#2E7A6F] focus:outline-none"
              />
            </div>

            <button
              onClick={() => setViewMode('public')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0] hover:bg-[#FAF9F6] dark:hover:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D] transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-[#C17C43] dark:text-[#D48D55]" />
              <span>{t('nav.publicSite')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher Dropdown */}
            <LanguageSwitcher variant="dropdown" />

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0] transition-colors"
              aria-label={t('nav.notifications')}
            >
              <Bell className="h-4 w-4" />
              {flaggedPosCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#C17C43]" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0] transition-colors"
              aria-label={isDark ? t('nav.themeLight') : t('nav.themeDark')}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Create Requisition */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateRfqModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              {t('rfq.createButton')}
            </Button>

            {/* AI Copilot Trigger */}
            <Button
              variant={copilotDrawerOpen ? 'accent' : 'secondary'}
              size="sm"
              onClick={() => setCopilotDrawerOpen(!copilotDrawerOpen)}
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              <span>{t('nav.copilotButton')}</span>
              <span className="h-2 w-2 rounded-full bg-[#1B6A4A] dark:bg-[#38B482]" />
            </Button>
          </div>
        </header>

        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed top-16 sm:top-20 left-3 right-3 sm:left-auto sm:right-8 rtl:sm:right-auto rtl:sm:left-8 sm:w-auto z-50 flex items-center gap-3 rounded-xl border border-[#173E38]/30 dark:border-[#2E7A6F]/40 bg-white dark:bg-[#11211E] p-3.5 sm:p-4 text-xs shadow-xl animate-in fade-in slide-in-from-top-4 duration-150 max-w-md">
            <CheckCircle2 className="h-5 w-5 text-[#1B6A4A] dark:text-[#38B482] shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-[#17272A] dark:text-[#EBF1F0] text-xs sm:text-sm">{toastMessage.title}</p>
              <p className="text-[#647A7B] dark:text-[#8BA39F] mt-0.5 text-[11px] sm:text-xs leading-relaxed">{toastMessage.desc}</p>
            </div>
          </div>
        )}

        {/* Role Preview Warning Banner */}
        {isSimulatingRole && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 px-4 py-2 text-xs flex items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[10px] uppercase bg-amber-200 dark:bg-amber-900 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-100">
                {isArabic ? 'معاينة محاكاة' : 'UI Preview Mode'}
              </span>
              <span>
                {isArabic
                  ? `أنت تشاهد واجهة المستخدم بدور: ${t(`roles.${userRole}`, userRole)}. صلاحياتك الحقيقية (${t(`roles.${actualRole}`, actualRole)}) محمية بقواعد أمان Firestore.`
                  : `Previewing UI as ${userRole}. Persistent authorization (${actualRole}) is strictly enforced by Firestore security rules.`}
              </span>
            </div>
            <button
              onClick={clearRoleSimulation}
              className="text-xs font-semibold underline hover:no-underline text-amber-950 dark:text-amber-100 shrink-0"
            >
              {isArabic ? 'إلغاء المعاينة' : 'Exit Preview'}
            </button>
          </div>
        )}

        {/* Content Body View Manager */}
        <div className="flex-1 overflow-y-auto touch-scroll p-4 sm:p-6 pb-28 md:pb-6 min-w-0">
          {activeTab === 'overview' && (
            <OverviewView
              rfqs={rfqs}
              pos={pos}
              totalPipelineSpend={totalPipelineSpend}
              openRfqsCount={openRfqsCount}
              bidsUnderReviewCount={bids.length}
              flaggedPosCount={flaggedPosCount}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onResolveFlag={handleOpenWaiverModal}
              onEvaluateBids={(rfqId) => {
                setSelectedRfqId(rfqId);
                setActiveTab('bids');
              }}
              onSendPrompt={handleSendPrompt}
            />
          )}

          {activeTab === 'rfqs' && (
            <RfqsView
              rfqs={filteredRfqs}
              categoryFilter={rfqCategoryFilter}
              setCategoryFilter={setRfqCategoryFilter}
              onOpenCreateModal={() => setIsCreateRfqModalOpen(true)}
              onEvaluateBids={(rfqId) => {
                setSelectedRfqId(rfqId);
                setActiveTab('bids');
              }}
              onSendPrompt={handleSendPrompt}
            />
          )}

          {activeTab === 'bids' && (
            <BidsView
              rfqs={rfqs}
              activeRfq={activeRfq}
              selectedRfqId={selectedRfqId}
              setSelectedRfqId={setSelectedRfqId}
              activeBids={activeBidsForCurrentRfq}
              onSelectBidForAward={(bid) => {
                setSelectedBidForAward(bid);
                setIsAwardModalOpen(true);
              }}
              onSimulateIncomingBids={() => {
                if (!activeRfq) return;
                const mockBid: VendorBid = {
                  id: `bid-${Date.now()}`,
                  orgId,
                  rfqId: activeRfq.id,
                  vendorId: 'v-1',
                  vendorName: 'Apex Data Infrastructures',
                  unitPriceTotal: activeRfq.budget * 0.92,
                  leadTimeWeeks: 4,
                  warrantyMonths: 36,
                  esgScore: 91,
                  complianceRate: 98.5,
                  riskLevel: 'LOW',
                  aiRecommendationScore: 94,
                  keyDifferentiator: 'Direct Tier-1 allocation with accelerated QA testing and fast dispatch.',
                  quoteRef: `QU-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
                  submissionDate: new Date().toISOString().split('T')[0],
                };
                setBids((prev) => [mockBid, ...prev]);
                showToast('Supplier Proposal Ingested', `Apex Data submitted quote for ${activeRfq.rfqNumber}.`);
              }}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorsView
              filteredVendors={filteredVendors}
              vendorTierFilter={vendorTierFilter}
              setVendorTierFilter={setVendorTierFilter}
              onAuditVendor={(vendorName) => {
                handleSendPrompt(`Audit performance history and ESG compliance risks for supplier ${vendorName}`);
              }}
            />
          )}

          {activeTab === 'pos' && (
            <PosView
              pos={pos}
              onApprovePo={handleApprovePo}
              onResolveFlag={handleOpenWaiverModal}
              onBatchAudit={() => {
                handleSendPrompt('Audit all open purchase orders for SOX Section 404 thresholds and single-source exposure');
              }}
            />
          )}

          {activeTab === 'org' && <OrganizationSettingsView />}

          {activeTab === 'profile' && <UserProfileView />}
        </div>

        {/* Floating AI Copilot Trigger for Mobile (< md screens) */}
        <div className="md:hidden fixed bottom-20 right-4 z-30">
          <button
            onClick={() => setCopilotDrawerOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#173E38] dark:bg-[#2E7A6F] px-4 py-3 text-xs font-bold text-white shadow-lg border border-[#C17C43]/40 active:scale-95 transition-all"
            aria-label="Open AI Copilot Chat"
          >
            <Sparkles className="h-4 w-4 text-[#C17C43] dark:text-[#D48D55]" />
            <span>Copilot</span>
            <span className="flex h-2 w-2 rounded-full bg-[#1B6A4A] dark:bg-[#38B482] animate-pulse" />
          </button>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 3. AI SOURCING COPILOT */}
      {/* ========================================================= */}
      <AiCopilotDrawer
        isOpen={copilotDrawerOpen}
        onClose={() => setCopilotDrawerOpen(false)}
        chatMessages={chatMessages}
        isAiTyping={isAiTyping}
        chatInput={chatInput}
        setChatInput={setChatInput}
        onSendPrompt={handleSendPrompt}
        onExecuteSuggestedAction={handleExecuteSuggestedAction}
        useLiveGemini={useLiveGemini}
        setUseLiveGemini={setUseLiveGemini}
      />

      {/* ========================================================= */}
      {/* 4. NOTIFICATIONS DRAWER */}
      {/* ========================================================= */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* ========================================================= */}
      {/* 5. MODALS */}
      {/* ========================================================= */}
      <CreateRfqModal
        isOpen={isCreateRfqModalOpen}
        onClose={() => setIsCreateRfqModalOpen(false)}
        title={newRfqTitle}
        setTitle={setNewRfqTitle}
        category={newRfqCategory}
        setCategory={setNewRfqCategory}
        budget={newRfqBudget}
        setBudget={setNewRfqBudget}
        department={newRfqDept}
        setDepartment={setNewRfqDept}
        onSubmit={handleCreateNewRfq}
      />

      <AwardModal
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
        selectedBid={selectedBidForAward}
        onConfirmAward={handleAwardBid}
      />

      <ResolveSoxWaiverModal
        isOpen={isSoxWaiverModalOpen}
        onClose={() => {
          setIsSoxWaiverModalOpen(false);
          setSelectedPoForWaiver(null);
        }}
        purchaseOrder={selectedPoForWaiver}
        onConfirmWaiver={handleConfirmWaiver}
        userRole={userRole}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={(email) => {
          showToast('Authenticated Successfully', `Welcome back, ${email}.`);
        }}
      />

      <ContactSalesModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSuccess={() => {
          showToast('Consultation Requested', 'Our Enterprise Sourcing Principal will connect shortly.');
        }}
      />
    </div>
  );
}
