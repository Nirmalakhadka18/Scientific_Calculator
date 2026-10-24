import { HistoryItem } from '../types/calculator.js';
import { History, Trash2, ArrowUpRight, X } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectExpression: (expr: string) => void;
  onClearHistory: () => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectExpression,
  onClearHistory,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full p-4 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-slate-100 font-bold">
            <History className="w-5 h-5 text-amber-500" />
            <span>Calculation History</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History Item List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No previous calculations recorded.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectExpression(item.latexExpression);
                  onClose();
                }}
                className="p-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/50 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-mono">{item.angleUnit}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-amber-400 transition" />
                </div>
                <div className="font-mono text-sm text-slate-200 truncate">
                  {item.latexExpression}
                </div>
                <div className="font-mono text-right text-amber-400 font-bold text-base mt-1">
                  = {item.result.formatted}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Clear Button */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClearHistory}
              className="w-full py-2 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-200 flex items-center justify-center space-x-2 text-sm font-semibold transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
