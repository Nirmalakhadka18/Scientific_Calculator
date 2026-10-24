export type AngleUnit = 'DEG' | 'RAD' | 'GRAD';

export type DisplayMode = 'MATH' | 'LINE';

export type ErrorType = 'Math ERROR' | 'Syntax ERROR' | 'Stack ERROR' | 'Domain ERROR';

export type SDDisplayFormat = 'exact' | 'mixed' | 'decimal';

export interface ExactFormInfo {
  type: 'fraction' | 'mixed' | 'surd' | 'pi';
  numerator?: number | string;
  denominator?: number;
  whole?: number;
  remainder?: number;
  display: string;
  latex?: string;
}

export interface EvaluationResult {
  status: 'success' | 'error';
  value?: number;
  formatted?: string;
  exactForm?: string;
  mixedForm?: string;
  exactInfo?: ExactFormInfo;
  error?: ErrorType | string;
  isFraction?: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  latexExpression: string;
  linearExpression: string;
  result: EvaluationResult;
  angleUnit: AngleUnit;
}

export type ModifierKey = 'NONE' | 'SHIFT' | 'ALPHA';
