import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Select } from '../ui/Select';
import {
  User,
  ShieldCheck,
  Key,
  Laptop,
  CheckCircle2,
  Clock,
  Award,
  Globe,
  LogOut,
  Building,
  UserCheck,
  Languages,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/procurement';
import { setAppLanguage, SupportedLanguage } from '../../i18n';
import { formatCurrency } from '../../lib/formatters';

export const UserProfileView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, profile, organization, currentMember, userRole, switchRole, updateProfileData, signOutUser } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || 'Enterprise Signatory');
  const [department, setDepartment] = useState(profile?.department || 'Global Sourcing & Supply Chain');
  const [title, setTitle] = useState(profile?.title || 'VP of Strategic Procurement');
  const [language, setLanguage] = useState<SupportedLanguage>((i18n.language === 'ar' ? 'ar' : 'en'));
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleLanguageSelect = async (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    await setAppLanguage(newLang);
  };

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    setSaveMessage(null);
    try {
      await updateProfileData({
        displayName,
        department,
        title,
        language,
      });

      if (selectedRole !== userRole) {
        await switchRole(selectedRole);
      }

      setSaveMessage(t('profile.saveSuccess'));
      setTimeout(() => setSaveMessage(null), 2500);
    } catch (err: any) {
      setSaveMessage(`${t('common.error')}: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'FINANCE':
        return 'warning';
      case 'APPROVER':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getDelegatedLimit = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 1000000;
      case 'FINANCE':
        return 500000;
      case 'APPROVER':
        return 250000;
      case 'PROCUREMENT_MANAGER':
        return 150000;
      case 'BUYER':
        return 50000;
      case 'AUDITOR':
        return 0;
      default:
        return 50000;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DDE3E1] dark:border-[#24423D] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
            {t('profile.title')}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#647A7B] dark:text-[#8BA39F]">
            {t('profile.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveProfile}
            isLoading={isUpdating}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            {saveMessage || t('common.save')}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={signOutUser}
            leftIcon={<LogOut className="h-4 w-4 rtl:rotate-180" />}
          >
            {t('profile.btnSignOut')}
          </Button>
        </div>
      </div>

      {/* 1. Identity & Signatory Status */}
      <Card padding="md" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="h-14 w-14 rounded-xl border border-[#DDE3E1] dark:border-[#24423D] object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#173E38] text-white font-bold text-lg shadow-sm">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#17272A] dark:text-[#EBF1F0]">
                  {displayName}
                </h2>
                <Badge variant={getRoleBadgeVariant(userRole)} size="sm">
                  {t(`roles.${userRole}`, userRole)}
                </Badge>
              </div>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                {title} • {department}
              </p>
              <p className="text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                <bdi dir="ltr">{user?.email || 'authenticated-session'}</bdi> • {organization?.name || 'Synthetix Global Corp'}
              </p>
            </div>
          </div>

          <div className="text-left rtl:text-right sm:border-l rtl:sm:border-l-0 rtl:sm:border-r sm:border-[#DDE3E1] sm:dark:border-[#24423D] sm:pl-5 rtl:sm:pl-0 rtl:sm:pr-5">
            <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">{t('profile.currentLimit')}</p>
            <p className="text-xl font-bold tabular-nums text-[#173E38] dark:text-[#4EA89A]">
              {formatCurrency(getDelegatedLimit(userRole))}
            </p>
            <span className="text-[10px] text-[#1B6A4A] dark:text-[#38B482]">
              {t('org.soxExplanation')}
            </span>
          </div>
        </div>

        {/* Role Delegation Switcher */}
        <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#162B27] border border-[#DDE3E1] dark:border-[#24423D] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0] flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-[#C17C43] dark:text-[#D48D55]" />
              {t('profile.roleSwitcher')}
            </span>
            <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">
              {t('profile.roleNotice')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
            {(['ADMIN', 'PROCUREMENT_MANAGER', 'BUYER', 'APPROVER', 'FINANCE', 'AUDITOR'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border text-center ${
                  selectedRole === r
                    ? 'bg-[#173E38] text-white border-[#173E38] dark:bg-[#2E7A6F] shadow-xs'
                    : 'bg-white dark:bg-[#11211E] text-[#647A7B] dark:text-[#8BA39F] border-[#DDE3E1] dark:border-[#24423D] hover:bg-[#FAF9F6]'
                }`}
              >
                {t(`roles.${r}`, r)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#DDE3E1] dark:border-[#24423D]">
          <Input
            label={t('profile.fieldSignatoryName')}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <Input
            label={t('profile.fieldTitle')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label={t('profile.fieldDept')}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <Select
            label={t('profile.fieldLanguage')}
            value={language}
            onChange={(e) => handleLanguageSelect(e.target.value as SupportedLanguage)}
            options={[
              { value: 'en', label: t('profile.optEnglish') },
              { value: 'ar', label: t('profile.optArabic') },
            ]}
          />
        </div>
      </Card>

      {/* 2. Security & Active FIDO2 Keys */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173E38]/10 text-[#173E38] dark:bg-[#2E7A6F]/20 dark:text-[#4EA89A]">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                {t('profile.hardwareSecurity')}
              </h2>
              <p className="text-xs text-[#647A7B] dark:text-[#8BA39F]">
                {t('profile.hardwareDesc')}
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm" dot>{t('profile.fidoHardwareBound')}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Laptop className="h-4 w-4 text-[#173E38] dark:text-[#4EA89A]" />
              <div>
                <p className="text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0]">{t('profile.yubikey')}</p>
                <p className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">{t('profile.yubikeySerial')}</p>
              </div>
            </div>
            <Badge variant="success" size="sm">{t('common.verified')}</Badge>
          </div>

          <div className="p-3 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-[#173E38] dark:text-[#4EA89A]" />
              <div>
                <p className="text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0]">Google Authenticator OTP</p>
                <p className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">Encrypted Cloud Backup • Synced</p>
              </div>
            </div>
            <Badge variant="default" size="sm">Backup</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
