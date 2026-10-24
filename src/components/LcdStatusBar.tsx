import { AngleUnit } from '../types/calculator.js';

interface LcdStatusBarProps {
  shiftActive: boolean;
  alphaActive: boolean;
  angleUnit: AngleUnit;
  hasHistory: boolean;
}

export function LcdStatusBar({
  shiftActive,
  alphaActive,
  angleUnit,
  hasHistory,
}: LcdStatusBarProps) {
  return (
    <div className="flex items-center justify-between px-2 pt-1 pb-0.5 text-[11px] font-bold tracking-wider font-lcd border-b border-[#9ba998]/40 select-none text-[#1b2518]">
      <div className="flex items-center space-x-3">
        {/* SHIFT indicator */}
        <span className={`px-1 rounded ${shiftActive ? 'bg-[#1b2518] text-[#b9cbb6]' : 'opacity-10'}`}>
          S
        </span>
        {/* ALPHA indicator */}
        <span className={`px-1 rounded ${alphaActive ? 'bg-[#1b2518] text-[#b9cbb6]' : 'opacity-10'}`}>
          A
        </span>
        {/* Memory indicator */}
        <span className="opacity-10">M</span>
      </div>

      <div className="flex items-center space-x-3">
        {/* Angle Unit */}
        <span data-testid="angle-unit-indicator" className="px-1 font-extrabold">
          {angleUnit === 'DEG' ? 'D' : angleUnit === 'RAD' ? 'R' : 'G'}
        </span>
        {/* Natural display indicator */}
        <span className="font-semibold text-[10px]">Math</span>
        {/* History arrow indicators */}
        <span className={`text-[10px] ${hasHistory ? 'opacity-90' : 'opacity-15'}`}>
          ▲▼
        </span>
      </div>
    </div>
  );
}
