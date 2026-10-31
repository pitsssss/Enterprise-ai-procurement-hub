import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { X, ShieldCheck, Mail, Lock, ArrowRight, CheckCircle2, Building, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';

import { LanguageSwitcher } from '../LanguageSwitcher';

export type AuthMode = 'signin' | 'register' | 'recovery' | 'invite';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onSuccess?: (userEmail: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const { signInWithGoogle, authError: contextAuthError } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess('google-auth-user');
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setErrorMessage(err.message || (isArabic ? 'فشلت المصادقة عبر Google' : 'Google authentication failed.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'recovery') {
        if (!email.trim()) {
          setErrorMessage(isArabic ? 'يرجى إدخال البريد الإلكتروني للعمل.' : 'Please enter your work email address.');
          setIsLoading(false);
          return;
        }
        await sendPasswordResetEmail(auth, email.trim());
        setRecoverySent(true);
      } else if (mode === 'register') {
        if (!email.trim() || !password) {
          setErrorMessage(isArabic ? 'يرجى تقديم كل من البريد الإلكتروني وكلمة مرور آمنة.' : 'Please provide both work email and a secure password.');
          setIsLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (onSuccess) onSuccess(email);
        onClose();
      } else {
        // signin or invite
        if (!email.trim() || !password) {
          setErrorMessage(isArabic ? 'يرجى إدخال بريدك الإلكتروني وكلمة المرور.' : 'Please enter your work email and password.');
          setIsLoading(false);
          return;
        }
        await signInWithEmailAndPassword(auth, email.trim(), password);
        if (onSuccess) onSuccess(email);
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || (isArabic ? 'فشلت المصادقة. يرجى التحقق من البيانات.' : 'Authentication failed. Please verify credentials.');
      if (err.code === 'auth/operation-not-allowed') {
        msg = isArabic ? 'تسجيل الدخول بالبريد غير مفعل لهذا المشروع. يرجى استخدام Google أعلاه.' : 'Email/password sign-in is not enabled for this project. Please use the Google Sign-In button above.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = isArabic ? 'بيانات الاعتماد غير صالحة. يمكنك أيضاً الدخول فورياً عبر Google.' : 'Invalid email or password. You can also sign in instantly using Google.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = isArabic ? 'يوجد حساب مسجل بهذا البريد بالفعل. حاول تسجيل الدخول بدلاً من ذلك.' : 'An account with this email already exists. Try signing in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = isArabic ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' : 'Password should be at least 6 characters.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#11211E] border border-[#DDE3E1] dark:border-[#24423D] p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4.5 left-4.5 rtl:left-auto rtl:right-4.5 z-10">
          <LanguageSwitcher variant="compact" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0] p-1 rounded-md"
          aria-label={t('common.close')}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header with Precision Logo */}
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" variant="compact" />
          <h2 className="mt-4 text-lg sm:text-xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
            {mode === 'signin' && (isArabic ? 'تسجيل الدخول للمركز المؤسسي' : 'Sign in to Enterprise Hub')}
            {mode === 'register' && (isArabic ? 'إنشاء حساب مؤسسي جديد' : 'Create Enterprise Account')}
            {mode === 'recovery' && (isArabic ? 'استعادة كلمة المرور' : 'Fiduciary Account Recovery')}
            {mode === 'invite' && (isArabic ? 'قبول دعوة الانضمام للفريق' : 'Accept Team Invitation')}
          </h2>
          <p className="mt-1 text-xs text-[#647A7B] dark:text-[#8BA39F] max-w-xs">
            {mode === 'signin' && (isArabic ? 'الوصول إلى خطوط التوريد المعتمدة، وقوائم موافقات SOX، ومصفوفات الموردين.' : 'Access authorized procurement pipelines, SOX approval queues, and supplier matrices.')}
            {mode === 'register' && (isArabic ? 'سجل هويتك المؤسسية المعتمدة للوصول لطلبات عروض الأسعار وتفويضات الشراء.' : 'Register your verified corporate identity to access RFQs and purchase order delegations.')}
            {mode === 'recovery' && (isArabic ? 'أدخل بريد عملك المعتمد لاستلام رابط إعادة تعيين كلمة المرور.' : 'Enter your verified work email to receive a secure password recovery link.')}
            {mode === 'invite' && (isArabic ? 'تمت دعوتك للانضمام إلى فريق التوريد الاستراتيجي ومراجعة الخزينة.' : 'You have been invited to join the Strategic Sourcing & Treasury review team.')}
          </p>
        </div>

        {/* Error notification */}
        {(errorMessage || contextAuthError) && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-2 text-xs text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage || contextAuthError}</span>
          </div>
        )}

        {/* Primary SSO Action - Google Sign In */}
        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#162B27] px-4 py-3 text-sm font-semibold text-[#17272A] dark:text-[#EBF1F0] hover:bg-[#FAF9F6] dark:hover:bg-[#1D3732] transition-all shadow-xs hover:shadow-sm disabled:opacity-50"
          >
            {/* Google Icon SVG */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>{t('auth.signInGoogle')}</span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="w-full border-t border-[#DDE3E1] dark:border-[#24423D]" />
            <span className="absolute bg-white dark:bg-[#11211E] px-2 text-[10px] uppercase font-semibold text-[#647A7B] dark:text-[#8BA39F] tracking-wider">
              {isArabic ? 'أو عبر البريد وكلمة المرور' : 'Or with email credentials'}
            </span>
          </div>
        </div>

        {/* Form Body */}
        {mode === 'recovery' && recoverySent ? (
          <div className="mt-4 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1B6A4A]/10 text-[#1B6A4A] dark:bg-[#38B482]/20 dark:text-[#38B482]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#17272A] dark:text-[#EBF1F0]">
                {isArabic ? 'تم إرسال رابط الاستعادة' : 'Recovery Link Dispatched'}
              </h3>
              <p className="mt-1 text-xs text-[#647A7B] dark:text-[#8BA39F]">
                {isArabic ? 'تم إرسال بريد استعادة كلمة المرور إلى ' : 'A password reset email was dispatched to '}
                <strong className="text-[#17272A] dark:text-[#EBF1F0]"><bdi dir="ltr">{email}</bdi></strong>.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => {
                setRecoverySent(false);
                setMode('signin');
              }}
            >
              {isArabic ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3 space-y-3.5">
            <Input
              label={isArabic ? 'البريد الإلكتروني للعمل' : 'Work Email'}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              leftIcon={<Mail className="h-4 w-4" />}
            />

            {mode !== 'recovery' && (
              <div>
                <Input
                  label={isArabic ? 'كلمة المرور' : 'Password'}
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  leftIcon={<Lock className="h-4 w-4" />}
                />
                <div className="mt-1 flex justify-between items-center text-[11px]">
                  {mode === 'signin' ? (
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-[#173E38] dark:text-[#4EA89A] hover:underline"
                    >
                      {isArabic ? 'ليس لديك حساب؟ سجل الآن' : 'Need an account? Register'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-[#173E38] dark:text-[#4EA89A] hover:underline"
                    >
                      {isArabic ? 'لديك حساب بالفعل؟ سجل الدخول' : 'Have an account? Sign in'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMode('recovery')}
                    className="text-[#C17C43] dark:text-[#D48D55] hover:underline"
                  >
                    {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}
              className="mt-2"
            >
              {mode === 'signin' && (isArabic ? 'دخول مساحة العمل' : 'Sign In to Workspace')}
              {mode === 'register' && (isArabic ? 'إنشاء حساب جديد' : 'Create Account')}
              {mode === 'recovery' && (isArabic ? 'إرسال رابط إعادة التعيين' : 'Send Password Reset Email')}
              {mode === 'invite' && (isArabic ? 'تأكيد ودخول المنصة' : 'Confirm & Enter Platform')}
            </Button>
          </form>
        )}

        {/* Footer Security Badges */}
        <div className="mt-5 pt-4 border-t border-[#DDE3E1] dark:border-[#24423D] flex items-center justify-between text-xs text-[#647A7B] dark:text-[#8BA39F]">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#1B6A4A] dark:text-[#38B482]" />
            <span>Firebase Auth • SOC2 • TLS</span>
          </div>

          <div>
            {mode === 'signin' ? (
              <button
                onClick={() => setMode('invite')}
                className="text-[#173E38] dark:text-[#4EA89A] font-medium hover:underline text-[11px]"
              >
                {isArabic ? 'قبول دعوة' : 'Accept Invite'}
              </button>
            ) : (
              <button
                onClick={() => setMode('signin')}
                className="text-[#173E38] dark:text-[#4EA89A] font-medium hover:underline text-[11px]"
              >
                {isArabic ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
