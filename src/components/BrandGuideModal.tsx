import React, { useState } from 'react';
import { X, Folder, Image, Palette, Key, Check, Upload, Trash2, ExternalLink } from 'lucide-react';
import { BRAND_DETAILS } from '../data/menu';
import { getPaystackPublicKey, savePaystackPublicKey, saveCustomLogo, removeCustomLogo } from '../services/storage';

interface BrandGuideModalProps {
  onClose: () => void;
  customLogoUrl: string | null;
  onLogoUpdated: (url: string | null) => void;
  onOpenSplash?: () => void;
}

export const BrandGuideModal: React.FC<BrandGuideModalProps> = ({
  onClose,
  customLogoUrl,
  onLogoUpdated,
  onOpenSplash,
}) => {
  const [paystackKey, setPaystackKey] = useState(getPaystackPublicKey());
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        saveCustomLogo(dataUrl);
        onLogoUpdated(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    removeCustomLogo();
    onLogoUpdated(null);
  };

  const handleSavePaystackKey = (e: React.FormEvent) => {
    e.preventDefault();
    savePaystackPublicKey(paystackKey);
    setSavedKeySuccess(true);
    setTimeout(() => setSavedKeySuccess(false), 2000);
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const palette = [
    { name: 'Zaddys Crimson Red', hex: '#D3121B', desc: 'Menu title, package tags, brand accent' },
    { name: 'Artisanal Cream Canvas', hex: '#FAF7F2', desc: 'Menu sheet background tone' },
    { name: 'Warm Parchment Tone', hex: '#F4EFE6', desc: 'Card borders and subtle scrims' },
    { name: 'Deep Editorial Charcoal', hex: '#1E1B19', desc: 'Package description typography' },
    { name: 'Moniepoint Cyan Blue', hex: '#0BA4DB', desc: 'Paystack checkout accent' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl border border-[#E6E0D5] shadow-2xl overflow-hidden font-sans-ui flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE7DC] bg-[#F4EFE6]">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-[#D3121B]" />
            <h3 className="font-semibold text-[#1E1B19] text-base sm:text-lg">
              Logo File &amp; Brand Setup Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7A736E] hover:text-[#1E1B19] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-[#4A4541]">
          {/* Answer to user's question 1: Folder & File name */}
          <section className="bg-white/80 border border-[#E8E1D5] rounded-xl p-5 space-y-3">
            <h4 className="font-semibold text-sm sm:text-base text-[#1E1B19] flex items-center gap-2">
              <Image className="w-4 h-4 text-[#D3121B]" />
              <span>Where to save your Zaddys Logo File</span>
            </h4>
            <p className="text-xs text-[#5C5550] leading-relaxed">
              To have the app automatically display your device's exact logo file:
            </p>
            <div className="bg-[#1E1B19] text-[#EDE7DC] p-3.5 rounded-lg font-mono text-xs space-y-1">
              <div className="text-emerald-400 font-semibold">📁 Folder Path:</div>
              <div className="pl-4">/public/</div>
              <div className="text-emerald-400 font-semibold pt-1">🏷️ Filename to rename:</div>
              <div className="pl-4 text-amber-300 font-bold">zaddys-logo.png</div>
              <div className="text-[#9E9790] text-2xs pl-4 pt-0.5">
                (or simply <code className="text-white">logo.png</code> inside the <code className="text-white">public</code> folder)
              </div>
            </div>

            {/* Chat Upload Guidance */}
            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg text-xs text-amber-900 space-y-1">
              <span className="font-semibold block">Can I send my logo file here in the chat?</span>
              <p className="text-2xs text-amber-800 leading-relaxed">
                <strong>Yes, absolutely!</strong> You can attach and upload your logo image file directly here in the chat. The system will receive the image and we can immediately integrate it. Alternatively, use the <strong>Upload Logo File</strong> button below or save it to <code className="font-mono bg-white/70 px-1 py-0.5 rounded">/public/zaddys-logo.png</code>.
              </p>
            </div>

            {/* In-Browser Instant Uploader */}
            <div className="pt-2 border-t border-[#EFE9DF]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-[#1E1B19] block text-xs">
                    Test your logo right now in the browser:
                  </span>
                  <span className="text-2xs text-[#7A736E]">
                    Select the logo file from your device to preview instantly
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D3121B] hover:bg-[#B80E16] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {customLogoUrl && (
                    <button
                      onClick={handleResetLogo}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                      title="Reset to default logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {onOpenSplash && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSplash();
                      }}
                      className="px-3 py-1.5 bg-white border border-[#DDD5C9] hover:bg-[#FAF7F2] text-[#1E1B19] text-xs font-medium rounded-lg transition-colors cursor-pointer"
                      title="Preview Splash Screen"
                    >
                      Preview Splash Screen
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Color Palette from flyer */}
          <section className="bg-white/80 border border-[#E8E1D5] rounded-xl p-5 space-y-3">
            <h4 className="font-semibold text-sm sm:text-base text-[#1E1B19] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#D3121B]" />
              <span>Exact Brand Color Palette</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {palette.map((c) => (
                <div
                  key={c.hex}
                  onClick={() => copyToClipboard(c.hex)}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-[#EDE7DC] hover:border-[#D3121B] cursor-pointer bg-white transition-all group"
                >
                  <div
                    className="w-8 h-8 rounded-md border border-black/10 shrink-0 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-[#1E1B19] flex items-center justify-between">
                      <span className="truncate">{c.name}</span>
                      <code className="text-2xs font-mono text-[#D3121B]">
                        {copiedColor === c.hex ? 'COPIED!' : c.hex}
                      </code>
                    </div>
                    <div className="text-2xs text-[#7A736E] truncate">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Paystack Public Key Integration */}
          <section className="bg-white/80 border border-[#E8E1D5] rounded-xl p-5 space-y-3">
            <h4 className="font-semibold text-sm sm:text-base text-[#1E1B19] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#0ba4db]" />
              <span>Paystack Public Key Configuration</span>
            </h4>
            <p className="text-xs text-[#5C5550]">
              To receive payments directly to your Nigerian bank / Paystack merchant account, enter your live Paystack public key below:
            </p>
            <form onSubmit={handleSavePaystackKey} className="flex gap-2">
              <input
                type="text"
                value={paystackKey}
                onChange={(e) => setPaystackKey(e.target.value)}
                placeholder="pk_live_xxxxxxxxxxxxxxxxxxxx or pk_test_xxxx"
                className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0ba4db]/30 focus:border-[#0ba4db]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#0ba4db] hover:bg-[#0992c4] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
              >
                {savedKeySuccess ? 'Saved!' : 'Save Key'}
              </button>
            </form>
            <div className="text-2xs text-[#7A736E] flex items-center gap-1">
              <span>Find your key at</span>
              <a
                href="https://dashboard.paystack.com/#/settings/developer"
                target="_blank"
                rel="noreferrer"
                className="text-[#0ba4db] hover:underline inline-flex items-center gap-0.5"
              >
                <span>dashboard.paystack.com</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
