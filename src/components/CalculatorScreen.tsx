import { useRef, useEffect } from 'react';
import { AngleUnit, EvaluationResult, SDDisplayFormat } from '../types/calculator.js';
import { LcdStatusBar } from './LcdStatusBar.js';

interface CalculatorScreenProps {
  expression: string;
  result: EvaluationResult | null;
  angleUnit: AngleUnit;
  shiftActive: boolean;
  alphaActive: boolean;
  sdFormat: SDDisplayFormat;
  hasHistory: boolean;
}

export function CalculatorScreen({
  expression,
  result,
  angleUnit,
  shiftActive,
  alphaActive,
  sdFormat,
  hasHistory,
}: CalculatorScreenProps) {
  const exprEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll expression line to right as user types
  useEffect(() => {
    if (exprEndRef.current && typeof exprEndRef.current.scrollIntoView === 'function') {
      exprEndRef.current.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
    }
  }, [expression]);

  const renderResult = () => {
    if (!result) return null;

    if (result.error) {
      return (
        <div className="text-right text-red-950 font-bold tracking-wider text-base sm:text-xl animate-pulse">
          {result.error}
        </div>
      );
    }

    // 1. Exact Form (Stacked fraction, surd, or pi multiple)
    if (sdFormat === 'exact' && result.exactInfo) {
      const info = result.exactInfo;

      if (info.denominator && info.denominator > 1) {
        return (
          <div className="flex items-center justify-end">
            <div className="inline-flex flex-col items-center justify-center leading-none text-[#182316] font-bold">
              <span className="text-xs sm:text-sm border-b-2 border-[#182316] px-1 pb-0.5">
                {info.numerator}
              </span>
              <span className="text-xs sm:text-sm pt-0.5 px-1">
                {info.denominator}
              </span>
            </div>
          </div>
        );
      }

      return (
        <div className="text-right text-[#182316] font-bold text-xl sm:text-2xl tracking-wide">
          {info.display}
        </div>
      );
    }

    // 2. Mixed Fraction Form (e.g. 1 3/4)
    if (sdFormat === 'mixed' && result.exactInfo && result.exactInfo.denominator) {
      const num = Number(result.exactInfo.numerator);
      const den = result.exactInfo.denominator;

      if (Number.isFinite(num) && Math.abs(num) > den) {
        const sign = num < 0 ? '-' : '';
        const whole = Math.floor(Math.abs(num) / den);
        const rem = Math.abs(num) % den;

        return (
          <div className="flex items-center justify-end space-x-1.5 text-[#182316] font-bold">
            <span className="text-xl sm:text-2xl leading-none">{sign}{whole}</span>
            <div className="inline-flex flex-col items-center justify-center leading-none text-[10px] sm:text-xs">
              <span className="border-b border-[#182316] px-0.5 pb-0.5">
                {rem}
              </span>
              <span className="pt-0.5 px-0.5">
                {den}
              </span>
            </div>
          </div>
        );
      }
    }

    // 3. Decimal Form (Standard)
    return (
      <div className="text-right text-[#182316] font-bold text-xl sm:text-2xl tracking-wide">
        {result.formatted}
      </div>
    );
  };

  const getFormatBadge = () => {
    if (!result || !result.isFraction) return null;
    if (sdFormat === 'exact') return '[d/c]';
    if (sdFormat === 'mixed') return '[a b/c]';
    return '[DEC]';
  };

  return (
    /*
     * Screen height:
     *  Mobile  : h-28 (7rem = 112px)
     *  Tablet+ : h-32 (8rem = 128px) → h-36 (9rem = 144px)
     */
    <div className="
      relative rounded-lg p-2 sm:p-2.5
      shadow-[inset_0_3px_10px_rgba(0,0,0,0.45)]
      border-4 border-[#252c34]
      bg-gradient-to-b from-[#bdceb9] to-[#acc1a8]
      text-[#1b2518] select-none overflow-hidden
      h-28 sm:h-32 lg:h-36
      flex flex-col justify-between
    ">
      {/* Subtle LCD dot-matrix overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#1b2518_0.75px,transparent_0.75px)] [background-size:4px_4px] opacity-10" />
      {/* Glass glare */}
      <div className="absolute -top-12 -left-12 w-48 h-24 bg-white/10 rounded-full blur-xl pointer-events-none transform -rotate-12" />

      {/* Status Bar */}
      <LcdStatusBar
        shiftActive={shiftActive}
        alphaActive={alphaActive}
        angleUnit={angleUnit}
        hasHistory={hasHistory}
      />

      {/* Upper Expression Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-2 pt-0.5 sm:pt-1 font-lcd text-sm sm:text-base lg:text-lg tracking-wide scrollbar-none flex items-center">
        <span className="whitespace-pre">
          {expression || ' '}
        </span>
        {/* Blinking cursor */}
        <span className="inline-block w-[2px] h-3 sm:h-4 bg-[#1b2518] ml-0.5 animate-pulse align-middle" />
        <div ref={exprEndRef} />
      </div>

      {/* Lower Result Area */}
      <div className="px-2 pb-1 font-lcd min-h-[30px] sm:min-h-[36px] flex items-end justify-between">
        <div className="text-[9px] sm:text-[10px] text-[#2c3b28] font-bold opacity-75">
          {getFormatBadge()}
        </div>
        <div className="flex-1">
          {renderResult()}
        </div>
      </div>
    </div>
  );
}
