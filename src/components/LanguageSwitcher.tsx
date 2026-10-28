import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage, setAppLanguage } from '../i18n';
import { useAuth } from '../contexts/AuthContext';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'dropdown' | 'inline' | 'header';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  className = '',
}) => {
  const { i18n, t } = useTranslation();
  const { user, updateProfileData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as SupportedLanguage;

  const handleLanguageChange = async (newLang: SupportedLanguage) => {
    if (newLang === currentLang) {
      setIsOpen(false);
      return;
    }
    await setAppLanguage(newLang);
    setIsOpen(false);

    // If user is authenticated, persist to Firestore profile
    if (user) {
      try {
        await updateProfileData({ language: newLang });
      } catch (err) {
        console.warn('Could not persist language to user profile:', err);
      }
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Variant: Compact toggle button (direct flip between EN and AR)
  if (variant === 'compact') {
    return (
      <button
        onClick={() => handleLanguageChange(currentLang === 'en' ? 'ar' : 'en')}
        className={`flex items-center justify-center gap-1.5 h-9 px-2.5 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0] hover:bg-[#FAF9F6] dark:hover:bg-[#162B27] transition-colors ${className}`}
        title={currentLang === 'en' ? 'التحويل إلى اللغة العربية' : 'Switch to English'}
        aria-label="Toggle language"
      >
        <Globe className="h-3.5 w-3.5 text-[#C17C43] dark:text-[#D48D55] shrink-0" />
        <span className="font-mono text-[11px] font-bold">
          {currentLang === 'en' ? 'العربية' : 'EN'}
        </span>
      </button>
    );
  }

  // Variant: Inline Segmented Control
  if (variant === 'inline') {
    return (
      <div className={`flex items-center rounded-lg border border-[#DDE3E1] dark:border-[#24423D] p-0.5 bg-[#FAF9F6] dark:bg-[#162B27] ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#173E38] text-white shadow-2xs dark:bg-[#2E7A6F]'
                  : 'text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0]'
              }`}
            >
              <span>{lang.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Variant: Dropdown
  const activeLangConfig = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] text-xs font-medium text-[#17272A] dark:text-[#EBF1F0] hover:bg-[#FAF9F6] dark:hover:bg-[#162B27] transition-colors focus:outline-none focus:ring-1 focus:ring-[#173E38]"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('nav.language')}
      >
        <Globe className="h-4 w-4 text-[#C17C43] dark:text-[#D48D55] shrink-0" />
        <span className="font-semibold">{activeLangConfig.nativeLabel}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-[#647A7B] dark:text-[#8BA39F] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-1.5 w-44 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] font-semibold text-[#647A7B] dark:text-[#8BA39F] uppercase tracking-wider border-b border-[#DDE3E1]/60 dark:border-[#24423D]/60 mb-1">
            {t('nav.language')}
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors text-left rtl:text-right ${
                  isSelected
                    ? 'bg-[#173E38]/10 text-[#173E38] dark:bg-[#2E7A6F]/20 dark:text-[#4EA89A] font-semibold'
                    : 'text-[#34484B] dark:text-[#C2D3CF] hover:bg-[#FAF9F6] dark:hover:bg-[#162B27]'
                }`}
              >
                <div className="flex flex-col">
                  <span>{lang.nativeLabel}</span>
                  <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">{lang.label}</span>
                </div>
                {isSelected && <Check className="h-4 w-4 text-[#173E38] dark:text-[#4EA89A]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
