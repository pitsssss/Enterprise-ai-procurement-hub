import React, { useState } from 'react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { X, ShieldCheck, Mail, Lock, ArrowRight, CheckCircle2, Building, Key } from 'lucide-react';

export type AuthMode = 'signin' | 'recovery' | 'invite' | 'verify';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onSuccess: (userEmail: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('sarah.chen@enterprise.global');
  const [password, setPassword] = useState('••••••••••••');
  const [recoverySent, setRecoverySent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'recovery') {
        setRecoverySent(true);
      } else if (mode === 'signin' || mode === 'invite' || mode === 'verify') {
        onSuccess(email);
        onClose();
      }
    }, 600);
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
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0] p-1 rounded-md"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header with Precision Logo */}
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" variant="compact" />
          <h2 className="mt-4 text-lg sm:text-xl font-bold tracking-tight text-[#17272A] dark:text-[#EBF1F0]">
            {mode === 'signin' && 'Sign in to Enterprise Hub'}
            {mode === 'recovery' && 'Fiduciary Account Recovery'}
            {mode === 'invite' && 'Accept Team Invitation'}
            {mode === 'verify' && 'Hardware 2FA Verification'}
          </h2>
          <p className="mt-1 text-xs text-[#647A7B] dark:text-[#8BA39F] max-w-xs">
            {mode === 'signin' && 'Access authorized procurement pipelines, SOX approval queues, and supplier matrices.'}
            {mode === 'recovery' && 'Enter your verified work email to receive a secure time-limited login link.'}
            {mode === 'invite' && 'You have been invited to join the Strategic Sourcing & Treasury review team.'}
            {mode === 'verify' && 'Enter the 6-digit confirmation key sent to your enterprise authenticator.'}
          </p>
        </div>

        {/* Form Body */}
        {mode === 'recovery' && recoverySent ? (
          <div className="mt-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1B6A4A]/10 text-[#1B6A4A] dark:bg-[#38B482]/20 dark:text-[#38B482]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#17272A] dark:text-[#EBF1F0]">Recovery Link Dispatched</h3>
              <p className="mt-1 text-xs text-[#647A7B] dark:text-[#8BA39F]">
                A secure login link was dispatched to <strong className="text-[#17272A] dark:text-[#EBF1F0]">{email}</strong>. Valid for 15 minutes.
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
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            {/* Corporate SSO Quick Action */}
            {mode === 'signin' && (
              <div className="space-y-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      onSuccess(email);
                      onClose();
                    }, 400);
                  }}
                  className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-[#DDE3E1] dark:border-[#24423D] bg-[#FAF9F6] dark:bg-[#162B27] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#17272A] dark:text-[#EBF1F0] hover:bg-white dark:hover:bg-[#1D3732] transition-colors shadow-2xs"
                >
                  <Building className="h-4 w-4 text-[#173E38] dark:text-[#4EA89A]" />
                  <span>Single Sign-On (Okta / Azure AD / SAML)</span>
                </button>
                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-[#DDE3E1] dark:border-[#24423D]" />
                  <span className="absolute bg-white dark:bg-[#11211E] px-2 text-[10px] uppercase font-semibold text-[#647A7B] dark:text-[#8BA39F] tracking-wider">
                    Or with credentials
                  </span>
                </div>
              </div>
            )}

            {mode === 'invite' && (
              <div className="rounded-lg bg-[#FAF9F6] dark:bg-[#162B27] p-3 border border-[#DDE3E1] dark:border-[#24423D] flex items-center justify-between text-xs mb-2">
                <div>
                  <p className="font-semibold text-[#17272A] dark:text-[#EBF1F0]">Invited by: Group Treasury</p>
                  <p className="text-[#647A7B] dark:text-[#8BA39F]">Role: Strategic Sourcing Director</p>
                </div>
                <Badge variant="success" size="sm">SOX Tier 1</Badge>
              </div>
            )}

            {mode !== 'verify' ? (
              <>
                <Input
                  label="Work Email"
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
                      label="Password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      leftIcon={<Lock className="h-4 w-4" />}
                    />
                    <div className="mt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setMode('recovery')}
                        className="text-[11px] text-[#C17C43] dark:text-[#D48D55] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div>
                <Input
                  label="6-Digit Authenticator Key"
                  type="text"
                  maxLength={6}
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="849201"
                  leftIcon={<Key className="h-4 w-4" />}
                />
                <p className="mt-1 text-[11px] text-[#647A7B] dark:text-[#8BA39F]">
                  Check your corporate device or YubiKey token.
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="mt-2"
            >
              {mode === 'signin' && 'Sign In to Workspace'}
              {mode === 'recovery' && 'Send Secure Magic Link'}
              {mode === 'invite' && 'Confirm & Enter Platform'}
              {mode === 'verify' && 'Verify & Authenticate'}
            </Button>
          </form>
        )}

        {/* Footer Navigation Switcher */}
        <div className="mt-5 pt-4 border-t border-[#DDE3E1] dark:border-[#24423D] flex items-center justify-between text-xs text-[#647A7B] dark:text-[#8BA39F]">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#1B6A4A] dark:text-[#38B482]" />
            <span>SOC2 Type II • 256-Bit TLS</span>
          </div>

          <div>
            {mode === 'signin' ? (
              <button
                onClick={() => setMode('invite')}
                className="text-[#173E38] dark:text-[#4EA89A] font-medium hover:underline"
              >
                Accept Invite
              </button>
            ) : (
              <button
                onClick={() => setMode('signin')}
                className="text-[#173E38] dark:text-[#4EA89A] font-medium hover:underline"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
