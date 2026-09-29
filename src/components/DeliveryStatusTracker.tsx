import React, { useState, useEffect } from 'react';
import { OrderRecord } from '../types';
import { Clock, CheckCircle2, Bike, ChefHat, Sparkles, Navigation, FastForward } from 'lucide-react';

interface DeliveryStatusTrackerProps {
  order: OrderRecord;
}

export type DeliveryStage = 'Preparing' | 'Out for Delivery' | 'Delivered';

interface StageDetail {
  stage: DeliveryStage;
  progressPercent: number;
  stageIndex: number;
  timeRemainingText: string;
  statusDescription: string;
}

export const DeliveryStatusTracker: React.FC<DeliveryStatusTrackerProps> = ({ order }) => {
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [manualOverride, setManualOverride] = useState<DeliveryStage | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Live timer tick every second for real-time tracking updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateStatus = (): StageDetail => {
    if (manualOverride) {
      if (manualOverride === 'Preparing') {
        return {
          stage: 'Preparing',
          progressPercent: 25,
          stageIndex: 0,
          timeRemainingText: 'Est. 25 mins',
          statusDescription: 'Chef is grilling fresh wings & preparing creamery order',
        };
      }
      if (manualOverride === 'Out for Delivery') {
        return {
          stage: 'Out for Delivery',
          progressPercent: 70,
          stageIndex: 1,
          timeRemainingText: 'Arriving in ~8 mins',
          statusDescription: 'Zaddys express rider is en route to your address',
        };
      }
      return {
        stage: 'Delivered',
        progressPercent: 100,
        stageIndex: 2,
        timeRemainingText: 'Delivered',
        statusDescription: 'Order safely delivered to recipient',
      };
    }

    const orderTimestamp = new Date(order.createdAt).getTime();
    const elapsedSeconds = Math.max(0, (currentTime - orderTimestamp) / 1000);
    const simulatedElapsed = elapsedSeconds * speedMultiplier;

    // Thresholds:
    // 0s to 40s (simulated): Preparing
    // 40s to 90s (simulated): Out for Delivery
    // 90s+ (simulated): Delivered
    if (simulatedElapsed < 40) {
      const stageProgress = 15 + Math.floor((simulatedElapsed / 40) * 25);
      const remainingSecs = Math.max(1, 40 - Math.floor(simulatedElapsed));
      return {
        stage: 'Preparing',
        progressPercent: stageProgress,
        stageIndex: 0,
        timeRemainingText: `Kitchen Prep · ~${remainingSecs}s in simulation`,
        statusDescription: 'Chef is grilling chicken wings & chilling creamery cake',
      };
    } else if (simulatedElapsed < 90) {
      const stageProgress = 45 + Math.floor(((simulatedElapsed - 40) / 50) * 45);
      const remainingSecs = Math.max(1, 90 - Math.floor(simulatedElapsed));
      return {
        stage: 'Out for Delivery',
        progressPercent: stageProgress,
        stageIndex: 1,
        timeRemainingText: `Rider En Route · ~${remainingSecs}s to arrival`,
        statusDescription: 'Dispatch rider is speeding your feast over in insulated thermal box',
      };
    } else {
      return {
        stage: 'Delivered',
        progressPercent: 100,
        stageIndex: 2,
        timeRemainingText: 'Delivered to your door',
        statusDescription: 'Feast delivered safely. Enjoy your Zaddys moment!',
      };
    }
  };

  const status = calculateStatus();

  return (
    <div className="mt-3 p-3.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl space-y-3 font-sans-ui">
      {/* Top stage header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {status.stage === 'Preparing' && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              <ChefHat className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Preparing in Kitchen</span>
            </span>
          )}
          {status.stage === 'Out for Delivery' && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <Bike className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
              <span>Out for Delivery</span>
            </span>
          )}
          {status.stage === 'Delivered' && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Delivered</span>
            </span>
          )}

          <span className="text-2xs text-[#7A736E] font-medium">
            {status.timeRemainingText}
          </span>
        </div>

        {/* Speed simulation control */}
        <div className="flex items-center gap-1 text-2xs">
          <span className="text-[#8A827B]">Simulate:</span>
          <button
            type="button"
            onClick={() => {
              setManualOverride(null);
              setSpeedMultiplier(1);
            }}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              speedMultiplier === 1 && !manualOverride
                ? 'bg-[#1E1B19] text-white'
                : 'bg-white text-[#5C5550] border border-[#DDD5C9]'
            }`}
            title="1x Real-time speed"
          >
            1x
          </button>
          <button
            type="button"
            onClick={() => {
              setManualOverride(null);
              setSpeedMultiplier(5);
            }}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              speedMultiplier === 5 && !manualOverride
                ? 'bg-[#D3121B] text-white'
                : 'bg-white text-[#5C5550] border border-[#DDD5C9]'
            }`}
            title="5x Fast Simulation"
          >
            5x Fast
          </button>
          <button
            type="button"
            onClick={() => setManualOverride('Delivered')}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              manualOverride === 'Delivered'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-[#5C5550] border border-[#DDD5C9]'
            }`}
            title="Skip to Delivered"
          >
            Done
          </button>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative pt-1">
        {/* Track */}
        <div className="w-full bg-[#E5DED2] rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              status.stage === 'Delivered'
                ? 'bg-emerald-500'
                : status.stage === 'Out for Delivery'
                ? 'bg-blue-500'
                : 'bg-[#D3121B]'
            }`}
            style={{ width: `${status.progressPercent}%` }}
          />
        </div>

        {/* 3 Stepper Checkpoints */}
        <div className="flex justify-between items-center mt-2 text-2xs text-[#7A736E]">
          <div
            className={`flex items-center gap-1 cursor-pointer ${
              status.stageIndex >= 0 ? 'text-[#1E1B19] font-semibold' : ''
            }`}
            onClick={() => setManualOverride('Preparing')}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-3xs ${
                status.stageIndex >= 0
                  ? 'bg-[#D3121B] text-white'
                  : 'bg-[#DDD5C9] text-[#7A736E]'
              }`}
            >
              1
            </div>
            <span>Kitchen Prep</span>
          </div>

          <div
            className={`flex items-center gap-1 cursor-pointer ${
              status.stageIndex >= 1 ? 'text-blue-700 font-semibold' : ''
            }`}
            onClick={() => setManualOverride('Out for Delivery')}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-3xs ${
                status.stageIndex >= 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#DDD5C9] text-[#7A736E]'
              }`}
            >
              2
            </div>
            <span>On The Road</span>
          </div>

          <div
            className={`flex items-center gap-1 cursor-pointer ${
              status.stageIndex >= 2 ? 'text-emerald-700 font-semibold' : ''
            }`}
            onClick={() => setManualOverride('Delivered')}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-3xs ${
                status.stageIndex >= 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#DDD5C9] text-[#7A736E]'
              }`}
            >
              ✓
            </div>
            <span>Delivered</span>
          </div>
        </div>
      </div>

      {/* Dynamic Status Description Note */}
      <div className="flex items-center justify-between text-2xs text-[#6B635D] pt-1 border-t border-[#EDE7DC]">
        <p className="flex items-center gap-1.5 italic">
          <Navigation className="w-3 h-3 text-[#D3121B] shrink-0" />
          <span>{status.statusDescription}</span>
        </p>
      </div>
    </div>
  );
};
