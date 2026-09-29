import React from 'react';
import { User, LogIn, Sliders, Sun, Sunset, Moon, Navigation } from 'lucide-react';
import { UserProfile, OrderRecord } from '../types';
import { getGreeting, getTimeOfDay } from '../utils/greeting';

interface HeaderNavProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenBrandGuide: () => void;
  onOpenProductManager?: () => void;
  onShowSplash?: () => void;
  latestOrder?: OrderRecord | null;
  onOpenTracking?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenBrandGuide,
  onOpenProductManager,
  onShowSplash,
  latestOrder,
  onOpenTracking,
}) => {
  const timeOfDay = getTimeOfDay();
  const greeting = getGreeting(currentUser?.name);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#E8E2D8] bg-[#FAF7F2]/90 backdrop-blur-md px-4 sm:px-8 py-3 font-sans-ui">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onShowSplash}
            className="text-xl sm:text-2xl font-bold font-serif-luxury tracking-tight text-[#D3121B] hover:opacity-90 transition-opacity text-left cursor-pointer"
            title="Click to view Zaddys Splash Screen"
          >
            Zaddys
          </button>
          <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#7D7671] border-l border-[#E0D9CF] pl-3">
            Creamery &amp; Grill
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4A4541]">
          <a href="#menu-card" className="hover:text-[#D3121B] transition-colors">
            Menu
          </a>
          {onOpenProductManager && (
            <button
              onClick={onOpenProductManager}
              className="hover:text-[#D3121B] transition-colors cursor-pointer"
            >
              Manage Products
            </button>
          )}
          <a href="#bank-info" className="hover:text-[#D3121B] transition-colors">
            Moniepoint Transfer
          </a>
          <a href="#contact-info" className="hover:text-[#D3121B] transition-colors">
            Contact
          </a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Order Tracker Button */}
          {latestOrder && onOpenTracking && (
            <button
              type="button"
              onClick={onOpenTracking}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#D3121B] bg-[#D3121B]/10 hover:bg-[#D3121B]/20 border border-[#D3121B]/30 rounded-lg transition-colors shadow-2xs cursor-pointer animate-pulse"
              title={`Track active order: ${latestOrder.packageName}`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Track Order</span>
            </button>
          )}

          {/* Logo & Setup Guide Button */}
          <button
            onClick={onOpenBrandGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A544F] bg-white/80 border border-[#E3DDD3] rounded-lg hover:border-[#D3121B] hover:text-[#D3121B] transition-all shadow-xs cursor-pointer"
            title="Logo folder guide & Paystack settings"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logo &amp; Setup</span>
          </button>

          {/* Account Profile or Sign In with time-of-day greeting */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#D3121B] rounded-lg hover:bg-[#B80E16] transition-colors shadow-xs cursor-pointer"
              title={`${greeting}! Click to view profile`}
            >
              {timeOfDay === 'morning' && <Sun className="w-3.5 h-3.5 text-amber-200" />}
              {timeOfDay === 'afternoon' && <Sun className="w-3.5 h-3.5 text-orange-200" />}
              {timeOfDay === 'evening' && <Moon className="w-3.5 h-3.5 text-indigo-200" />}
              <span className="truncate max-w-[120px] sm:max-w-[170px]">
                {greeting}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#D3121B] rounded-lg hover:bg-[#B80E16] transition-colors shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
