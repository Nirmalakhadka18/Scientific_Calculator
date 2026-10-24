import { create, all } from 'mathjs';
import { AngleUnit, EvaluationResult } from '../types/calculator.js';
import { ERROR_MESSAGES } from './constants.js';
import { formatResultValue } from './formatResult.js';
import { latexToMathjs } from './latexParser.js';
import {
  calcAcot,
  calcAcsc,
  calcAsec,
  calcAsin,
  calcAcos,
  calcAtan,
  calcCos,
  calcCot,
  calcCsc,
  calcSec,
  calcSin,
  calcTan,
  calcSinh,
  calcCosh,
  calcTanh,
  calcCoth,
  calcSech,
  calcCsch,
  calcAsinh,
  calcAcosh,
  calcAtanh,
  calcAcoth,
  calcAsech,
  calcAcsch,
} from './trigFunctions.js';
import { validateExpressionSecurity, validateSyntax } from './validation.js';

// Create a sandboxed mathjs instance
const math = create(all, {});

// Permutations nPr: n! / (n - r)!
export function nPr(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
    throw new Error(ERROR_MESSAGES.MATH);
  }
  let res = 1;
  for (let i = 0; i < r; i++) {
    res *= (n - i);
  }
  return res;
}

// Combinations nCr: n! / (r! * (n - r)!)
export function nCr(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
    throw new Error(ERROR_MESSAGES.MATH);
  }
  if (r === 0 || r === n) return 1;
  const k = Math.min(r, n - r);
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - k + i)) / i;
  }
  return Math.round(res);
}

// Factorial n!
export function calcFactorial(n: number): number {
  if (!Number.isInteger(n) || n < 0 || n > 170) {
    throw new Error(ERROR_MESSAGES.MATH);
  }
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Square root with real domain check
export function calcSqrt(x: number): number {
  if (x < 0) throw new Error(ERROR_MESSAGES.MATH);
  return Math.sqrt(x);
}

// Nth root
export function calcNthRoot(x: number, n: number): number {
  if (n === 0) throw new Error(ERROR_MESSAGES.MATH);
  if (x < 0) {
    if (n % 2 !== 0) {
      return -Math.pow(-x, 1 / n);
    }
    throw new Error(ERROR_MESSAGES.MATH);
  }
  return Math.pow(x, 1 / n);
}

// Logarithms
export function calcLog10(x: number): number {
  if (x <= 0) throw new Error(ERROR_MESSAGES.MATH);
  return Math.log10(x);
}

export function calcLn(x: number): number {
  if (x <= 0) throw new Error(ERROR_MESSAGES.MATH);
  return Math.log(x);
}

/**
 * Builds the execution scope for a calculation
 */
function createExecutionScope(unit: AngleUnit, previousAnswer: number = 0) {
  return {
    pi: Math.PI,
    e: Math.E,
    Ans: previousAnswer,

    // Trig
    sin: (x: number) => calcSin(x, unit),
    cos: (x: number) => calcCos(x, unit),
    tan: (x: number) => calcTan(x, unit),
    cot: (x: number) => calcCot(x, unit),
    sec: (x: number) => calcSec(x, unit),
    csc: (x: number) => calcCsc(x, unit),

    // Inverse trig
    asin: (x: number) => calcAsin(x, unit),
    acos: (x: number) => calcAcos(x, unit),
    atan: (x: number) => calcAtan(x, unit),
    acot: (x: number) => calcAcot(x, unit),
    asec: (x: number) => calcAsec(x, unit),
    acsc: (x: number) => calcAcsc(x, unit),

    // Hyperbolic
    sinh: calcSinh,
    cosh: calcCosh,
    tanh: calcTanh,
    coth: calcCoth,
    sech: calcSech,
    csch: calcCsch,

    // Inverse Hyperbolic
    asinh: calcAsinh,
    acosh: calcAcosh,
    atanh: calcAtanh,
    acoth: calcAcoth,
    asech: calcAsech,
    acsch: calcAcsch,

    // Roots & Logs
    sqrt: calcSqrt,
    nthRoot: calcNthRoot,
    log10: calcLog10,
    log: (x: number, base?: number) => {
      if (base !== undefined) {
        if (base <= 0 || base === 1 || x <= 0) throw new Error(ERROR_MESSAGES.MATH);
        return Math.log(x) / Math.log(base);
      }
      return calcLog10(x);
    },
    ln: calcLn,

    // Combinatorics
    factorial: calcFactorial,
    nPr: nPr,
    nCr: nCr,
    permutations: nPr,
    combinations: nCr,
  };
}

/**
 * Evaluates a mathematical expression (either LaTeX or linear algebraic notation)
 */
export function evaluateExpression(
  expression: string,
  options: {
    isLatex?: boolean;
    angleUnit?: AngleUnit;
    previousAnswer?: number;
  } = {}
): EvaluationResult {
  const { isLatex = false, angleUnit = 'DEG', previousAnswer = 0 } = options;

  try {
    if (!expression || !expression.trim()) {
      return { status: 'error', error: ERROR_MESSAGES.SYNTAX };
    }

    // Convert LaTeX if needed
    let linearExpr = isLatex ? latexToMathjs(expression) : expression;

    // Validate security and syntax
    const secCheck = validateExpressionSecurity(linearExpr);
    if (!secCheck.isValid) {
      return { status: 'error', error: secCheck.error || ERROR_MESSAGES.SYNTAX };
    }

    const synCheck = validateSyntax(linearExpr);
    if (!synCheck.isValid) {
      return { status: 'error', error: synCheck.error || ERROR_MESSAGES.SYNTAX };
    }

    // Compile and evaluate with scope
    const scope = createExecutionScope(angleUnit, previousAnswer);
    const parsed = math.parse(linearExpr);
    const compiled = parsed.compile();
    const rawResult = compiled.evaluate(scope);

    // Validate output type and domain
    if (typeof rawResult !== 'number' || !Number.isFinite(rawResult)) {
      return { status: 'error', error: ERROR_MESSAGES.MATH };
    }

    // Format output
    const { formatted, exactForm, mixedForm, exactInfo, isFraction } = formatResultValue(rawResult);

    return {
      status: 'success',
      value: rawResult,
      formatted,
      exactForm,
      mixedForm,
      exactInfo,
      isFraction,
    };
  } catch (err: any) {
    const msg = err?.message || '';
    if (msg.includes(ERROR_MESSAGES.MATH) || msg.includes('domain') || msg.includes('divide by zero')) {
      return { status: 'error', error: ERROR_MESSAGES.MATH };
    }
    return { status: 'error', error: ERROR_MESSAGES.SYNTAX };
  }
}
