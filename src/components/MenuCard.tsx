import React, { useState } from 'react';
import { MenuPackage, UserProfile } from '../types';
import { MENU_PACKAGES, BRAND_DETAILS } from '../data/menu';
import { MadeForMomentsStamp } from './MadeForMomentsStamp';
import { ZaddysLogo } from './ZaddysLogo';
import { ExternalLink, Copy, Check, CreditCard, Sparkles } from 'lucide-react';
import { getGreeting } from '../utils/greeting';

interface MenuCardProps {
  products: MenuPackage[];
  currentUser?: UserProfile | null;
  onSelectPackage: (pkg: MenuPackage, triggerSource?: 'name' | 'tagline') => void;
  onManageProducts?: () => void;
  customLogoUrl?: string | null;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  products,
  currentUser,
  onSelectPackage,
  onManageProducts,
  customLogoUrl,
}) => {
  const [copiedBank, setCopiedBank] = useState(false);
  const greeting = getGreeting(currentUser?.name);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BRAND_DETAILS.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <section id="menu-card" className="relative w-full max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Visual Menu Sheet Container replicating the flyer */}
      <div className="relative bg-[#FAF7F2] paper-grain rounded-2xl sm:rounded-3xl border border-[#E9E3D8] shadow-[0_20px_50px_rgba(0,0,0,0.06)] px-6 sm:px-16 pt-10 sm:pt-14 pb-12 overflow-hidden transition-all">
        {/* Subtle decorative inner margin line like bespoke stationery */}
        <div className="absolute inset-3 sm:inset-4 border border-[#ECE5D9] rounded-xl sm:rounded-2xl pointer-events-none" />

        {/* Personalized Time-of-Day Greeting Banner */}
        <div className="relative mb-3 text-center sm:text-left pl-2">
          <p className="font-serif-luxury text-sm sm:text-base italic text-[#7A716B] tracking-wide flex items-center justify-center sm:justify-start gap-2">
            <span>{greeting}</span>
            <span className="not-italic text-[#D3121B] text-xs">◆</span>
            <span className="text-xs font-sans-ui not-italic tracking-wider uppercase text-[#8C837D]">
              Welcome to Zaddys
            </span>
          </p>
        </div>

        {/* Top Header Section */}
        <div className="relative flex items-center justify-between mb-8 sm:mb-12">
          {/* Elegant Calligraphic Script "Menu" */}
          <div className="relative pt-2 pl-2">
            <h1 className="font-script text-6xl sm:text-8xl md:text-9xl text-[#D3121B] tracking-normal transform -rotate-1 select-none leading-none drop-shadow-xs">
              Menu
            </h1>
          </div>

          {/* Top Right "Made for Moments" Stamp with curved flourish line */}
          <div className="absolute right-0 top-0 sm:-top-2">
            <MadeForMomentsStamp />
          </div>
        </div>

        {/* Clickable Notice Hint */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-[#7F7771] bg-white/70 border border-[#EBE4D8] px-3.5 py-1.5 rounded-full shadow-2xs font-sans-ui">
            <CreditCard className="w-3.5 h-3.5 text-[#0ba4db]" />
            Click any <strong className="text-[#D3121B] font-semibold">Product Name</strong> or <strong className="text-[#1E1B19] font-semibold">Tagline</strong> to pay instantly via Paystack
          </span>
          {onManageProducts && (
            <button
              onClick={onManageProducts}
              className="text-xs text-[#7F7771] hover:text-[#D3121B] underline underline-offset-2 transition-colors"
            >
              Custom Menu Editor
            </button>
          )}
        </div>

        {/* Dynamic Packages List */}
        <div className="space-y-10 sm:space-y-12 my-6">
          {products.map((pkg) => (
            <article
              key={pkg.id}
              className="text-center group transition-transform duration-200"
            >
              {/* 1. Clickable Red Product Name / Heading */}
              <div>
                <button
                  type="button"
                  onClick={() => onSelectPackage(pkg, 'name')}
                  className="relative inline-flex flex-col items-center group/btn focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D3121B] rounded-lg p-1.5 transition-all cursor-pointer"
                  title={`Pay for ${pkg.tag} directly on Paystack`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="font-serif-luxury italic text-2xl sm:text-3xl md:text-4xl text-[#D3121B] font-semibold tracking-wider transition-all duration-200 group-hover/btn:scale-105 group-hover/btn:drop-shadow-[0_2px_8px_rgba(211,18,27,0.25)]">
                      {pkg.tag}
                    </h2>
                    <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 text-[#D3121B] -ml-1">
                      <ExternalLink className="w-4 h-4 inline" />
                    </span>
                  </div>

                  {/* Subtle indicator bar on hover */}
                  <span className="h-0.5 w-0 group-hover/btn:w-full bg-[#D3121B] transition-all duration-300 rounded-full mt-0.5" />
                </button>
              </div>

              {/* 2. Clickable Tagline */}
              {pkg.tagline && (
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={() => onSelectPackage(pkg, 'tagline')}
                    className="group/tag inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-sans-ui text-[#7A716B] hover:text-[#D3121B] transition-colors py-0.5 px-2 rounded-md hover:bg-[#D3121B]/5 cursor-pointer"
                    title={`Click tagline to pay ₦${pkg.priceAmount.toLocaleString()} via Paystack link`}
                  >
                    <span className="italic tracking-wide group-hover/tag:underline underline-offset-2">
                      {pkg.tagline}
                    </span>
                    <span className="text-2xs uppercase tracking-wider text-[#0ba4db] font-semibold font-mono opacity-80 group-hover/tag:opacity-100">
                      ⚡ Paystack
                    </span>
                  </button>
                </div>
              )}

              {/* 3. Items List */}
              <div className="mt-2.5 space-y-1 font-serif-luxury text-[#1E1B19] text-base sm:text-lg md:text-xl font-normal leading-relaxed">
                {pkg.items.map((item, index) => (
                  <p key={index} className="tracking-wide">
                    {item}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Decorative Separator */}
        <div className="w-24 h-px bg-[#E3DBD0] mx-auto mt-12 mb-10" />

        {/* Footer Section exactly matching the flyer */}
        <footer className="relative pt-4 sm:pt-6 text-xs sm:text-sm font-serif-luxury text-[#1E1B19]">
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 sm:gap-4 text-center sm:text-left">
            {/* Left Column: Website and Phone */}
            <div id="contact-info" className="space-y-1">
              <a
                href={`https://${BRAND_DETAILS.website}`}
                target="_blank"
                rel="noreferrer"
                className="block text-[#1E1B19] hover:text-[#D3121B] transition-colors tracking-wide underline-offset-2 hover:underline"
              >
                {BRAND_DETAILS.website}
              </a>
              <a
                href={`tel:${BRAND_DETAILS.phoneClean}`}
                className="block text-[#1E1B19] hover:text-[#D3121B] transition-colors tracking-wider"
              >
                {BRAND_DETAILS.phone}
              </a>
            </div>

            {/* Center Column: Red Zaddys Logo */}
            <div className="flex justify-center items-center py-2 sm:py-0">
              <ZaddysLogo customLogoUrl={customLogoUrl} size="md" />
            </div>

            {/* Right Column: Bank Details */}
            <div id="bank-info" className="sm:text-right space-y-1">
              <p className="tracking-wide lowercase text-[#1E1B19]">
                {BRAND_DETAILS.bankName}
              </p>
              <div className="inline-flex items-center gap-1.5 sm:justify-end">
                <span className="tracking-widest font-mono text-sm font-medium text-[#1E1B19]">
                  {BRAND_DETAILS.accountNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="p-1 rounded-sm text-[#7D7671] hover:text-[#D3121B] hover:bg-black/5 transition-colors"
                  title="Copy account number"
                  aria-label="Copy account number"
                >
                  {copiedBank ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};
