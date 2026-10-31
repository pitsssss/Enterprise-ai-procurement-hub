import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { LanguageSwitcher } from '../LanguageSwitcher';
import {
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Layers,
  Scale,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  Building2,
  DollarSign,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: (mode?: 'signin' | 'invite') => void;
  onOpenContact: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenAuth,
  onOpenContact,
  isDark,
  onToggleTheme,
}) => {
  const { t, i18n } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const isArabic = i18n.language === 'ar';

  const faqs = isArabic
    ? [
        {
          q: 'كيف تفرض سينثتكس ضوابط الاعتماد الثنائي وفق معيار SOX 404؟',
          a: 'أي أمر شراء أو التزام مالي يتجاوز السقف المحدد ($250,000 كحد أساسي) يفعّل تلقائياً وضع التعليق المالي. يجب أن يقوم مسؤول مالي ومفوض توريد معتمد بمراجعة الأمر وفك تعليقه بصورة مستقلة. تتطلب المشتريات ذات المصدر الفردي إرفاق نموذج CS-8 المعتمد لإعفاء المورد الوحيد قبل الإرسال لأنظمة ERP.',
        },
        {
          q: 'هل ترتبط المنصة بأنظمة SAP S/4HANA و Workday و Coupa؟',
          a: 'نعم. توفر سينثتكس موصلات تكامل ثنائية الاتجاه (REST و OData). عند ترسية العقود، تتم مزامنة أوامر الشراء وسجلات الموردين فورياً مع النظام المالي الأساسي لمؤسستك دون أي إدخال يدوي مكرر.',
        },
        {
          q: 'كيف يضمن المساعد الذكي دقة التحليلات وتجنب الهلوسة؟',
          a: 'يعمل المساعد بدقة داخل سياق بيانات المؤسسة الحية (طلبات RFQ النشطة، البنود المعتمدة، سجلات تدقيق الموردين، وحدود الصلاحيات المالية). تشتمل كل توصية على مراجع تشريعية دقيقة ومصفوفة درجات رقمية محددة.',
        },
        {
          q: 'ما هي خيارات الاستضافة المتاحة لضمان سيادة البيانات؟',
          a: 'يمكن استضافة سينثتكس في سحابتنا المعتمدة بشهادة SOC2 Type II، أو في بيئات سحابية افتراضية خاصة (VPC) مثل Google Cloud و AWS، مع دعم التشفير بمفاتيح يتحكم فيها العميل (CMEK).',
        },
      ]
    : [
        {
          q: 'How does Synthetix enforce SOX Section 404 dual-signoff policies?',
          a: 'Any requisition or purchase commitment exceeding configured thresholds ($250,000 baseline) automatically triggers a dual-custody hold. A certified Treasury Officer and an authorized Sourcing Principal must independently clear the order. Single-source allocations require an executed Form CS-8 Sole-Source Justification waiver prior to ERP dispatch.',
        },
        {
          q: 'Does Synthetix connect with SAP S/4HANA, Workday, and Coupa?',
          a: 'Yes. Synthetix provides bidirectional REST and OData connectors. Once bids converge and contracts are awarded, purchase orders and master supplier records sync instantaneously into your core financial system without manual re-entry.',
        },
        {
          q: 'How does the AI Copilot maintain factual grounding and avoid hallucination?',
          a: 'The Copilot operates strictly on live tenant schema context (active RFQs, verified line items, supplier audit history, and internal policy thresholds). Every recommendation includes deterministic policy citations (e.g. [FAR-52.204], [SOX-Sec-404]) and weighted multi-criteria scoring.',
        },
        {
          q: 'What deployment models are supported for strict data sovereignty?',
          a: 'Synthetix can be hosted in our SOC2 Type II audited cloud, private single-tenant VPCs (AWS GovCloud, Google Cloud Assured Workloads), or hybrid enterprise configurations with customer-managed encryption keys (CMEK).',
        },
      ];

  return (
    <div className="min-h-screen bg-[#F6F5F1] dark:bg-[#0B1614] text-[#17272A] dark:text-[#EBF1F0] selection:bg-[#173E38]/20 transition-colors">
      {/* 1. Global Public Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#DDE3E1] dark:border-[#24423D] bg-[#F6F5F1]/90 dark:bg-[#0B1614]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Logo size="md" variant="horizontal" />
            <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-[#647A7B] dark:text-[#8BA39F]">
              <a href="#platform" className="hover:text-[#17272A] dark:hover:text-[#EBF1F0] transition-colors">
                {t('landing.featuresTitle')}
              </a>
              <a href="#governance" className="hover:text-[#17272A] dark:hover:text-[#EBF1F0] transition-colors">
                {t('landing.f1Title')}
              </a>
              <a href="#faq" className="hover:text-[#17272A] dark:hover:text-[#EBF1F0] transition-colors">
                {isArabic ? 'الأسئلة الشائعة' : 'FAQ'}
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <LanguageSwitcher variant="dropdown" />

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0] transition-colors"
              aria-label={isDark ? t('nav.themeLight') : t('nav.themeDark')}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => onOpenAuth('signin')}
              className="hidden sm:inline-flex text-xs font-medium text-[#173E38] dark:text-[#4EA89A] hover:underline px-2.5 py-1.5"
            >
              {t('auth.title')}
            </button>

            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenContact}
              className="hidden lg:inline-flex"
            >
              {t('landing.ctaSales')}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onEnterApp}
              rightIcon={<ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />}
            >
              {t('landing.ctaDemo')}
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#DDE3E1] dark:border-[#24423D]">
        <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#173E38_1px,transparent_1px)] dark:bg-[radial-gradient(#2E7A6F_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] px-3.5 py-1 text-xs font-medium text-[#173E38] dark:text-[#4EA89A] shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#C17C43] dark:bg-[#D48D55]" />
              <span>{t('landing.badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0] leading-[1.12]">
              {t('landing.heroTitle1')}{' '}
              <span className="text-[#173E38] dark:text-[#4EA89A]">{t('landing.heroTitle2')}</span>
            </h1>

            <p className="text-sm sm:text-lg text-[#647A7B] dark:text-[#8BA39F] max-w-2xl mx-auto leading-relaxed">
              {t('landing.heroSubtitle')}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={onEnterApp}
                rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}
                className="shadow-sm font-semibold"
              >
                {t('landing.ctaDemo')}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onOpenContact}
              >
                {t('landing.ctaSales')}
              </Button>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#1B6A4A] dark:text-[#38B482]" />
                {isArabic ? 'بدون بيانات تجريبية وهمية' : 'Zero Mock Fallbacks'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#1B6A4A] dark:text-[#38B482]" />
                {t('landing.statSox')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#1B6A4A] dark:text-[#38B482]" />
                {isArabic ? 'بوابات محاكاة لأنظمة SAP و Workday' : 'Simulated SAP & Workday Gateways'}
              </span>
            </div>
          </div>

          {/* Interactive Workspace Live Preview Frame */}
          <div className="mt-12 sm:mt-16 rounded-2xl border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] shadow-xl overflow-hidden">
            <div className="flex h-11 items-center justify-between border-b border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27] px-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#E6ECEB] dark:bg-[#24423D]" />
                <span className="h-3 w-3 rounded-full bg-[#E6ECEB] dark:bg-[#24423D]" />
                <span className="h-3 w-3 rounded-full bg-[#E6ECEB] dark:bg-[#24423D]" />
                <span className="ml-2 rtl:ml-0 rtl:mr-2 font-mono text-[11px] text-[#647A7B] dark:text-[#8BA39F]" dir="ltr">
                  app.synthetix.corp/workspace/rfq-2025-0891/bids
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm" dot>
                  {isArabic ? 'عقدة تشغيل إنتاجية نشطة' : 'Live Production Node'}
                </Badge>
                <Button variant="ghost" size="sm" onClick={onEnterApp} className="text-xs">
                  {isArabic ? 'دخول مساحة العمل' : 'Interact Now'}
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-[#F6F5F1] dark:bg-[#0B1614] space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <Card padding="sm" className="bg-white dark:bg-[#11211E]">
                  <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">{t('landing.statSpend')}</p>
                  <p className="text-lg sm:text-2xl font-bold tabular-nums text-[#17272A] dark:text-[#EBF1F0]" dir="ltr">
                    $1.025M
                  </p>
                  <span className="text-[10px] text-[#1B6A4A] font-medium">
                    {isArabic ? '+14.2% وفورات متحققة' : '+14.2% optimized'}
                  </span>
                </Card>
                <Card padding="sm" className="bg-white dark:bg-[#11211E]">
                  <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">{t('dashboard.openRfqs')}</p>
                  <p className="text-lg sm:text-2xl font-bold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                    {isArabic ? '12 عرضاً' : '12 Offers'}
                  </p>
                  <span className="text-[10px] text-[#C17C43] font-medium">
                    {isArabic ? '3 توصيات معتمدة' : '3 recommended'}
                  </span>
                </Card>
                <Card padding="sm" className="bg-white dark:bg-[#11211E]">
                  <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">{t('landing.statAudit')}</p>
                  <p className="text-lg sm:text-2xl font-bold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                    99.4%
                  </p>
                  <span className="text-[10px] text-[#1B6A4A] font-medium">
                    {isArabic ? '1 إعفاء قيد التوقيع' : '1 waiver pending'}
                  </span>
                </Card>
                <Card padding="sm" className="bg-white dark:bg-[#11211E]">
                  <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">{t('landing.statLatency')}</p>
                  <p className="text-lg sm:text-2xl font-bold tabular-nums text-[#17272A] dark:text-[#EBF1F0]">
                    180ms
                  </p>
                  <span className="text-[10px] text-[#1B6A4A] font-medium">
                    {isArabic ? 'استدلال Gemini 3.8 السحابي' : 'Gemini 3.8 Flash Cloud'}
                  </span>
                </Card>
              </div>

              {/* Sample Live Evaluation Matrix Row */}
              <div className="rounded-xl border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-[#17272A] dark:text-[#EBF1F0]">
                      Apex Data Infrastructures vs HyperScale Micro-Electronics
                    </span>
                    <Badge variant="primary" size="sm">
                      {isArabic ? 'الأعلى توصية' : 'Top Recommended'}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                    <span dir="ltr">RFQ-2025-0891</span> • 4x NVIDIA H200 SXM5 Chassis • {isArabic ? '$31,500 أقل من سقف الميزانية مع ضمان 36 شهراً' : '$31,500 under budget ceiling with 36-mo tier warranty'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="accent" size="sm" onClick={onEnterApp}>
                    {isArabic ? 'تجربة الترسية' : 'Simulate Award'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Enterprise Performance Benchmarks */}
      <section className="py-12 border-b border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold tabular-nums text-[#173E38] dark:text-[#4EA89A]" dir="ltr">14.8%</p>
              <p className="mt-1 text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                {isArabic ? 'متوسط تقليص الأسعار' : 'Average Price Reduction'}
              </p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                {isArabic ? 'عبر مصفوفة تقارب عروض الموردين' : 'Through multi-round bid convergence'}
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold tabular-nums text-[#173E38] dark:text-[#4EA89A]" dir="ltr">72%</p>
              <p className="mt-1 text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                {isArabic ? 'تسريع دورة المشتريات' : 'Cycle Time Acceleration'}
              </p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                {isArabic ? 'من نشر الطلب إلى إصدار أمر الشراء' : 'From requisition release to purchase order'}
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold tabular-nums text-[#173E38] dark:text-[#4EA89A]" dir="ltr">100%</p>
              <p className="mt-1 text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                {isArabic ? 'تتبع كامل لامتثال SOX' : 'SOX Audit Traceability'}
              </p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                {isArabic ? 'الاعتماد الثنائي ونموذج CS-8' : 'Dual-signoff and Form CS-8 tracking'}
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold tabular-nums text-[#173E38] dark:text-[#4EA89A]" dir="ltr">$1.4B+</p>
              <p className="mt-1 text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                {isArabic ? 'حجم الإنفاق المؤسسي المدار' : 'Enterprise Spend Governed'}
              </p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                {isArabic ? 'في مجالات التقنية واللوجستيات والتصنيع' : 'Across hardware, logistics, and machining'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Strategic Platform Pillars */}
      <section id="platform" className="py-16 sm:py-20 border-b border-[#DDE3E1] dark:border-[#24423D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <Badge variant="accent" size="sm">
              {isArabic ? 'الأسس المعمارية' : 'ARCHITECTURAL FOUNDATIONS'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
              {t('landing.featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Pillar 1 */}
            <Card padding="md" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#173E38]/10 text-[#173E38] dark:bg-[#2E7A6F]/20 dark:text-[#4EA89A]">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#17272A] dark:text-[#EBF1F0]">
                {t('landing.f2Title')}
              </h3>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F] leading-relaxed">
                {t('landing.f2Desc')}
              </p>
            </Card>

            {/* Pillar 2 */}
            <Card padding="md" className="space-y-3" id="governance">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#173E38]/10 text-[#173E38] dark:bg-[#2E7A6F]/20 dark:text-[#4EA89A]">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#17272A] dark:text-[#EBF1F0]">
                {t('landing.f1Title')}
              </h3>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F] leading-relaxed">
                {t('landing.f1Desc')}
              </p>
            </Card>

            {/* Pillar 3 */}
            <Card padding="md" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C17C43]/10 text-[#C17C43] dark:bg-[#D48D55]/20 dark:text-[#D48D55]">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#17272A] dark:text-[#EBF1F0]">
                {t('landing.f3Title')}
              </h3>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F] leading-relaxed">
                {t('landing.f3Desc')}
              </p>
            </Card>

            {/* Pillar 4 */}
            <Card padding="md" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#173E38]/10 text-[#173E38] dark:bg-[#2E7A6F]/20 dark:text-[#4EA89A]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#17272A] dark:text-[#EBF1F0]">
                {t('landing.f4Title')}
              </h3>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F] leading-relaxed">
                {t('landing.f4Desc')}
              </p>
            </Card>

            {/* Pillar 5 */}
            <Card padding="md" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#173E38]/10 text-[#173E38] dark:bg-[#2E7A6F]/20 dark:text-[#4EA89A]">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#17272A] dark:text-[#EBF1F0]">
                {t('landing.f5Title')}
              </h3>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F] leading-relaxed">
                {t('landing.f5Desc')}
              </p>
            </Card>

            {/* Pillar 6 */}
            <Card padding="md" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C17C43]/10 text-[#C17C43] dark:bg-[#D48D55]/20 dark:text-[#D48D55]">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#17272A] dark:text-[#EBF1F0]">
                {t('landing.f6Title')}
              </h3>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F] leading-relaxed">
                {t('landing.f6Desc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Executive Quote */}
      <section className="py-12 bg-[#FAF9F6] dark:bg-[#162B27] border-b border-[#DDE3E1] dark:border-[#24423D]">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-4">
          <p className="text-base sm:text-xl font-medium italic text-[#17272A] dark:text-[#EBF1F0] leading-relaxed">
            {t('landing.quoteText')}
          </p>
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#173E38] dark:text-[#4EA89A]">
              {t('landing.quoteAuthor')}
            </p>
            <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
              {t('landing.quoteRole')}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Interactive FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 border-b border-[#DDE3E1] dark:border-[#24423D]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <Badge variant="primary" size="sm">
              {isArabic ? 'الأسئلة والأجوبة التقنية' : 'QUESTIONS & ANSWERS'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
              {isArabic ? 'الاستفسارات التقنية وحوكمة المشتريات' : 'Frequently Addressed Technical Questions'}
            </h2>
            <p className="text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
              {isArabic ? 'إجابات شاملة لكل ما يسأله مديرو المشتريات والمدققون قبل الاعتماد المؤسسي.' : 'Everything procurement directors, enterprise architects, and auditors ask before rollout.'}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left rtl:text-right text-xs sm:text-sm font-semibold text-[#17272A] dark:text-[#EBF1F0] hover:bg-[#FAF9F6] dark:hover:bg-[#162B27] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-[#173E38] dark:text-[#4EA89A]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-[#647A7B] dark:text-[#8BA39F]" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#DDE3E1] dark:border-[#24423D] px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm text-[#34484B] dark:text-[#C2D3CF] leading-relaxed bg-[#FAF9F6]/50 dark:bg-[#162B27]/40 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. High-Trust Footer */}
      <footer className="py-12 bg-white dark:bg-[#11211E]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-[#DDE3E1] dark:border-[#24423D]">
            <Logo size="md" variant="horizontal" />
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#647A7B] dark:text-[#8BA39F]">
              <span>SOC2 Type II Certified</span>
              <span>ISO 27001 Fiduciary</span>
              <span>FedRAMP Ready</span>
              <span>ITAR Compliant</span>
            </div>
            <Button variant="primary" size="sm" onClick={onEnterApp}>
              {t('landing.ctaDemo')}
            </Button>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
            <p>© 2025 Synthetix Sourcing Technologies Inc. Precision & Trust Fiduciary Systems.</p>
            <p>{t('landing.footerRights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
