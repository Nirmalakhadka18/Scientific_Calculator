import { useState, useEffect, useCallback } from 'react';
import { AngleUnit, EvaluationResult, HistoryItem, SDDisplayFormat } from '../types/calculator.js';
import { evaluateExpression } from '../engine/evaluate.js';

const HISTORY_STORAGE_KEY = 'casio_fx991_history';

export function useCalculator() {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('DEG');
  const [shiftActive, setShiftActive] = useState<boolean>(false);
  const [alphaActive, setAlphaActive] = useState<boolean>(false);
  const [ans, setAns] = useState<number>(0);
  const [sdFormat, setSdFormat] = useState<SDDisplayFormat>('exact');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  const insertToken = useCallback((token: string) => {
    setExpression((prev) => {
      // If result is displayed and user types an operator, chain with Ans
      if (result && !result.error && ['+', '-', '×', '÷', '^', '*'].includes(token)) {
        return 'Ans' + (token === '×' ? '*' : token === '÷' ? '/' : token);
      }
      return prev + token;
    });
    setResult(null);
    setShiftActive(false);
    setAlphaActive(false);
  }, [result]);

  const deleteLastChar = useCallback(() => {
    setExpression((prev) => {
      if (!prev) return '';
      const funcMatch = /(sin\(|cos\(|tan\(|cot\(|sec\(|csc\(|asin\(|acos\(|atan\(|sinh\(|cosh\(|tanh\(|log10\(|ln\(|sqrt\(|nthRoot\(|Ans)$/.exec(prev);
      if (funcMatch) {
        return prev.substring(0, prev.length - funcMatch[0].length);
      }
      return prev.slice(0, -1);
    });
    setResult(null);
  }, []);

  const clearAll = useCallback(() => {
    setExpression('');
    setResult(null);
    setShiftActive(false);
    setAlphaActive(false);
    setHistoryIndex(-1);
    setSdFormat('exact');
  }, []);

  const evaluateCurrent = useCallback((): EvaluationResult | null => {
    if (!expression.trim()) return null;

    const normalized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/e\^/g, 'exp');

    const evalResult = evaluateExpression(normalized, {
      isLatex: false,
      angleUnit,
      previousAnswer: ans,
    });

    setResult(evalResult);

    if (evalResult.status === 'success' && evalResult.value !== undefined) {
      setAns(evalResult.value);
      setSdFormat('exact');

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        latexExpression: expression,
        linearExpression: normalized,
        result: evalResult,
        angleUnit,
      };

      setHistory((prev) => [newItem, ...prev.slice(0, 49)]);
      setHistoryIndex(-1);
    }

    return evalResult;
  }, [expression, angleUnit, ans]);

  const calculate = useCallback(() => {
    evaluateCurrent();
  }, [evaluateCurrent]);

  const toggleSD = useCallback(() => {
    // If no result is present yet but expression exists, evaluate first
    let currentResult = result;
    if (!currentResult && expression.trim()) {
      currentResult = evaluateCurrent();
    }

    if (!currentResult || currentResult.status !== 'success') return;

    // Cycle between modes:
    // If mixedForm exists: 'exact' -> 'mixed' -> 'decimal' -> 'exact'
    // Else if exactForm exists: 'exact' -> 'decimal' -> 'exact'
    // Else (pure integer / decimal): toggle between formatted and exactForm if available
    setSdFormat((current) => {
      if (current === 'exact') {
        if (currentResult?.mixedForm) {
          return 'mixed';
        }
        return 'decimal';
      } else if (current === 'mixed') {
        return 'decimal';
      } else {
        // From decimal back to exact
        return 'exact';
      }
    });
  }, [result, expression, evaluateCurrent]);

  const toggleShift = useCallback(() => {
    setShiftActive((prev) => !prev);
    setAlphaActive(false);
  }, []);

  const toggleAlpha = useCallback(() => {
    setAlphaActive((prev) => !prev);
    setShiftActive(false);
  }, []);

  const toggleAngleUnit = useCallback(() => {
    setAngleUnit((prev) => (prev === 'DEG' ? 'RAD' : prev === 'RAD' ? 'GRAD' : 'DEG'));
  }, []);

  const replayUp = useCallback(() => {
    if (history.length === 0) return;
    const nextIdx = Math.min(historyIndex + 1, history.length - 1);
    setHistoryIndex(nextIdx);
    setExpression(history[nextIdx].latexExpression);
    setResult(history[nextIdx].result);
    setSdFormat('exact');
  }, [history, historyIndex]);

  const replayDown = useCallback(() => {
    if (historyIndex <= 0) {
      setHistoryIndex(-1);
      setExpression('');
      setResult(null);
      setSdFormat('exact');
    } else {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setExpression(history[nextIdx].latexExpression);
      setResult(history[nextIdx].result);
      setSdFormat('exact');
    }
  }, [history, historyIndex]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear history from localStorage', e);
    }
  }, []);

  return {
    expression,
    setExpression,
    result,
    angleUnit,
    shiftActive,
    alphaActive,
    ans,
    sdFormat,
    history,
    historyIndex,
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
  };
}
