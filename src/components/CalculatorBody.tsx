import { useState, useEffect } from 'react';
import { useCalculator } from '../hooks/useCalculator.js';
import { CalculatorScreen } from './CalculatorScreen.js';
import { ScientificKeypad } from './ScientificKeypad.js';
import { HistoryDrawer } from './HistoryDrawer.js';
import { History, HelpCircle } from 'lucide-react';

export function CalculatorBody() {
  const {
    expression,
    setExpression,
    result,
    angleUnit,
    shiftActive,
    alphaActive,
    sdFormat,
    history,
    insertToken,
    deleteLastChar,
    clearAll,
    calculate,
    toggleShift,
    toggleAlpha,
    toggleAngleUnit,
    toggleSD,
    replayUp,
    replayDown,
    clearHistory,
  } = useCalculator();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Global physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key >= '0' && e.key <= '9') {
        insertToken(e.key);
      } else if (e.key === '.') {
        insertToken('.');
      } else if (e.key === '+') {
        insertToken('+');
      } else if (e.key === '-') {
        insertToken('-');
      } else if (e.key === '*') {
        insertToken('×');
      } else if (e.key === '/') {
        e.preventDefault();
        insertToken('÷');
      } else if (e.key === '(' || e.key === ')') {
        insertToken(e.key);
      } else if (e.key === '^') {
        insertToken('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Backspace') {
        deleteLastChar();
      } else if (e.key === 'Escape') {
        clearAll();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        replayUp();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        replayDown();
      } else if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        toggleSD();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [insertToken, calculate, deleteLastChar, clearAll, replayUp, replayDown, toggleSD]);

  return (
    /*
     * Chassis:
     *   Mobile  : fluid responsive width, compact padding so keys have max room
     *   Tablet  : max-w-md, padded comfortably
     *   Desktop : max-w-[28rem], authentic physical calculator proportions
     */
    <div className="
      relative w-full
      max-w-[22rem] xs:max-w-[23.5rem] sm:max-w-md md:max-w-[26rem] lg:max-w-[27.5rem]
      mx-auto
      rounded-2xl sm:rounded-3xl
      p-2.5 xs:p-3 sm:p-4 lg:p-5
      bg-gradient-to-b from-[#252d37] via-[#1a2027] to-[#12161b]
      shadow-[0_16px_40px_rgba(0,0,0,0.75),inset_0_1px_1px_rgba(255,255,255,0.18)]
      border-2 border-[#333d49]
    ">
      {/* ── Top Brand & Solar Strip Header ─────────────────────────────── */}
      <div className="flex items-center justify-between pb-2 sm:pb-3 px-0.5 border-b border-[#2b3542]">
        <div className="flex flex-col leading-none">
          <span className="text-[7.5px] xs:text-[8px] sm:text-[9px] tracking-widest font-black text-slate-400 uppercase">
            SCIENTIFIC CALCULATOR
          </span>
          <div className="flex items-center space-x-1 mt-0.5">
            <span className="text-[11px] sm:text-sm font-bold tracking-tight text-white">
              fx-991ES PLUS
            </span>
            <span className="text-[7.5px] xs:text-[8px] sm:text-[10px] font-semibold text-slate-400">
              2nd edition
            </span>
          </div>
          <span className="text-[6.5px] xs:text-[7px] sm:text-[8px] font-bold tracking-wider text-slate-400 italic mt-0.5">
            NATURAL-V.P.A.M.
          </span>
        </div>

        <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3">
          {/* Solar Panel Strip */}
          <div className="flex flex-col items-center">
            <div className="w-12 xs:w-14 sm:w-20 h-3.5 sm:h-5 rounded bg-gradient-to-r from-[#2a1e16] via-[#3a281c] to-[#2a1e16] border border-[#523e30] shadow-inner grid grid-cols-4 gap-0.5 p-0.5">
              <div className="border-r border-[#523e30]/60" />
              <div className="border-r border-[#523e30]/60" />
              <div className="border-r border-[#523e30]/60" />
              <div />
            </div>
            <span className="text-[5.5px] xs:text-[6px] sm:text-[7px] font-black tracking-widest text-slate-500 mt-0.5">
              TWO WAY POWER
            </span>
          </div>

          {/* Quick Actions (History, Help) */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              aria-label="History"
              className="p-1 sm:p-1.5 rounded-lg bg-[#27313c] hover:bg-[#344150] text-amber-400 transition active:scale-95"
              title="Calculation History"
            >
              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowHelp((prev) => !prev)}
              aria-label="Help"
              className="p-1 sm:p-1.5 rounded-lg bg-[#27313c] hover:bg-[#344150] text-slate-300 transition active:scale-95"
              title="Keyboard Shortcuts"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── LCD Screen ─────────────────────────────────────────────────── */}
      <div className="mt-2.5 sm:mt-3">
        <CalculatorScreen
          expression={expression}
          result={result}
          angleUnit={angleUnit}
          shiftActive={shiftActive}
          alphaActive={alphaActive}
          sdFormat={sdFormat}
          hasHistory={history.length > 0}
        />
      </div>

      {/* ── Full Scientific Keypad ──────────────────────────────────────── */}
      <ScientificKeypad
        onInsert={insertToken}
        onDelete={deleteLastChar}
        onClear={clearAll}
        onCalculate={calculate}
        onToggleShift={toggleShift}
        onToggleAlpha={toggleAlpha}
        onToggleAngleUnit={toggleAngleUnit}
        onToggleSD={toggleSD}
        onReplayUp={replayUp}
        onReplayDown={replayDown}
        shiftActive={shiftActive}
        alphaActive={alphaActive}
      />

      {/* ── History Drawer ─────────────────────────────────────────────── */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectExpression={(expr) => setExpression(expr)}
        onClearHistory={clearHistory}
      />

      {/* ── Keyboard Shortcuts Modal ───────────────────────────────────── */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl p-5 w-full sm:max-w-sm text-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span>Keyboard Shortcuts</span>
            </h3>
            <ul className="text-xs space-y-2 text-slate-300">
              <li><strong className="text-white">0–9, .</strong> : Numbers &amp; decimal point</li>
              <li><strong className="text-white">+, -, *, /</strong> : Basic arithmetic operators</li>
              <li><strong className="text-white">Enter or =</strong> : Calculate expression</li>
              <li><strong className="text-white">Backspace</strong> : Delete last character (DEL)</li>
              <li><strong className="text-white">Escape</strong> : Clear all (AC)</li>
              <li><strong className="text-white">↑ / ↓</strong> : History replay navigation</li>
              <li><strong className="text-white">D key</strong> : Toggle S⇔D (fraction / mixed / decimal)</li>
              <li><strong className="text-white">^ key</strong> : Power operator</li>
            </ul>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-4 w-full py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-xl transition text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
