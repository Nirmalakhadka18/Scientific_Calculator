import { AngleUnit } from '../types/calculator.js';
import { EPSILON, ERROR_MESSAGES } from './constants.js';

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function gradToRad(grads: number): number {
  return (grads * Math.PI) / 200;
}

export function radToGrad(radians: number): number {
  return (radians * 200) / Math.PI;
}

/**
 * Normalizes an angle in degrees to [0, 360)
 */
function normalizeDeg(deg: number): number {
  let normalized = deg % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

/**
 * Checks if a degree angle is close to target (modulo 360 or modulo 180)
 */
function isCloseToDegMod(val: number, target: number, mod: number, tol = 1e-9): boolean {
  let rem = Math.abs((val - target) % mod);
  if (rem > mod / 2) rem = mod - rem;
  return rem < tol;
}

/**
 * Checks if a radian angle is close to target (modulo mod)
 */
function isCloseToRadMod(val: number, target: number, mod: number, tol = 1e-9): boolean {
  let rem = Math.abs((val - target) % mod);
  if (rem > mod / 2) rem = mod - rem;
  return rem < tol;
}

/**
 * Exact degree lookup for common angles to prevent floating point inaccuracies
 */
const EXACT_DEG_SIN: Record<number, number> = {
  0: 0,
  30: 0.5,
  90: 1,
  150: 0.5,
  180: 0,
  210: -0.5,
  270: -1,
  330: -0.5,
  360: 0,
};

const EXACT_DEG_COS: Record<number, number> = {
  0: 1,
  60: 0.5,
  90: 0,
  120: -0.5,
  180: -1,
  240: -0.5,
  270: 0,
  300: 0.5,
  360: 1,
};

const EXACT_DEG_TAN: Record<number, number> = {
  0: 0,
  45: 1,
  135: -1,
  180: 0,
  225: 1,
  315: -1,
  360: 0,
};

export function calcSin(x: number, unit: AngleUnit): number {
  if (unit === 'DEG') {
    const norm = normalizeDeg(x);
    for (const [degStr, val] of Object.entries(EXACT_DEG_SIN)) {
      if (Math.abs(norm - Number(degStr)) < 1e-9) return val;
    }
    const rad = degToRad(x);
    const res = Math.sin(rad);
    return Math.abs(res) < EPSILON ? 0 : res;
  } else if (unit === 'GRAD') {
    const rad = gradToRad(x);
    const res = Math.sin(rad);
    return Math.abs(res) < EPSILON ? 0 : res;
  } else {
    // RAD
    if (isCloseToRadMod(x, 0, Math.PI)) return 0;
    if (isCloseToRadMod(x, Math.PI / 6, 2 * Math.PI)) return 0.5;
    if (isCloseToRadMod(x, (5 * Math.PI) / 6, 2 * Math.PI)) return 0.5;
    if (isCloseToRadMod(x, (7 * Math.PI) / 6, 2 * Math.PI)) return -0.5;
    if (isCloseToRadMod(x, (11 * Math.PI) / 6, 2 * Math.PI)) return -0.5;
    const res = Math.sin(x);
    return Math.abs(res) < EPSILON ? 0 : res;
  }
}

export function calcCos(x: number, unit: AngleUnit): number {
  if (unit === 'DEG') {
    const norm = normalizeDeg(x);
    for (const [degStr, val] of Object.entries(EXACT_DEG_COS)) {
      if (Math.abs(norm - Number(degStr)) < 1e-9) return val;
    }
    const rad = degToRad(x);
    const res = Math.cos(rad);
    return Math.abs(res) < EPSILON ? 0 : res;
  } else if (unit === 'GRAD') {
    const rad = gradToRad(x);
    const res = Math.cos(rad);
    return Math.abs(res) < EPSILON ? 0 : res;
  } else {
    // RAD
    if (isCloseToRadMod(x, Math.PI / 2, Math.PI)) return 0;
    if (isCloseToRadMod(x, Math.PI / 3, 2 * Math.PI)) return 0.5;
    if (isCloseToRadMod(x, (5 * Math.PI) / 3, 2 * Math.PI)) return 0.5;
    if (isCloseToRadMod(x, (2 * Math.PI) / 3, 2 * Math.PI)) return -0.5;
    if (isCloseToRadMod(x, (4 * Math.PI) / 3, 2 * Math.PI)) return -0.5;
    const res = Math.cos(x);
    return Math.abs(res) < EPSILON ? 0 : res;
  }
}

export function calcTan(x: number, unit: AngleUnit): number {
  if (unit === 'DEG') {
    // Singularity check: 90 + 180k
    if (isCloseToDegMod(x, 90, 180)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    const norm = normalizeDeg(x);
    for (const [degStr, val] of Object.entries(EXACT_DEG_TAN)) {
      if (Math.abs(norm - Number(degStr)) < 1e-9) return val;
    }
    const cosVal = calcCos(x, unit);
    if (Math.abs(cosVal) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
    const res = calcSin(x, unit) / cosVal;
    return Math.abs(res) < EPSILON ? 0 : res;
  } else if (unit === 'GRAD') {
    if (isCloseToDegMod(x, 100, 200)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    const cosVal = calcCos(x, unit);
    if (Math.abs(cosVal) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
    return calcSin(x, unit) / cosVal;
  } else {
    // RAD
    if (isCloseToRadMod(x, Math.PI / 2, Math.PI)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    if (isCloseToRadMod(x, Math.PI / 4, Math.PI)) return 1;
    if (isCloseToRadMod(x, (3 * Math.PI) / 4, Math.PI)) return -1;
    if (isCloseToRadMod(x, 0, Math.PI)) return 0;
    const cosVal = Math.cos(x);
    if (Math.abs(cosVal) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
    const res = Math.sin(x) / cosVal;
    return Math.abs(res) < EPSILON ? 0 : res;
  }
}

export function calcCot(x: number, unit: AngleUnit): number {
  if (unit === 'DEG') {
    // Singularity: 0 + 180k
    if (isCloseToDegMod(x, 0, 180)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    if (isCloseToDegMod(x, 45, 180)) return 1;
    if (isCloseToDegMod(x, 135, 180)) return -1;
    if (isCloseToDegMod(x, 90, 180)) return 0;
    const tanVal = calcTan(x, unit);
    return 1 / tanVal;
  } else if (unit === 'GRAD') {
    if (isCloseToDegMod(x, 0, 200)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    const tanVal = calcTan(x, unit);
    return 1 / tanVal;
  } else {
    // RAD: Singularity at k*pi
    if (isCloseToRadMod(x, 0, Math.PI)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    if (isCloseToRadMod(x, Math.PI / 4, Math.PI)) return 1;
    if (isCloseToRadMod(x, (3 * Math.PI) / 4, Math.PI)) return -1;
    if (isCloseToRadMod(x, Math.PI / 2, Math.PI)) return 0;
    const tanVal = calcTan(x, unit);
    return 1 / tanVal;
  }
}

export function calcSec(x: number, unit: AngleUnit): number {
  if (unit === 'DEG') {
    // Singularity: 90 + 180k
    if (isCloseToDegMod(x, 90, 180)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    if (isCloseToDegMod(x, 60, 360) || isCloseToDegMod(x, 300, 360)) return 2;
    if (isCloseToDegMod(x, 120, 360) || isCloseToDegMod(x, 240, 360)) return -2;
    const cosVal = calcCos(x, unit);
    if (Math.abs(cosVal) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
    return 1 / cosVal;
  } else if (unit === 'GRAD') {
    if (isCloseToDegMod(x, 100, 200)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    const cosVal = calcCos(x, unit);
    if (Math.abs(cosVal) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
    return 1 / cosVal;
  } else {
    // RAD
    if (isCloseToRadMod(x, Math.PI / 2, Math.PI)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    if (isCloseToRadMod(x, Math.PI / 3, 2 * Math.PI) || isCloseToRadMod(x, (5 * Math.PI) / 3, 2 * Math.PI)) return 2;
    const cosVal = Math.cos(x);
    if (Math.abs(cosVal) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
    return 1 / cosVal;
  }
}

export function calcCsc(x: number, unit: AngleUnit): number {
  if (unit === 'DEG') {
    // Singularity: 0 + 180k
    if (isCloseToDegMod(x, 0, 180)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    if (isCloseToDegMod(x, 30, 360) || isCloseToDegMod(x, 150, 360)) return 2;
    if (isCloseToDegMod(x, 210, 360) || isCloseToDegMod(x, 330, 360)) return -2;
    const sinVal = calcSin(x, unit);
    if (Math.abs(sinVal) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
    return 1 / sinVal;
  } else if (unit === 'GRAD') {
    if (isCloseToDegMod(x, 0, 200)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    const sinVal = calcSin(x, unit);
    if (Math.abs(sinVal) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
    return 1 / sinVal;
  } else {
    // RAD
    if (isCloseToRadMod(x, 0, Math.PI)) {
      throw new Error(ERROR_MESSAGES.MATH);
    }
    if (isCloseToRadMod(x, Math.PI / 6, 2 * Math.PI) || isCloseToRadMod(x, (5 * Math.PI) / 6, 2 * Math.PI)) return 2;
    const sinVal = Math.sin(x);
    if (Math.abs(sinVal) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
    return 1 / sinVal;
  }
}

// Inverse trigonometric functions
export function calcAsin(x: number, unit: AngleUnit): number {
  if (x < -1 || x > 1) throw new Error(ERROR_MESSAGES.MATH);
  const rad = Math.asin(x);
  if (unit === 'DEG') return radToDeg(rad);
  if (unit === 'GRAD') return radToGrad(rad);
  return rad;
}

export function calcAcos(x: number, unit: AngleUnit): number {
  if (x < -1 || x > 1) throw new Error(ERROR_MESSAGES.MATH);
  const rad = Math.acos(x);
  if (unit === 'DEG') return radToDeg(rad);
  if (unit === 'GRAD') return radToGrad(rad);
  return rad;
}

export function calcAtan(x: number, unit: AngleUnit): number {
  const rad = Math.atan(x);
  if (unit === 'DEG') return radToDeg(rad);
  if (unit === 'GRAD') return radToGrad(rad);
  return rad;
}

/**
 * Inverse cotangent with documented standard convention:
 * Range (0, pi) in radians: acot(x) = pi/2 - atan(x)
 * Range (0, 180) in degrees: acot(x) = 90 - atan(x in deg)
 */
export function calcAcot(x: number, unit: AngleUnit): number {
  const rad = Math.PI / 2 - Math.atan(x);
  if (unit === 'DEG') return radToDeg(rad);
  if (unit === 'GRAD') return radToGrad(rad);
  return rad;
}

/**
 * Inverse secant: asec(x) = acos(1/x)
 * Domain: |x| >= 1
 * Range in radians: [0, pi], excluding pi/2
 */
export function calcAsec(x: number, unit: AngleUnit): number {
  if (Math.abs(x) < 1) throw new Error(ERROR_MESSAGES.MATH);
  return calcAcos(1 / x, unit);
}

/**
 * Inverse cosecant: acsc(x) = asin(1/x)
 * Domain: |x| >= 1
 * Range in radians: [-pi/2, pi/2], excluding 0
 */
export function calcAcsc(x: number, unit: AngleUnit): number {
  if (Math.abs(x) < 1) throw new Error(ERROR_MESSAGES.MATH);
  return calcAsin(1 / x, unit);
}

// Hyperbolic functions
export function calcSinh(x: number): number {
  return Math.sinh(x);
}

export function calcCosh(x: number): number {
  return Math.cosh(x);
}

export function calcTanh(x: number): number {
  return Math.tanh(x);
}

export function calcCoth(x: number): number {
  if (Math.abs(x) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
  return 1 / Math.tanh(x);
}

export function calcSech(x: number): number {
  return 1 / Math.cosh(x);
}

export function calcCsch(x: number): number {
  if (Math.abs(x) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
  return 1 / Math.sinh(x);
}

// Inverse hyperbolic functions
export function calcAsinh(x: number): number {
  return Math.asinh(x);
}

export function calcAcosh(x: number): number {
  if (x < 1) throw new Error(ERROR_MESSAGES.MATH);
  return Math.acosh(x);
}

export function calcAtanh(x: number): number {
  if (Math.abs(x) >= 1) throw new Error(ERROR_MESSAGES.MATH);
  return Math.atanh(x);
}

export function calcAcoth(x: number): number {
  if (Math.abs(x) <= 1) throw new Error(ERROR_MESSAGES.MATH);
  return 0.5 * Math.log((x + 1) / (x - 1));
}

export function calcAsech(x: number): number {
  if (x <= 0 || x > 1) throw new Error(ERROR_MESSAGES.MATH);
  return Math.acosh(1 / x);
}

export function calcAcsch(x: number): number {
  if (Math.abs(x) < EPSILON) throw new Error(ERROR_MESSAGES.MATH);
  return Math.asinh(1 / x);
}
