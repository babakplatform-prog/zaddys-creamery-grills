import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsRight, Check, Sparkles } from 'lucide-react';

interface DragSliderButtonProps {
  label?: string;
  completedLabel?: string;
  onComplete: () => void;
  isCompleted?: boolean;
  disabled?: boolean;
  className?: string;
}

export const DragSliderButton: React.FC<DragSliderButtonProps> = ({
  label = 'Drag or click to confirm',
  completedLabel = 'Confirmed & Completed!',
  onComplete,
  isCompleted = false,
  disabled = false,
  className = '',
}) => {
  const [dragProgress, setDragProgress] = useState(isCompleted ? 100 : 0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDragProgress(isCompleted ? 100 : 0);
  }, [isCompleted]);

  const handleDrag = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled || isCompleted) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackWidth = rect.width;
      const thumbWidth = 48; // width of thumb
      const maxDistance = trackWidth - thumbWidth;
      const currentPos = clientX - rect.left - thumbWidth / 2;

      const progress = Math.max(0, Math.min(100, (currentPos / maxDistance) * 100));
      setDragProgress(progress);

      if (progress >= 88) {
        setDragProgress(100);
        setIsDragging(false);
        onComplete();
      }
    },
    [disabled, isCompleted, onComplete]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || isCompleted) return;
    setIsDragging(true);
    handleDrag(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isCompleted) return;
    setIsDragging(true);
    handleDrag(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDrag(e.clientX);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (dragProgress < 88) {
          // Snap back if released before threshold
          setDragProgress(0);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleDrag(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        if (dragProgress < 88) {
          setDragProgress(0);
        }
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragProgress, handleDrag]);

  // Click-to-toggle or complete option
  const handleClickTrack = (e: React.MouseEvent) => {
    if (disabled || isCompleted) return;
    // Clicking also activates the button!
    setDragProgress(100);
    onComplete();
  };

  return (
    <div
      ref={trackRef}
      onClick={handleClickTrack}
      className={`relative select-none h-14 rounded-2xl p-1 overflow-hidden transition-all duration-300 flex items-center cursor-pointer border ${
        isCompleted
          ? 'bg-emerald-600 border-emerald-500 shadow-md text-white'
          : 'bg-[#F2ECE1] border-[#DDD5C9] shadow-inner text-[#5A524C] hover:border-[#D3121B]/40'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {/* Dynamic Fill Bar behind thumb */}
      <div
        className={`absolute left-0 top-0 bottom-0 rounded-xl transition-all duration-75 ${
          isCompleted ? 'bg-emerald-600' : 'bg-[#D3121B]'
        }`}
        style={{ width: `${Math.max(12, dragProgress)}%` }}
      />

      {/* Label Text in center */}
      <div className="absolute inset-0 flex items-center justify-center font-sans-ui text-xs sm:text-sm font-semibold pointer-events-none z-10 px-12 text-center transition-colors">
        {isCompleted ? (
          <span className="flex items-center gap-1.5 text-white animate-in zoom-in-95 duration-200">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{completedLabel}</span>
          </span>
        ) : (
          <span
            className={`transition-opacity duration-200 ${
              dragProgress > 30 ? 'text-white' : 'text-[#5A524C]'
            }`}
          >
            {label}
          </span>
        )}
      </div>

      {/* Draggable Thumb */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`relative z-20 w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform duration-75 cursor-grab active:cursor-grabbing ${
          isCompleted
            ? 'bg-white text-emerald-600 ml-auto'
            : 'bg-white text-[#D3121B] border border-black/5 hover:scale-105 active:scale-95'
        }`}
        style={{
          transform: isCompleted ? 'none' : `translateX(${((trackRef.current?.clientWidth || 280) - 56) * (dragProgress / 100)}px)`,
        }}
      >
        {isCompleted ? (
          <Check className="w-5 h-5 stroke-[2.5]" />
        ) : (
          <ChevronsRight className="w-5 h-5 animate-pulse" />
        )}
      </div>
    </div>
  );
};
