import { EPSILON } from './constants.js';
import { ExactFormInfo } from '../types/calculator.js';

/**
 * Finds the best rational approximation (fraction p/q) for a float within maxDenominator.
 */
export function floatToFraction(val: number, maxDenominator = 1000): { n: number; d: number } | null {
  if (!Number.isFinite(val)) return null;
  if (Math.abs(val) > 100000) return null;

  const sign = val < 0 ? -1 : 1;
  const absVal = Math.abs(val);
  const integerPart = Math.floor(absVal);
  const fracPart = absVal - integerPart;

  if (fracPart < 1e-9) {
    return { n: sign * integerPart, d: 1 };
  }

  // Continued fraction method
  let h1 = 1, h2 = 0;
  let k1 = 0, k2 = 1;
  let b = fracPart;

  while (true) {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;

    if (k1 > maxDenominator) break;

    const approx = h1 / k1;
    if (Math.abs(fracPart - approx) < 1e-8) {
      const finalNumerator = sign * (integerPart * k1 + h1);
      return { n: finalNumerator, d: k1 };
    }

    if (Math.abs(b - a) < 1e-12) break;
    b = 1 / (b - a);
  }

  return null;
}

/**
 * Simplifies an integer square root: sqrt(n) = coeff * sqrt(radicand)
 */
function simplifySqrt(n: number): { coeff: number; radicand: number } {
  let coeff = 1;
  let radicand = n;
  for (let i = 2; i * i <= radicand; i++) {
    while (radicand % (i * i) === 0) {
      coeff *= i;
      radicand /= (i * i);
    }
  }
  return { coeff, radicand };
}

/**
 * Identifies if a value is an exact multiple of pi
 */
export function identifyPiMultiple(val: number): ExactFormInfo | null {
  const piRatio = val / Math.PI;
  const frac = floatToFraction(piRatio, 24);
  if (!frac || frac.d > 24 || Math.abs(frac.n) > 100) return null;

  const sign = frac.n < 0 ? '-' : '';
  const absN = Math.abs(frac.n);

  let display = '';
  if (frac.d === 1) {
    display = absN === 1 ? `${sign}π` : `${frac.n}π`;
  } else {
    const numStr = absN === 1 ? `${sign}π` : `${frac.n}π`;
    display = `${numStr}/${frac.d}`;
  }

  return {
    type: 'pi',
    numerator: absN === 1 ? (sign ? '-π' : 'π') : `${frac.n}π`,
    denominator: frac.d,
    display,
  };
}

/**
 * Identifies if a value is a standard Casio radical/surd (e.g. sqrt(3)/2, sqrt(2), 2*sqrt(3))
 */
export function identifySurd(val: number): ExactFormInfo | null {
  if (Math.abs(val) < 1e-6 || Math.abs(val) > 100) return null;

  const sign = val < 0 ? -1 : 1;
  const sq = val * val;
  const frac = floatToFraction(sq, 16);
  if (!frac || frac.d > 16 || frac.n > 200 || frac.n <= 0) return null;

  // Check if frac.n has non-trivial radical
  const numSimp = simplifySqrt(frac.n);
  const denSimp = simplifySqrt(frac.d);

  // If both are perfect squares, it's already a rational fraction, not a surd
  if (numSimp.radicand === 1 && denSimp.radicand === 1) return null;

  // If denominator is not a perfect square, rationalize it:
  // sqrt(n/d) = sqrt(n*d)/d
  const rationalizedNumerator = frac.n * frac.d;
  const rationalizedDenominator = frac.d;

  const finalSimp = simplifySqrt(rationalizedNumerator);
  const d = rationalizedDenominator;

  // Reduce coeff and d by gcd
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const common = gcd(finalSimp.coeff, d);
  const finalCoeff = (sign * finalSimp.coeff) / common;
  const finalDen = d / common;

  const absCoeff = Math.abs(finalCoeff);
  const signStr = finalCoeff < 0 ? '-' : '';
  const numStr = finalSimp.radicand === 1
    ? `${finalCoeff}`
    : absCoeff === 1
      ? `${signStr}√${finalSimp.radicand}`
      : `${finalCoeff}√${finalSimp.radicand}`;

  const display = finalDen === 1 ? numStr : `${numStr}/${finalDen}`;

  return {
    type: 'surd',
    numerator: numStr,
    denominator: finalDen,
    display,
  };
}

/**
 * Formats a numeric result into standard Casio display format with S<=>D support
 */
export function formatResultValue(val: number): {
  formatted: string;
  exactForm?: string;
  mixedForm?: string;
  exactInfo?: ExactFormInfo;
  isFraction: boolean;
} {
  if (!Number.isFinite(val)) {
    return { formatted: 'Math ERROR', isFraction: false };
  }

  // Clean micro floating point artifacts close to zero or integers
  let cleaned = val;
  if (Math.abs(cleaned) < EPSILON) cleaned = 0;
  else {
    const rounded = Math.round(cleaned);
    if (Math.abs(cleaned - rounded) < 1e-11) {
      cleaned = rounded;
    }
  }

  // Format decimal (standard readout)
  let formatted: string;
  const absVal = Math.abs(cleaned);

  if (absVal !== 0 && (absVal >= 1e10 || absVal < 1e-9)) {
    const expStr = cleaned.toExponential(9);
    formatted = expStr.replace(/(\.[0-9]*[1-9])0+e/, '$1e').replace(/\.0+e/, 'e');
  } else {
    // Max 10 digits precision
    formatted = parseFloat(cleaned.toPrecision(10)).toString();
  }

  // Check 1: Pi multiple
  const piInfo = identifyPiMultiple(cleaned);
  if (piInfo) {
    return {
      formatted,
      exactForm: piInfo.display,
      exactInfo: piInfo,
      isFraction: true,
    };
  }

  // Check 2: Radical / Surd
  const surdInfo = identifySurd(cleaned);
  if (surdInfo) {
    return {
      formatted,
      exactForm: surdInfo.display,
      exactInfo: surdInfo,
      isFraction: true,
    };
  }

  // Check 3: Rational Fraction
  const frac = floatToFraction(cleaned);
  if (frac && frac.d > 1) {
    const exactForm = `${frac.n}/${frac.d}`;
    let mixedForm: string | undefined = undefined;

    // If improper fraction, create mixed fraction e.g. 7/4 -> 1 3/4
    const absN = Math.abs(frac.n);
    if (absN > frac.d) {
      const sign = frac.n < 0 ? '-' : '';
      const whole = Math.floor(absN / frac.d);
      const rem = absN % frac.d;
      if (rem > 0) {
        mixedForm = `${sign}${whole} ${rem}/${frac.d}`;
      }
    }

    const exactInfo: ExactFormInfo = {
      type: 'fraction',
      numerator: frac.n,
      denominator: frac.d,
      display: exactForm,
    };

    return {
      formatted,
      exactForm,
      mixedForm,
      exactInfo,
      isFraction: true,
    };
  }

  return { formatted, isFraction: false };
}
