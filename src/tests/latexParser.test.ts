import { describe, it, expect } from 'vitest';
import { latexToMathjs } from '../engine/latexParser.js';
import { evaluateExpression } from '../engine/evaluate.js';

describe('MathLive LaTeX to Mathjs Conversion', () => {
  it('converts basic fractions', () => {
    const res = latexToMathjs('\\frac{1}{2}');
    expect(res).toBe('((1)/(2))');
  });

  it('converts nested fractions', () => {
    const res = latexToMathjs('\\frac{\\frac{1}{2}}{3}');
    expect(res).toBe('((((1)/(2)))/(3))');
  });

  it('converts square roots', () => {
    const res = latexToMathjs('\\sqrt{144}');
    expect(res).toBe('sqrt(144)');
  });

  it('converts nth roots', () => {
    const res = latexToMathjs('\\sqrt[3]{8}');
    expect(res).toBe('nthRoot(8, 3)');
  });

  it('converts exponents', () => {
    const res = latexToMathjs('2^{3}');
    expect(res).toBe('2^(3)');
  });

  it('inserts implicit multiplication between numbers and parentheses', () => {
    const res = latexToMathjs('2(3 + 4)');
    expect(res).toBe('2*(3 + 4)');
  });

  it('inserts implicit multiplication between adjacent parentheses', () => {
    const res = latexToMathjs('(2 + 3)(4 + 5)');
    expect(res).toBe('(2 + 3)*(4 + 5)');
  });

  it('inserts implicit multiplication for constants and functions', () => {
    expect(latexToMathjs('2\\pi')).toBe('2*pi');
    expect(latexToMathjs('4\\sqrt{9}')).toBe('4*sqrt(9)');
    expect(latexToMathjs('2\\sin(30)')).toBe('2*sin(30)');
  });

  it('evaluates natural textbook LaTeX expressions end-to-end', () => {
    const fracEval = evaluateExpression('\\frac{1}{2} + \\frac{1}{4}', { isLatex: true });
    expect(fracEval.status).toBe('success');
    expect(fracEval.value).toBe(0.75);

    const rootPowEval = evaluateExpression('\\sqrt{144} + 2^{3}', { isLatex: true });
    expect(rootPowEval.status).toBe('success');
    expect(rootPowEval.value).toBe(20);

    const trigEval = evaluateExpression('2\\sin(30)', { isLatex: true, angleUnit: 'DEG' });
    expect(trigEval.status).toBe('success');
    expect(trigEval.value).toBeCloseTo(1, 10);
  });
});
