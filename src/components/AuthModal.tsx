import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, LogIn, UserPlus, Sparkles } from 'lucide-react';
import {
  DEMO_USER,
  getAllUsers,
  saveUser,
  loginWithGoogle,
  loginWithApple,
} from '../services/storage';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

  const handleGoogleAuth = () => {
    setIsSocialLoading('google');
    setTimeout(() => {
      // Simulate Google OAuth response or prompt
      const user = loginWithGoogle(
        email.trim() || undefined,
        name.trim() || 'Google User'
      );
      setIsSocialLoading(null);
      onLoginSuccess(user);
      onClose();
    }, 600);
  };

  const handleAppleAuth = () => {
    setIsSocialLoading('apple');
    setTimeout(() => {
      // Simulate Apple ID authentication
      const user = loginWithApple(
        email.trim() || undefined,
        name.trim() || 'Apple User'
      );
      setIsSocialLoading(null);
      onLoginSuccess(user);
      onClose();
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signin') {
      const allUsers = getAllUsers();
      const found = allUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (found) {
        saveUser(found);
        onLoginSuccess(found);
        onClose();
      } else {
        // If not found in registry, create user session seamlessly
        const newUser: UserProfile = {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0],
          email: email.trim(),
          phone: '+234 805 459 3037',
          address: 'Lagos, Nigeria',
          createdAt: new Date().toISOString(),
          authProvider: 'email',
        };
        saveUser(newUser);
        onLoginSuccess(newUser);
        onClose();
      }
    } else {
      if (!name.trim() || !email.trim() || !phone.trim()) {
        setError('Please complete all required fields.');
        return;
      }
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim() || 'Lagos, Nigeria',
        createdAt: new Date().toISOString(),
        authProvider: 'email',
      };
      saveUser(newUser);
      onLoginSuccess(newUser);
      onClose();
    }
  };

  const handleUseDemoAccount = () => {
    saveUser(DEMO_USER);
    onLoginSuccess(DEMO_USER);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl border border-[#E6E0D5] shadow-2xl overflow-hidden font-sans-ui p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE7DC]">
          <div>
            <h3 className="font-semibold text-[#1E1B19] text-lg font-serif-luxury">
              {mode === 'signin' ? 'Sign In to Zaddys' : 'Create Customer Account'}
            </h3>
            <p className="text-xs text-[#736B65]">
              Fast Paystack checkout, order tracking &amp; saved profile
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7A736E] hover:text-[#1E1B19] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Social Auth Buttons (Google & Apple) */}
        <div className="mt-5 space-y-2.5">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSocialLoading !== null}
            className="w-full py-2.5 px-4 bg-white hover:bg-[#F9F7F4] active:bg-[#F2EDE5] text-[#1E1B19] font-medium text-xs sm:text-sm rounded-xl border border-[#DDD5C9] shadow-2xs flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isSocialLoading === 'google'
                ? 'Connecting with Google...'
                : 'Continue with Google'}
            </span>
          </button>

          {/* Continue with Apple */}
          <button
            type="button"
            onClick={handleAppleAuth}
            disabled={isSocialLoading !== null}
            className="w-full py-2.5 px-4 bg-[#1E1B19] hover:bg-black active:bg-[#2F2B28] text-white font-medium text-xs sm:text-sm rounded-xl shadow-2xs flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.11.64-2.79 1.45-.6.7-.1.13-1.85-.98-3.01.04-.94 1.23.66 2.78 1.46z" />
            </svg>
            <span>
              {isSocialLoading === 'apple'
                ? 'Connecting with Apple...'
                : 'Continue with Apple'}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E3DBD0]" />
          </div>
          <div className="relative flex justify-center text-2xs uppercase">
            <span className="bg-[#FAF7F2] px-3 text-[#8A827B] font-medium tracking-wider">
              or continue with email
            </span>
          </div>
        </div>

        {/* Email Sign In / Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Babatunde Lawal"
                className="w-full px-3 py-2 text-sm bg-white border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D3121B]/30 focus:border-[#D3121B]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#4A4541] mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
              className="w-full px-3 py-2 text-sm bg-white border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D3121B]/30 focus:border-[#D3121B]"
            />
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                  Phone Number (+234) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0805 123 4567"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D3121B]/30 focus:border-[#D3121B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Lekki Phase 1, Lagos"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D3121B]/30 focus:border-[#D3121B]"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-[#D3121B] hover:bg-[#B80E16] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            {mode === 'signin' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In with Email</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 pt-4 border-t border-[#EDE7DC] flex items-center justify-between text-xs text-[#6B635D]">
          {mode === 'signin' ? (
            <p>
              New here?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#D3121B] font-semibold hover:underline cursor-pointer"
              >
                Create account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-[#D3121B] font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}

          <button
            type="button"
            onClick={handleUseDemoAccount}
            className="text-xs text-[#8A827B] hover:text-[#1E1B19] flex items-center gap-1 font-medium cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Demo Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

