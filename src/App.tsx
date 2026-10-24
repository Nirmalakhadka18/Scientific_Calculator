import { CalculatorBody } from './components/CalculatorBody.js';

export default function App() {
  return (
    /*
     * Responsive layout strategy:
     * - Mobile (< 640px)  : full-width, minimal padding, scrollable if needed
     * - Tablet (640–1024px): centred card, moderate padding
     * - Desktop (> 1024px) : centred, generous padding, shadow backdrop
     */
    <div className="
      min-h-screen min-h-[100dvh] w-full
      bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950
      flex flex-col items-center
      justify-start sm:justify-center
      py-3 sm:py-6 lg:py-10
      px-2 sm:px-6 lg:px-8
      text-slate-100
    ">
      {/* Page header — smaller on mobile to save space */}
      <header className="mb-2 sm:mb-4 text-center select-none">
        <h1 className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-slate-200 leading-tight">
          Scientific Calculator
        </h1>
        <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
          Inspired by FX-991ES Plus 2nd Edition · Natural-V.P.A.M.
        </p>
      </header>

      {/* Calculator body — fluid max-width that grows with screen */}
      <CalculatorBody />

      <footer className="mt-2 sm:mt-4 text-[9px] sm:text-[11px] text-slate-500 text-center select-none pb-2">
        Independent scientific calculator implementation · Natural Textbook Display
      </footer>
    </div>
  );
}
