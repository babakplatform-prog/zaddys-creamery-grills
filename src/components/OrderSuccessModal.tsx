import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { OrderRecord } from '../types';
import { CheckCircle2, ArrowLeft, Clock, MapPin, Receipt, ShieldCheck, Navigation } from 'lucide-react';
import { BRAND_DETAILS } from '../data/menu';

interface OrderSuccessModalProps {
  order: OrderRecord | null;
  onCloseToHome: () => void;
  onOpenProfile: () => void;
  onTrackOrder?: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onCloseToHome,
  onOpenProfile,
  onTrackOrder,
}) => {
  useEffect(() => {
    if (order) {
      // Fire festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D3121B', '#E53E3E', '#F59E0B', '#10B981'],
      });
    }
  }, [order]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl border border-[#E6E0D5] shadow-2xl overflow-hidden font-sans-ui text-center p-6 sm:p-8">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#1E1B19] mb-1">
          Payment Confirmed!
        </h3>
        <p className="text-xs sm:text-sm text-[#6B635D] mb-6">
          Thank you, <span className="font-semibold text-[#1E1B19]">{order.customerName}</span>. Your Paystack payment has been verified.
        </p>

        {/* Order Receipt Box */}
        <div className="bg-white/80 border border-[#E8E1D5] rounded-xl p-4 text-left space-y-2.5 text-xs text-[#4A4541] mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-[#EFE9DF]">
            <span className="text-[#7F7771]">Order Reference:</span>
            <span className="font-mono font-semibold text-[#1E1B19]">{order.reference}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#7F7771]">Package:</span>
            <span className="font-serif-luxury font-bold text-[#D3121B] text-sm">{order.packageName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#7F7771]">Amount Paid:</span>
            <span className="font-mono font-bold text-[#1E1B19]">₦{order.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-start pt-1 border-t border-[#EFE9DF]">
            <span className="text-[#7F7771] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Destination:
            </span>
            <span className="text-right text-[#1E1B19] max-w-[200px] truncate">{order.deliveryAddress}</span>
          </div>
          <div className="flex justify-between items-center pt-1 text-emerald-700 bg-emerald-50/60 p-2 rounded-lg">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> Prep &amp; Delivery:
            </span>
            <span className="font-semibold">30 - 45 mins</span>
          </div>
        </div>

        {/* Support Note */}
        <p className="text-xs text-[#7F7771] mb-6">
          Need quick order updates? Call or WhatsApp{' '}
          <a href={`tel:${BRAND_DETAILS.phoneClean}`} className="text-[#D3121B] font-medium hover:underline">
            {BRAND_DETAILS.phone}
          </a>
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {onTrackOrder && (
            <button
              onClick={onTrackOrder}
              className="w-full py-3 px-4 bg-[#D3121B] hover:bg-[#B80E16] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Track Order Live (Route &amp; Delivery)</span>
            </button>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={onCloseToHome}
              className="w-full py-2.5 px-4 bg-white border border-[#DDD5C9] hover:bg-[#F2ECE0] text-[#1E1B19] font-medium rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Homepage</span>
            </button>
            <button
              onClick={onOpenProfile}
              className="w-full sm:w-auto py-2.5 px-4 bg-white border border-[#DDD5C9] hover:bg-[#F2ECE0] text-[#1E1B19] font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
