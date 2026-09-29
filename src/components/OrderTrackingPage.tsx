import React, { useState, useEffect } from 'react';
import { OrderRecord } from '../types';
import { DragSliderButton } from './DragSliderButton';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Bike,
  ChefHat,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Navigation,
  Share2,
} from 'lucide-react';
import { ZaddysLogo } from './ZaddysLogo';

interface OrderTrackingPageProps {
  order: OrderRecord;
  onBackToHome: () => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderRecord['status']) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  order,
  onBackToHome,
  onUpdateOrderStatus,
}) => {
  const [copiedRef, setCopiedRef] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isReceivedConfirmed, setIsReceivedConfirmed] = useState(
    order.status === 'Delivered'
  );
  const [activeMapView, setActiveMapView] = useState<'route' | 'details'>('route');

  // Live timer tick every second for real-time order tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const orderTimestamp = new Date(order.createdAt).getTime();
  const rawElapsed = Math.max(0, (currentTime - orderTimestamp) / 1000);
  const simulatedElapsed = rawElapsed * speedMultiplier;

  // Stages:
  // 0 - 35s: Preparing in Kitchen
  // 35 - 85s: Out for Delivery
  // 85s+: Delivered
  let stage: 'Preparing' | 'Out for Delivery' | 'Delivered' = 'Preparing';
  let progressPercent = 15;
  let etaText = 'Estimated arrival in 20-30 mins';
  let riderPositionPercent = 15; // 0 to 100% along route

  if (isReceivedConfirmed || simulatedElapsed >= 85) {
    stage = 'Delivered';
    progressPercent = 100;
    etaText = 'Delivered to your doorstep';
    riderPositionPercent = 100;
  } else if (simulatedElapsed >= 35) {
    stage = 'Out for Delivery';
    progressPercent = 40 + Math.floor(((simulatedElapsed - 35) / 50) * 50);
    const secsLeft = Math.max(1, 85 - Math.floor(simulatedElapsed));
    etaText = `Arriving in ~12 mins (${secsLeft}s in demo)`;
    riderPositionPercent = Math.min(92, 20 + Math.floor(((simulatedElapsed - 35) / 50) * 72));
  } else {
    stage = 'Preparing';
    progressPercent = 15 + Math.floor((simulatedElapsed / 35) * 22);
    const secsLeft = Math.max(1, 35 - Math.floor(simulatedElapsed));
    etaText = `Kitchen Prep · ~${secsLeft}s until dispatch`;
    riderPositionPercent = 15;
  }

  const handleCopyReference = () => {
    navigator.clipboard.writeText(order.reference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleConfirmReceived = () => {
    setIsReceivedConfirmed(true);
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(order.id, 'Delivered');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] paper-grain font-sans-ui text-[#1E1B19] py-6 px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DDD5C9] text-xs font-semibold text-[#4A4541] hover:text-[#D3121B] hover:border-[#D3121B] shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu (www.zaddys.ng)</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xs text-[#7A736E]">Simulate:</span>
            <button
              type="button"
              onClick={() => setSpeedMultiplier(1)}
              className={`px-2 py-1 text-2xs rounded-lg cursor-pointer ${
                speedMultiplier === 1
                  ? 'bg-[#1E1B19] text-white'
                  : 'bg-white text-[#5C5550] border border-[#DDD5C9]'
              }`}
            >
              1x Real
            </button>
            <button
              type="button"
              onClick={() => setSpeedMultiplier(5)}
              className={`px-2 py-1 text-2xs rounded-lg cursor-pointer ${
                speedMultiplier === 5
                  ? 'bg-[#D3121B] text-white'
                  : 'bg-white text-[#5C5550] border border-[#DDD5C9]'
              }`}
            >
              5x Fast
            </button>
          </div>
        </div>

        {/* Live Order Hero Card */}
        <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-md p-6 sm:p-8 space-y-6">
          {/* Header & Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EAE0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-wider text-[#8A827B]">
                  Live Tracking
                </span>
                <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Paystack Verified</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#1E1B19] mt-1">
                {order.packageName}
              </h1>
              <p className="text-xs text-[#7A736E] mt-0.5 flex items-center gap-1.5">
                <span>Ref:</span>
                <code className="font-mono text-[#1E1B19] font-medium bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#EDE7DC]">
                  {order.reference}
                </code>
                <button
                  type="button"
                  onClick={handleCopyReference}
                  className="text-[#D3121B] hover:opacity-80 cursor-pointer p-0.5"
                  title="Copy reference"
                >
                  {copiedRef ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 inline" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 inline" />
                  )}
                </button>
              </p>
            </div>

            {/* Current Status Pill */}
            <div className="text-left sm:text-right">
              {stage === 'Preparing' && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                  <ChefHat className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Preparing Feast</span>
                </div>
              )}
              {stage === 'Out for Delivery' && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold">
                  <Bike className="w-4 h-4 text-blue-600 animate-bounce" />
                  <span>Rider On The Way</span>
                </div>
              )}
              {stage === 'Delivered' && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Delivered &amp; Enjoyed</span>
                </div>
              )}
              <p className="text-xs font-medium text-[#736B65] mt-1 flex items-center sm:justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-[#A8A19B]" />
                <span>{etaText}</span>
              </p>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-3 pt-1">
            <div className="relative">
              <div className="w-full bg-[#EFE9DF] h-3 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    stage === 'Delivered'
                      ? 'bg-emerald-500'
                      : stage === 'Out for Delivery'
                      ? 'bg-blue-500'
                      : 'bg-[#D3121B]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Checkpoints */}
            <div className="grid grid-cols-3 text-center gap-2 text-xs">
              <div
                className={`p-2 rounded-xl transition-colors ${
                  stage === 'Preparing'
                    ? 'bg-amber-50/80 font-bold text-amber-900 border border-amber-200/60'
                    : 'text-[#6E6761]'
                }`}
              >
                <div className="text-base mb-0.5">🍳</div>
                <span>1. Kitchen Prep</span>
              </div>
              <div
                className={`p-2 rounded-xl transition-colors ${
                  stage === 'Out for Delivery'
                    ? 'bg-blue-50/80 font-bold text-blue-900 border border-blue-200/60'
                    : 'text-[#6E6761]'
                }`}
              >
                <div className="text-base mb-0.5">🛵</div>
                <span>2. Out for Delivery</span>
              </div>
              <div
                className={`p-2 rounded-xl transition-colors ${
                  stage === 'Delivered'
                    ? 'bg-emerald-50/80 font-bold text-emerald-900 border border-emerald-200/60'
                    : 'text-[#6E6761]'
                }`}
              >
                <div className="text-base mb-0.5">✨</div>
                <span>3. Delivered</span>
              </div>
            </div>
          </div>

          {/* Interactive Simulated Courier Route Map */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E3DBD0] bg-[#F7F4EE] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#4A4541] flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#D3121B]" />
                <span>Simulated Dispatch Route (Lagos Express)</span>
              </span>
              <span className="text-2xs font-mono text-[#0ba4db] bg-white px-2 py-0.5 rounded-md border border-[#E0D7CC]">
                LIVE GPS
              </span>
            </div>

            {/* Animated Route Line */}
            <div className="relative h-20 bg-white/70 rounded-xl border border-[#EAE3D8] p-4 flex items-center justify-between">
              {/* Kitchen Origin */}
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-8 h-8 rounded-full bg-[#D3121B] text-white flex items-center justify-center shadow-xs">
                  <ChefHat className="w-4 h-4" />
                </div>
                <span className="text-3xs font-semibold mt-1 text-[#4A4541]">
                  Zaddys Grill
                </span>
              </div>

              {/* Path Track with dynamic Moving Rider Marker */}
              <div className="flex-1 relative mx-4">
                <div className="h-1.5 w-full bg-[#E2DBD0] rounded-full" />
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-700"
                  style={{ left: `${riderPositionPercent}%` }}
                >
                  <div className="relative -ml-4 -mt-3.5 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md animate-pulse">
                    <Bike className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Destination Point */}
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-3xs font-semibold mt-1 text-[#4A4541] truncate max-w-[80px]">
                  Your Address
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-2xs text-[#706863] gap-2 pt-1 border-t border-[#EDE5DA]">
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-[#D3121B] shrink-0" />
                <strong className="text-[#1E1B19]">Drop-off:</strong> {order.deliveryAddress}
              </span>
              <span className="text-emerald-700 font-semibold shrink-0">
                Thermal Insulated Pack
              </span>
            </div>
          </div>

          {/* Courier Dispatch Card */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE7DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1E1B19] text-[#FAF7F2] flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                TA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-[#1E1B19]">Tunde Adeyemi</h4>
                  <span className="text-3xs bg-white text-[#736B65] border border-[#DDD5C9] px-1.5 py-0.5 rounded font-mono">
                    Yamaha Crux 110
                  </span>
                </div>
                <p className="text-xs text-[#7A736E]">Zaddys Certified Fast Dispatch Courier</p>
              </div>
            </div>

            <a
              href="tel:+2348054593037"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-[#F2ECE1] border border-[#DDD5C9] text-xs font-semibold rounded-xl text-[#1E1B19] transition-colors shadow-2xs cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Courier (+234 805 459 3037)</span>
            </a>
          </div>

          {/* THE DRAG-OR-CLICK BUTTON REQUESTED BY USER */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#5C5550]">
              <span className="font-semibold text-[#1E1B19] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D3121B]" />
                <span>Interactive Delivery Confirmation:</span>
              </span>
              <span className="text-2xs text-[#7A736E]">
                Click or drag the slider
              </span>
            </div>

            <DragSliderButton
              label="👉 Drag or click to confirm order received"
              completedLabel="Feast Received & Verified!"
              isCompleted={isReceivedConfirmed}
              onComplete={handleConfirmReceived}
            />

            <p className="text-2xs text-center text-[#8C837C]">
              Slide the button across or tap it to mark this order safely received.
            </p>
          </div>

          {/* Order Payment Summary */}
          <div className="pt-4 border-t border-[#F0EAE0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6B635D]">
            <div>
              <span className="text-[#8A827B]">Customer:</span>{' '}
              <strong className="text-[#1E1B19]">{order.customerName}</strong> ({order.customerPhone})
            </div>
            <div>
              <span className="text-[#8A827B]">Amount Paid:</span>{' '}
              <span className="font-mono font-bold text-sm text-[#D3121B]">
                ₦{order.amount.toLocaleString()}
              </span>{' '}
              via {order.paystackChannel}
            </div>
          </div>
        </div>

        {/* Footer Return Action */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs text-[#7A736E] hover:text-[#D3121B] underline underline-offset-4 transition-colors cursor-pointer"
          >
            ← Return to Zaddys Creamery &amp; Grill Homepage (www.zaddys.ng)
          </button>
        </div>
      </div>
    </div>
  );
};
