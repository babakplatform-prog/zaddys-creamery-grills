import React, { useState, useEffect } from 'react';
import { ZaddysLogo } from './ZaddysLogo';
import { MadeForMomentsStamp } from './MadeForMomentsStamp';
import { Upload, ArrowRight, Sparkles, Check } from 'lucide-react';
import { saveCustomLogo } from '../services/storage';

interface SplashScreenProps {
  customLogoUrl: string | null;
  onComplete: () => void;
  onLogoUpdated?: (dataUrl: string) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  customLogoUrl,
  onComplete,
  onLogoUpdated,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [uploadedNotification, setUploadedNotification] = useState(false);

  useEffect(() => {
    // Smooth progress increment from 0 to 100% over ~2.2 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // When progress reaches 100%, trigger smooth fade out
  useEffect(() => {
    if (progress >= 100 && !isFadingOut) {
      const timer = setTimeout(() => {
        handleEnter();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, isFadingOut]);

  const handleEnter = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        saveCustomLogo(dataUrl);
        if (onLogoUpdated) {
          onLogoUpdated(dataUrl);
        }
        setUploadedNotification(true);
        setTimeout(() => setUploadedNotification(false), 2500);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF7F2] paper-grain transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Decorative luxury stationery inner border */}
      <div className="absolute inset-4 sm:inset-8 border border-[#EBE3D7] rounded-3xl pointer-events-none" />
      <div className="absolute inset-5 sm:inset-9 border border-[#F3ECE1] rounded-2xl pointer-events-none" />

      {/* Top Right "Made for Moments" circular flourish */}
      <div className="absolute top-6 right-6 sm:top-10 sm:right-10 opacity-75">
        <MadeForMomentsStamp />
      </div>

      <div className="relative max-w-md w-full text-center flex flex-col items-center justify-center space-y-6 sm:space-y-8 px-4 z-10">
        {/* Animated Brand Logo */}
        <div className="relative flex flex-col items-center group">
          <div className="transform transition-transform duration-700 ease-out hover:scale-105">
            <ZaddysLogo customLogoUrl={customLogoUrl} size="2xl" />
          </div>

          {/* Subtitle */}
          <div className="mt-3">
            <p className="font-serif-luxury text-sm sm:text-base tracking-[0.25em] uppercase text-[#1E1B19] font-medium">
              Made For Moments
            </p>
            <p className="font-serif-luxury italic text-xs sm:text-sm text-[#7F7771] mt-0.5">
              Wraps · Wings · Loaded Fries · Creamery Cakes
            </p>
          </div>
        </div>

        {/* Progress Bar & Stage Indicator */}
        <div className="w-full max-w-xs space-y-2 pt-2">
          <div className="w-full bg-[#E8E1D5] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#D3121B] h-full rounded-full transition-all duration-100 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-3xs font-mono text-[#8C837C] uppercase tracking-wider">
            <span>Loading Menu</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Action Controls: Enter Button + Upload Logo */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full max-w-xs justify-center font-sans-ui">
          <button
            type="button"
            onClick={handleEnter}
            className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-[#D3121B] hover:bg-[#B80E16] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>Enter Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Direct Logo Upload Option right on splash screen */}
          <label className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 bg-white hover:bg-[#FAF7F2] text-[#4A4541] border border-[#DDD5C9] text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-[#D3121B]" />
            <span className="whitespace-nowrap">Upload Device Logo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Upload Success Alert */}
        {uploadedNotification && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-1.5 animate-in fade-in duration-200">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Logo updated successfully from your device!</span>
          </div>
        )}

        {/* Subtle Guidance Note answering user's question */}
        <p className="text-2xs text-[#8A827B] max-w-xs leading-relaxed">
          Tip: You can also place your logo file at <code className="text-[#1E1B19] font-mono">/public/zaddys-logo.png</code> or send it directly in chat!
        </p>
      </div>
    </div>
  );
};
