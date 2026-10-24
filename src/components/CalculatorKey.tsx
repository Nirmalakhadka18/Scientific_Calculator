import React from 'react';

export type KeyVariant = 'function' | 'number' | 'action' | 'shift' | 'alpha' | 'equals';

interface CalculatorKeyProps {
  label: string | React.ReactNode;
  shiftLabel?: string;
  alphaLabel?: string;
  variant?: KeyVariant;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

export function CalculatorKey({
  label,
  shiftLabel,
  alphaLabel,
  variant = 'function',
  onClick,
  className = '',
  ariaLabel,
}: CalculatorKeyProps) {
  // Key body colors according to authentic Casio palette
  let bgStyles = '';
  let textStyles = 'text-xs sm:text-sm font-semibold';

  switch (variant) {
    case 'number':
      bgStyles = 'bg-gradient-to-b from-slate-100 to-slate-300 text-slate-900 border-b-2 border-slate-400 shadow-[0_2px_4px_rgba(0,0,0,0.4)] active:from-slate-200 active:to-slate-300';
      textStyles = 'text-sm sm:text-base md:text-lg font-bold';
      break;
    case 'action': // DEL & AC
      bgStyles = 'bg-gradient-to-b from-amber-600 to-orange-700 text-white border-b-2 border-orange-900 shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:from-orange-700 active:to-orange-800';
      textStyles = 'text-xs sm:text-sm md:text-base font-extrabold';
      break;
    case 'shift':
      bgStyles = 'bg-gradient-to-b from-amber-500 to-amber-700 text-slate-950 border-b-2 border-amber-900 shadow-[0_2px_4px_rgba(0,0,0,0.4)] active:from-amber-600 active:to-amber-800';
      textStyles = 'text-[11px] sm:text-xs md:text-sm font-black';
      break;
    case 'alpha':
      bgStyles = 'bg-gradient-to-b from-rose-600 to-red-800 text-white border-b-2 border-red-950 shadow-[0_2px_4px_rgba(0,0,0,0.4)] active:from-rose-700 active:to-red-900';
      textStyles = 'text-[11px] sm:text-xs md:text-sm font-black';
      break;
    case 'equals':
      bgStyles = 'bg-gradient-to-b from-slate-200 to-slate-400 text-slate-950 border-b-2 border-slate-500 shadow-[0_2px_4px_rgba(0,0,0,0.4)] active:from-slate-300 active:to-slate-400';
      textStyles = 'text-base sm:text-xl md:text-2xl font-extrabold';
      break;
    case 'function':
    default:
      bgStyles = 'bg-gradient-to-b from-[#2e3742] to-[#1c2229] text-slate-100 border-b-2 border-[#12161b] shadow-[0_2px_4px_rgba(0,0,0,0.4)] active:from-[#242b34] active:to-[#171c22]';
      textStyles = 'text-[11px] sm:text-xs md:text-sm font-semibold';
      break;
  }

  return (
    <div className={`flex flex-col items-center select-none w-full ${className}`}>
      {/* Secondary Labels Row (SHIFT on left / center, ALPHA on right) */}
      <div className="w-full flex items-center h-3 sm:h-3.5 px-0.5 text-[7.5px] xs:text-[8px] sm:text-[9px] font-bold leading-none pointer-events-none overflow-visible">
        {shiftLabel && alphaLabel ? (
          <div className="w-full flex items-center justify-between">
            <span className="text-amber-400 tracking-tighter whitespace-nowrap">
              {shiftLabel}
            </span>
            <span className="text-rose-400 tracking-tighter whitespace-nowrap text-right shrink-0 ml-0.5">
              {alphaLabel}
            </span>
          </div>
        ) : shiftLabel ? (
          <span className="w-full text-center text-amber-400 tracking-tighter whitespace-nowrap">
            {shiftLabel}
          </span>
        ) : alphaLabel ? (
          <span className="w-full text-right text-rose-400 tracking-tighter whitespace-nowrap pr-0.5">
            {alphaLabel}
          </span>
        ) : (
          <span className="w-full opacity-0 pointer-events-none">&nbsp;</span>
        )}
      </div>

      {/* Button Body */}
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
        className={`w-full h-8 xs:h-8.5 sm:h-9 md:h-10 rounded-md sm:rounded-lg flex items-center justify-center transition-all duration-75 active:translate-y-0.5 active:shadow-inner active:brightness-95 cursor-pointer touch-manipulation focus:outline-none focus:ring-1 focus:ring-amber-400/50 ${bgStyles} ${textStyles}`}
      >
        {label}
      </button>
    </div>
  );
}
