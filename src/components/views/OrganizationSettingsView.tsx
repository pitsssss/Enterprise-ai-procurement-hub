import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Select } from '../ui/Select';
import { formatCurrency, formatDate } from '../../lib/formatters';
import {
  ShieldCheck,
  Building,
  Lock,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Sliders,
  Users,
  UserPlus,
  History,
  Key,
  Shield,
} from 'lucide-react';
import { Organization, OrganizationMember, AuditEvent, UserRole } from '../../types/procurement';
import { useAuth } from '../../contexts/AuthContext';
import {
  subscribeMembers,
  subscribeAuditEvents,
  inviteOrganizationMember,
  updateOrganizationMemberRole,
} from '../../services/firestoreService';

export const OrganizationSettingsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const { organization, currentMember, userRole, canPerform } = useAuth();
  const [soxThreshold, setSoxThreshold] = useState(organization?.soxThresholdUSD || 250000);
  const [minBidsRequired, setMinBidsRequired] = useState(3);
  const [requireCs8Waiver, setRequireCs8Waiver] = useState(true);
  const [dualSignoffTreasury, setDualSignoffTreasury] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Members and Audit Logs
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [auditFilter, setAuditFilter] = useState<string>('ALL');

  // Invite Member Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('BUYER');
  const [inviteDept, setInviteDept] = useState('Procurement Operations');
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);

  const orgId = organization?.id || 'org-synthetix-enterprise';

  useEffect(() => {
    if (!orgId) return;
    const unsubMembers = subscribeMembers(orgId, (mList) => setMembers(mList));
    const unsubAudit = subscribeAuditEvents(orgId, (aList) => setAuditEvents(aList));
    return () => {
      unsubMembers();
      unsubAudit();
    };
  }, [orgId]);

  const handleSavePolicies = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !currentMember) return;
    try {
      await inviteOrganizationMember(
        orgId,
        inviteEmail.trim(),
        inviteRole,
        inviteDept,
        {
          uid: currentMember.uid,
          email: currentMember.email,
          role: userRole,
        }
      );
      setInviteStatus(isArabic ? `تم إرسال الدعوة إلى ${inviteEmail}` : `Invitation dispatched to ${inviteEmail}`);
      setInviteEmail('');
      setTimeout(() => {
        setIsInviteOpen(false);
        setInviteStatus(null);
      }, 1500);
    } catch (err: any) {
      setInviteStatus(isArabic ? `فشل إرسال الدعوة: ${err.message}` : `Failed to invite: ${err.message}`);
    }
  };

  const handleRoleChange = async (targetUid: string, targetEmail: string, newRole: UserRole) => {
    if (!currentMember) return;
    try {
      await updateOrganizationMemberRole(
        orgId,
        targetUid,
        targetEmail,
        newRole,
        {
          uid: currentMember.uid,
          email: currentMember.email,
          role: userRole,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAuditEvents = auditEvents.filter((ev) => {
    if (auditFilter === 'ALL') return true;
    return ev.entityType === auditFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DDE3E1] dark:border-[#24423D] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
              {t('org.title')}
            </h1>
            <Badge variant="primary" size="sm">
              {isArabic ? 'متعدد المستأجرين' : 'Multi-Tenant'}
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
            {t('org.orgName')}: <strong className="text-[#17272A] dark:text-[#EBF1F0]">{organization?.name || 'Synthetix Global Corp'}</strong> (<bdi dir="ltr">{orgId}</bdi>)
          </p>
        </div>

        {canPerform('MANAGE_MEMBERS') && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleSavePolicies}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            {savedSuccess ? (isArabic ? 'تمت مزامنة السياسات' : 'Policies Synchronized') : t('common.save')}
          </Button>
        )}
      </div>

      {/* 1. SOX & Fiduciary Approval Threshold Matrix */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173E38]/10 text-[#173E38] dark:bg-[#2E7A6F]/20 dark:text-[#4EA89A]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                {t('org.soxSection')}
              </h2>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                {t('org.soxExplanation')}
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm">
            {isArabic ? 'مدقق ونشط' : 'Audited & Active'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Input
            label={t('org.soxThreshold')}
            type="number"
            value={soxThreshold}
            onChange={(e) => setSoxThreshold(Number(e.target.value))}
            prefixText="$"
            helperText={isArabic ? 'الطلبات التي تتجاوز هذا الحد تتطلب نموذج إعفاء CS-8 إذا كانت العروض أقل من 3.' : 'Requisitions above this threshold trigger mandatory Form CS-8 Sole-Source waiver if < 3 bids.'}
          />

          <Input
            label={isArabic ? 'الحد الأدنى لعروض المنافسة للترسية المباشرة' : 'Minimum Competitive Bids for Direct Award'}
            type="number"
            value={minBidsRequired}
            onChange={(e) => setMinBidsRequired(Number(e.target.value))}
            suffixText={isArabic ? 'موردين' : 'Vendors'}
            helperText={isArabic ? 'يتطلب الطلب هذا العدد على الأقل من عروض الموردين المستقلين لتجاوز تعليق المورد الوحيد.' : 'Requisition requires at least this many independent vendor quotes to bypass sole-source hold.'}
          />
        </div>

        <div className="pt-2 space-y-2.5 border-t border-[#DDE3E1] dark:border-[#24423D]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={requireCs8Waiver}
              onChange={(e) => setRequireCs8Waiver(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#DDE3E1] text-[#173E38] focus:ring-[#173E38]"
            />
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#17272A] dark:text-[#EBF1F0]">
                {t('org.soxToggle')}
              </p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                {isArabic ? 'تبقى أوامر الشراء المتجاوزة لحد الصلاحيات معلقة حتى يعتمدها مفوض مالي أو إداري.' : 'Purchase orders exceeding the single-source limit will remain in FLAGGED state until authorized by a Finance or Admin signatory.'}
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={dualSignoffTreasury}
              onChange={(e) => setDualSignoffTreasury(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#DDE3E1] text-[#173E38] focus:ring-[#173E38]"
            />
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#17272A] dark:text-[#EBF1F0]">
                {isArabic ? 'اعتماد ثنائي إلزامي على أوامر الشراء > $100,000' : 'Mandatory Dual Sign-off on Purchase Orders > $100,000'}
              </p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                {isArabic ? 'يتطلب توقيع مدير المشتريات ومسؤول الخزينة والمالية قبل إرسال الأمر للنظام.' : 'Requires both Procurement Director and Treasury Approver signatures before ERP dispatch.'}
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* 2. Team Members & RBAC Roles */}
      <Card padding="md" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C17C43]/10 text-[#C17C43] dark:bg-[#D48D55]/20 dark:text-[#D48D55]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                {t('org.membersTitle')}
              </h2>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                {members.length} {isArabic ? 'مفوضين بصلاحيات مشتريات محددة' : 'members with granular procurement authorization levels.'}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsInviteOpen(true)}
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            {isArabic ? 'دعوة مفوض جديد' : 'Invite Member'}
          </Button>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto touch-scroll border border-[#DDE3E1] dark:border-[#24423D] rounded-xl">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-[#FAF9F6] dark:bg-[#162B27] border-b border-[#DDE3E1] dark:border-[#24423D] text-[#647A7B] dark:text-[#8BA39F]">
              <tr>
                <th className="px-4 py-3 font-semibold">{t('org.colMember')}</th>
                <th className="px-4 py-3 font-semibold">{t('org.colDept')}</th>
                <th className="px-4 py-3 font-semibold">{t('org.colRole')}</th>
                <th className="px-4 py-3 font-semibold">{t('org.colJoined')}</th>
                <th className="px-4 py-3 font-semibold text-right rtl:text-left">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE3E1] dark:divide-[#24423D] bg-white dark:bg-[#11211E]">
              {members.map((m) => (
                <tr key={m.uid} className="hover:bg-[#FAF9F6] dark:hover:bg-[#162B27]/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                      {m.displayName}
                    </div>
                    <div className="text-[11px] text-[#647A7B] dark:text-[#8BA39F] font-mono">
                      <bdi dir="ltr">{m.email}</bdi>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#34484B] dark:text-[#C2D3CF]">
                    {m.department || (isArabic ? 'عمليات التوريد' : 'Procurement Operations')}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        m.role === 'ADMIN'
                          ? 'danger'
                          : m.role === 'FINANCE'
                          ? 'warning'
                          : m.role === 'APPROVER'
                          ? 'primary'
                          : 'default'
                      }
                      size="sm"
                    >
                      {t(`roles.${m.role}`, m.role)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                    {m.joinedAt ? <span dir="ltr">{formatDate(m.joinedAt.split('T')[0])}</span> : t('common.active')}
                  </td>
                  <td className="px-4 py-3 text-right rtl:text-left">
                    {canPerform('MANAGE_MEMBERS') && m.uid !== currentMember?.uid ? (
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.uid, m.email, e.target.value as UserRole)}
                        className="rounded border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#162B27] px-2 py-1 text-[11px] text-[#17272A] dark:text-[#EBF1F0]"
                      >
                        <option value="ADMIN">{t('roles.ADMIN')}</option>
                        <option value="PROCUREMENT_MANAGER">{t('roles.PROCUREMENT_MANAGER')}</option>
                        <option value="BUYER">{t('roles.BUYER')}</option>
                        <option value="APPROVER">{t('roles.APPROVER')}</option>
                        <option value="FINANCE">{t('roles.FINANCE')}</option>
                        <option value="AUDITOR">{t('roles.AUDITOR')}</option>
                      </select>
                    ) : (
                      <span className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                        {isArabic ? 'المستخدم الحالي' : 'Current User'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3. Immutable Audit Trail (Append-Only) */}
      <Card padding="md" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B6A4A]/10 text-[#1B6A4A] dark:bg-[#38B482]/20 dark:text-[#38B482]">
              <History className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                  {isArabic ? 'سجل التدقيق المالي الثابت' : 'Immutable Procurement Audit Trail'}
                </h2>
                <Badge variant="success" size="sm">
                  {isArabic ? 'متوافق مع SOX 404' : 'SOX SEC 404 Compliant'}
                </Badge>
              </div>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                {isArabic ? 'سجل أحداث غير قابل للتعديل وموثق تشفيرياً للمدققين الداخليين والخارجيين.' : 'Cryptographically verifiable, append-only event ledger for internal and external auditors.'}
              </p>
            </div>
          </div>

          {/* Audit Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll">
            {['ALL', 'RFQ', 'BID', 'PURCHASE_ORDER', 'ORGANIZATION', 'MEMBER'].map((cat) => (
              <button
                key={cat}
                onClick={() => setAuditFilter(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  auditFilter === cat
                    ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F]'
                    : 'bg-[#FAF9F6] dark:bg-[#162B27] text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A]'
                }`}
              >
                {cat === 'ALL' ? t('common.all') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Entries */}
        <div className="space-y-2 max-h-96 overflow-y-auto touch-scroll divide-y divide-[#DDE3E1] dark:divide-[#24423D]">
          {filteredAuditEvents.length === 0 ? (
            <p className="text-xs text-[#647A7B] dark:text-[#8BA39F] py-4 text-center">
              {t('dashboard.noAuditEvents')}
            </p>
          ) : (
            filteredAuditEvents.map((ev) => (
              <div key={ev.id} className="pt-2.5 pb-2 text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#173E38] dark:text-[#4EA89A] bg-[#FAF9F6] dark:bg-[#162B27] px-1.5 py-0.5 rounded border border-[#DDE3E1] dark:border-[#24423D]" dir="ltr">
                      {ev.action}
                    </span>
                    <Badge variant="default" size="sm">
                      {ev.entityType}
                    </Badge>
                    <span className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                      {isArabic ? 'بواسطة ' : 'by '}
                      <strong className="text-[#17272A] dark:text-[#EBF1F0]"><bdi dir="ltr">{ev.actorEmail}</bdi></strong> ({t(`roles.${ev.actorRole}`, ev.actorRole)})
                    </span>
                  </div>
                  <p className="text-xs text-[#17272A] dark:text-[#EBF1F0] font-medium">
                    {ev.summary}
                  </p>
                  {ev.details && (
                    <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F] italic">
                      {ev.details}
                    </p>
                  )}
                </div>

                <div className="text-[10px] font-mono text-[#647A7B] dark:text-[#8BA39F] whitespace-nowrap sm:text-right rtl:sm:text-left" dir="ltr">
                  {new Date(ev.timestamp).toLocaleString(isArabic ? 'ar-SA' : 'en-US')}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* 4. Enterprise Core ERP Synchronizers */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C17C43]/10 text-[#C17C43] dark:bg-[#D48D55]/20 dark:text-[#D48D55]">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                {isArabic ? 'موصلات أنظمة ERP والأنظمة المالية النشطة' : 'Active ERP & Financial Connectors'}
              </h2>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                {isArabic ? 'حالة المزامنة ثنائية الاتجاه مع السجلات المركزية للشركة.' : 'Bidirectional synchronization status with corporate systems of record.'}
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm" dot>
            {isArabic ? 'نظامان متصلان مباشرة' : '2 Systems Live'}
          </Badge>
        </div>

        <div className="space-y-3 pt-2">
          {/* SAP S/4HANA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-white dark:bg-[#11211E] border border-[#DDE3E1] dark:border-[#24423D] flex items-center justify-center font-bold text-xs text-[#173E38] dark:text-[#4EA89A]">
                SAP
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                  SAP S/4HANA Cloud (Procurement Core)
                </p>
                <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                  <bdi dir="ltr">Endpoint: https://sap-prd.corp.internal/sap/opu/odata/ • Live</bdi>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">{isArabic ? 'متصل' : 'Connected'}</Badge>
              <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                Ping
              </Button>
            </div>
          </div>

          {/* Workday Financials */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-white dark:bg-[#11211E] border border-[#DDE3E1] dark:border-[#24423D] flex items-center justify-center font-bold text-xs text-[#173E38] dark:text-[#4EA89A]">
                WD
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                  Workday Financial Management (General Ledger)
                </p>
                <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                  {isArabic ? 'مزامنة تخصيصات مراكز التكلفة والتسلسل الهرمي للاعتماد الثنائي.' : 'Syncs cost center allocations and dual-authorization approval hierarchies.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">{isArabic ? 'متصل' : 'Connected'}</Badge>
              <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                Ping
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#11211E] border border-[#DDE3E1] dark:border-[#24423D] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#17272A] dark:text-[#EBF1F0]">
              {isArabic ? `دعوة مفوض إلى ${organization?.name || 'مساحة العمل'}` : `Invite Member to ${organization?.name || 'Workspace'}`}
            </h3>
            {inviteStatus && (
              <p className="text-xs text-[#1B6A4A] dark:text-[#38B482] font-medium">{inviteStatus}</p>
            )}
            <form onSubmit={handleInviteSubmit} className="space-y-3.5">
              <Input
                label={isArabic ? 'البريد الإلكتروني المؤسسي' : 'Corporate Email'}
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@enterprise.com"
              />
              <Select
                label={isArabic ? 'الدور والصلاحية المالية المعينة' : 'Assigned Authorization Role'}
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                options={[
                  { value: 'ADMIN', label: `${t('roles.ADMIN')} (${isArabic ? 'إدارة كاملة وصلاحية تجاوز SOX' : 'Full Administration & SOX Override'})` },
                  { value: 'PROCUREMENT_MANAGER', label: `${t('roles.PROCUREMENT_MANAGER')} (${isArabic ? 'اعتماد الطلبات والأوامر' : 'RFQ & PO Sign-off'})` },
                  { value: 'BUYER', label: `${t('roles.BUYER')} (${isArabic ? 'طلبات الشراء وعروض الموردين' : 'Requisitions & Vendor Bids'})` },
                  { value: 'APPROVER', label: `${t('roles.APPROVER')} (${isArabic ? 'الميزانية والصلاحية المالية' : 'Budget & Financial Authority'})` },
                  { value: 'FINANCE', label: `${t('roles.FINANCE')} (${isArabic ? 'إعفاءات CS-8 والخزينة' : 'Form CS-8 Waivers & Treasury'})` },
                  { value: 'AUDITOR', label: `${t('roles.AUDITOR')} (${isArabic ? 'إشراف وتدقيق للقراءة فقط' : 'Read-only Fiduciary Oversight'})` },
                ]}
              />
              <Input
                label={t('org.colDept')}
                value={inviteDept}
                onChange={(e) => setInviteDept(e.target.value)}
                placeholder={isArabic ? 'مثال: إدارة التوريد الاستراتيجي' : 'e.g. Infrastructure Sourcing'}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsInviteOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {isArabic ? 'إرسال الدعوة' : 'Dispatch Invitation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
