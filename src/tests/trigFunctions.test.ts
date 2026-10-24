import { describe, it, expect } from 'vitest';
import {
  calcSin,
  calcCos,
  calcTan,
  calcCot,
  calcSec,
  calcCsc,
  calcAsin,
  calcAcos,
  calcAtan,
  calcAcot,
  calcAsec,
  calcAcsc,
  calcSinh,
  calcCosh,
  calcTanh,
  calcCoth,
  calcSech,
  calcCsch,
} from '../engine/trigFunctions.js';

describe('Trigonometric Functions in DEG & RAD', () => {
  it('handles exact degree values', () => {
    expect(calcSin(0, 'DEG')).toBe(0);
    expect(calcSin(30, 'DEG')).toBe(0.5);
    expect(calcSin(90, 'DEG')).toBe(1);
    expect(calcSin(180, 'DEG')).toBe(0);
    expect(calcSin(270, 'DEG')).toBe(-1);

    expect(calcCos(0, 'DEG')).toBe(1);
    expect(calcCos(60, 'DEG')).toBe(0.5);
    expect(calcCos(90, 'DEG')).toBe(0);
    expect(calcCos(180, 'DEG')).toBe(-1);

    expect(calcTan(0, 'DEG')).toBe(0);
    expect(calcTan(45, 'DEG')).toBe(1);
    expect(calcCot(45, 'DEG')).toBe(1);
    expect(calcSec(60, 'DEG')).toBe(2);
    expect(calcCsc(30, 'DEG')).toBe(2);
  });

  it('handles radians correctly', () => {
    expect(calcSin(Math.PI / 6, 'RAD')).toBeCloseTo(0.5, 10);
    expect(calcCos(Math.PI / 3, 'RAD')).toBeCloseTo(0.5, 10);
    expect(calcTan(Math.PI / 4, 'RAD')).toBeCloseTo(1, 10);
    expect(calcCot(Math.PI / 4, 'RAD')).toBeCloseTo(1, 10);
  });

  it('throws Math ERROR on DEG singularities', () => {
    expect(() => calcTan(90, 'DEG')).toThrow('Math ERROR');
    expect(() => calcTan(270, 'DEG')).toThrow('Math ERROR');
    expect(() => calcSec(90, 'DEG')).toThrow('Math ERROR');
    expect(() => calcCot(0, 'DEG')).toThrow('Math ERROR');
    expect(() => calcCot(180, 'DEG')).toThrow('Math ERROR');
    expect(() => calcCsc(0, 'DEG')).toThrow('Math ERROR');
    expect(() => calcCsc(180, 'DEG')).toThrow('Math ERROR');
  });

  it('throws Math ERROR on RAD singularities', () => {
    expect(() => calcTan(Math.PI / 2, 'RAD')).toThrow('Math ERROR');
    expect(() => calcSec(Math.PI / 2, 'RAD')).toThrow('Math ERROR');
    expect(() => calcCot(0, 'RAD')).toThrow('Math ERROR');
    expect(() => calcCot(Math.PI, 'RAD')).toThrow('Math ERROR');
    expect(() => calcCsc(0, 'RAD')).toThrow('Math ERROR');
    expect(() => calcCsc(Math.PI, 'RAD')).toThrow('Math ERROR');
  });

  it('handles inverse trigonometric functions', () => {
    expect(calcAsin(0.5, 'DEG')).toBeCloseTo(30, 10);
    expect(calcAcos(0.5, 'DEG')).toBeCloseTo(60, 10);
    expect(calcAtan(1, 'DEG')).toBeCloseTo(45, 10);
    expect(calcAcot(1, 'DEG')).toBeCloseTo(45, 10);
    expect(calcAsec(2, 'DEG')).toBeCloseTo(60, 10);
    expect(calcAcsc(2, 'DEG')).toBeCloseTo(30, 10);

    // Range checks
    expect(() => calcAsin(1.5, 'DEG')).toThrow('Math ERROR');
    expect(() => calcAcos(-1.1, 'DEG')).toThrow('Math ERROR');
    expect(() => calcAsec(0.5, 'DEG')).toThrow('Math ERROR');
    expect(() => calcAcsc(0.5, 'DEG')).toThrow('Math ERROR');
  });

  it('handles hyperbolic functions', () => {
    expect(calcSinh(0)).toBe(0);
    expect(calcCosh(0)).toBe(1);
    expect(calcTanh(0)).toBe(0);
    expect(calcSech(0)).toBe(1);

    expect(() => calcCoth(0)).toThrow('Math ERROR');
    expect(() => calcCsch(0)).toThrow('Math ERROR');
  });
});
