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
  switch (variant) {
    case 'number':
      bgStyles = 'bg-gradient-to-b from-slate-100 to-slate-300 text-slate-900 border-b-2 border-slate-400 shadow-[0_2px_4px_rgba(0,0,0,0.4)] active:from-slate-200 active:to-slate-300 font-bold';
      break;
    case 'action': // DEL & AC
      bgStyles = 'bg-gradient-to-b from-amber-600 to-orange-700 text-white border-b-2 border-orange-900 shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:from-orange-700 active:to-orange-800 font-extrabold';
      break;
    case 'shift':
      bgStyles = 'bg-gradient-to-b from-amber-500 to-amber-700 text-slate-950 border-b-2 border-amber-900 shadow-[0_2px_4px_rgba(0,0,0,0.4)] active:from-amber-600 active:to-amber-800 font-black';
      break;
    case 'alpha':
      bgStyles = 'bg-gradient-to-b from-rose-600 to-red-800 text-white border-b-2 border-red-950 shadow-[0_2px_4px_rgba(0,0,0,0.4)] active:from-rose-700 active:to-red-900 font-black';
      break;
    case 'equals':
      bgStyles = 'bg-gradient-to-b from-slate-200 to-slate-400 text-slate-950 border-b-2 border-slate-500 shadow-[0_2px_4px_rgba(0,0,0,0.4)] active:from-slate-300 active:to-slate-400 font-extrabold text-xl';
      break;
    case 'function':
    default:
      bgStyles = 'bg-gradient-to-b from-[#2e3742] to-[#1c2229] text-slate-100 border-b-2 border-[#12161b] shadow-[0_2px_4px_rgba(0,0,0,0.4)] active:from-[#242b34] active:to-[#171c22] font-semibold';
      break;
  }

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Secondary Labels Row (SHIFT on left, ALPHA on right) */}
      <div className="w-full flex justify-between px-1 text-[10px] leading-tight h-3 font-semibold pointer-events-none">
        <span className="text-amber-400 truncate max-w-[48%]">
          {shiftLabel || ''}
        </span>
        <span className="text-rose-400 truncate max-w-[48%] text-right">
          {alphaLabel || ''}
        </span>
      </div>

      {/* Button Body */}
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
        className={`w-full h-8 md:h-9 rounded flex items-center justify-center text-sm transition-all duration-75 active:translate-y-0.5 active:shadow-inner cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400/50 ${bgStyles}`}
      >
        {label}
      </button>
    </div>
  );
}
