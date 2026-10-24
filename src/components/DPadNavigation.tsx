import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DPadNavigationProps {
  onUp: () => void;
  onDown: () => void;
  onLeft?: () => void;
  onRight?: () => void;
}

export function DPadNavigation({
  onUp,
  onDown,
  onLeft,
  onRight,
}: DPadNavigationProps) {
  return (
    <div className="relative w-20 h-16 xs:w-22 xs:h-18 sm:w-24 sm:h-20 md:w-28 md:h-22 rounded-full bg-gradient-to-b from-[#2a3440] via-[#1a2027] to-[#12161b] p-1 sm:p-1.5 shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] border border-[#3b4755] flex items-center justify-center select-none shrink-0">
      {/* Center Replay Label */}
      <div className="absolute text-[8px] xs:text-[9px] font-black tracking-widest text-slate-400 uppercase pointer-events-none z-10 opacity-80">
        REPLAY
      </div>

      {/* Up Button */}
      <button
        type="button"
        onClick={onUp}
        aria-label="History Previous"
        className="absolute top-0.5 sm:top-1 left-1/2 -translate-x-1/2 w-8 h-5 sm:h-6 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition cursor-pointer touch-manipulation focus:outline-none"
      >
        <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {/* Down Button */}
      <button
        type="button"
        onClick={onDown}
        aria-label="History Next"
        className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 w-8 h-5 sm:h-6 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition cursor-pointer touch-manipulation focus:outline-none"
      >
        <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {/* Left Button */}
      <button
        type="button"
        onClick={onLeft}
        aria-label="Cursor Left"
        className="absolute left-0.5 sm:left-1 top-1/2 -translate-y-1/2 w-5 sm:w-6 h-7 sm:h-8 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition cursor-pointer touch-manipulation focus:outline-none"
      >
        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {/* Right Button */}
      <button
        type="button"
        onClick={onRight}
        aria-label="Cursor Right"
        className="absolute right-0.5 sm:right-1 top-1/2 -translate-y-1/2 w-5 sm:w-6 h-7 sm:h-8 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition cursor-pointer touch-manipulation focus:outline-none"
      >
        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}
