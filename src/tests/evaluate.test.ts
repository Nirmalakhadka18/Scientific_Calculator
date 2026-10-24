import { describe, it, expect } from 'vitest';
import { evaluateExpression } from '../engine/evaluate.js';

describe('Mandatory Acceptance Tests', () => {
  it('calculates sin(30°) = 0.5 in DEG mode', () => {
    const res = evaluateExpression('sin(30)', { angleUnit: 'DEG' });
    expect(res.status).toBe('success');
    expect(res.value).toBeCloseTo(0.5, 10);
  });

  it('calculates cos(60°) = 0.5 in DEG mode', () => {
    const res = evaluateExpression('cos(60)', { angleUnit: 'DEG' });
    expect(res.status).toBe('success');
    expect(res.value).toBeCloseTo(0.5, 10);
  });

  it('calculates tan(45°) = 1 in DEG mode', () => {
    const res = evaluateExpression('tan(45)', { angleUnit: 'DEG' });
    expect(res.status).toBe('success');
    expect(res.value).toBeCloseTo(1, 10);
  });

  it('calculates cot(45°) = 1 in DEG mode', () => {
    const res = evaluateExpression('cot(45)', { angleUnit: 'DEG' });
    expect(res.status).toBe('success');
    expect(res.value).toBeCloseTo(1, 10);
  });

  it('calculates sec(60°) = 2 in DEG mode', () => {
    const res = evaluateExpression('sec(60)', { angleUnit: 'DEG' });
    expect(res.status).toBe('success');
    expect(res.value).toBeCloseTo(2, 10);
  });

  it('calculates cosec(30°) = 2 in DEG mode', () => {
    const res = evaluateExpression('csc(30)', { angleUnit: 'DEG' });
    expect(res.status).toBe('success');
    expect(res.value).toBeCloseTo(2, 10);
  });

  it('calculates sin(π/6) = 0.5 in RAD mode', () => {
    const res = evaluateExpression('sin(pi / 6)', { angleUnit: 'RAD' });
    expect(res.status).toBe('success');
    expect(res.value).toBeCloseTo(0.5, 10);
  });

  it('calculates 2 + 3 × 4 = 14', () => {
    const res = evaluateExpression('2 + 3 * 4');
    expect(res.status).toBe('success');
    expect(res.value).toBe(14);
  });

  it('calculates (2 + 3) × 4 = 20', () => {
    const res = evaluateExpression('(2 + 3) * 4');
    expect(res.status).toBe('success');
    expect(res.value).toBe(20);
  });

  it('calculates √144 = 12', () => {
    const res = evaluateExpression('sqrt(144)');
    expect(res.status).toBe('success');
    expect(res.value).toBe(12);
  });

  it('calculates 5! = 120', () => {
    const res = evaluateExpression('factorial(5)');
    expect(res.status).toBe('success');
    expect(res.value).toBe(120);
  });

  it('calculates log(100) = 2', () => {
    const res = evaluateExpression('log10(100)');
    expect(res.status).toBe('success');
    expect(res.value).toBe(2);
  });

  it('calculates ln(e) = 1', () => {
    const res = evaluateExpression('ln(e)');
    expect(res.status).toBe('success');
    expect(res.value).toBe(1);
  });

  it('calculates 2³ = 8', () => {
    const res = evaluateExpression('2 ^ 3');
    expect(res.status).toBe('success');
    expect(res.value).toBe(8);
  });
});

describe('Singularities, Domain and Error Handling', () => {
  it('handles tan(90°) as undefined (Math ERROR) in DEG mode', () => {
    const res = evaluateExpression('tan(90)', { angleUnit: 'DEG' });
    expect(res.status).toBe('error');
    expect(res.error).toBe('Math ERROR');
  });

  it('handles cot(0°) as undefined (Math ERROR) in DEG mode', () => {
    const res = evaluateExpression('cot(0)', { angleUnit: 'DEG' });
    expect(res.status).toBe('error');
    expect(res.error).toBe('Math ERROR');
  });

  it('handles sec(90°) as undefined (Math ERROR) in DEG mode', () => {
    const res = evaluateExpression('sec(90)', { angleUnit: 'DEG' });
    expect(res.status).toBe('error');
    expect(res.error).toBe('Math ERROR');
  });

  it('handles cosec(0°) as undefined (Math ERROR) in DEG mode', () => {
    const res = evaluateExpression('csc(0)', { angleUnit: 'DEG' });
    expect(res.status).toBe('error');
    expect(res.error).toBe('Math ERROR');
  });

  it('handles tan(pi/2) as undefined (Math ERROR) in RAD mode', () => {
    const res = evaluateExpression('tan(pi / 2)', { angleUnit: 'RAD' });
    expect(res.status).toBe('error');
    expect(res.error).toBe('Math ERROR');
  });

  it('handles division by zero', () => {
    const res = evaluateExpression('10 / 0');
    expect(res.status).toBe('error');
    expect(res.error).toBe('Math ERROR');
  });

  it('handles negative square root as Math ERROR in real mode', () => {
    const res = evaluateExpression('sqrt(-4)');
    expect(res.status).toBe('error');
    expect(res.error).toBe('Math ERROR');
  });

  it('handles log of non-positive numbers as Math ERROR', () => {
    const resZero = evaluateExpression('log10(0)');
    expect(resZero.status).toBe('error');
    expect(resZero.error).toBe('Math ERROR');

    const resNeg = evaluateExpression('ln(-5)');
    expect(resNeg.status).toBe('error');
    expect(resNeg.error).toBe('Math ERROR');
  });

  it('handles unbalanced parentheses as Syntax ERROR', () => {
    const res = evaluateExpression('(2 + 3');
    expect(res.status).toBe('error');
    expect(res.error).toBe('Syntax ERROR');
  });

  it('handles incomplete expressions with trailing operator as Syntax ERROR', () => {
    const res = evaluateExpression('2 + 3 *');
    expect(res.status).toBe('error');
    expect(res.error).toBe('Syntax ERROR');
  });

  it('prevents arbitrary JavaScript execution', () => {
    const res = evaluateExpression('constructor');
    expect(res.status).toBe('error');
    expect(res.error).toBe('Syntax ERROR');
  });

  it('correctly recalls Ans previousAnswer', () => {
    const res = evaluateExpression('Ans * 2', { previousAnswer: 15 });
    expect(res.status).toBe('success');
    expect(res.value).toBe(30);
  });
});

describe('S<=>D Standard to Decimal and Surd Conversions', () => {
  it('converts 1/2 to exact fraction 1/2 and decimal 0.5', () => {
    const res = evaluateExpression('1 / 2');
    expect(res.status).toBe('success');
    expect(res.exactForm).toBe('1/2');
    expect(res.formatted).toBe('0.5');
  });

  it('converts improper fractions to mixed fractions (7/4 = 1 3/4)', () => {
    const res = evaluateExpression('7 / 4');
    expect(res.status).toBe('success');
    expect(res.exactForm).toBe('7/4');
    expect(res.mixedForm).toBe('1 3/4');
    expect(res.formatted).toBe('1.75');
  });

  it('identifies exact surds like cos(30°) = √3/2', () => {
    const res = evaluateExpression('cos(30)', { angleUnit: 'DEG' });
    expect(res.status).toBe('success');
    expect(res.exactForm).toBe('√3/2');
    expect(res.formatted).toBeCloseTo(0.8660254038, 8);
  });

  it('identifies exact pi multiples like 2 * pi = 2π', () => {
    const res = evaluateExpression('2 * pi');
    expect(res.status).toBe('success');
    expect(res.exactForm).toBe('2π');
  });
});

describe('Negative Angles, GRAD Mode, Combinatorics, and Precedence', () => {
  it('handles negative angles correctly in DEG mode', () => {
    expect(evaluateExpression('sin(-30)', { angleUnit: 'DEG' }).value).toBeCloseTo(-0.5, 10);
    expect(evaluateExpression('cos(-60)', { angleUnit: 'DEG' }).value).toBeCloseTo(0.5, 10);
    expect(evaluateExpression('tan(-45)', { angleUnit: 'DEG' }).value).toBeCloseTo(-1, 10);
    expect(evaluateExpression('cot(-45)', { angleUnit: 'DEG' }).value).toBeCloseTo(-1, 10);
    expect(evaluateExpression('sec(-60)', { angleUnit: 'DEG' }).value).toBeCloseTo(2, 10);
    expect(evaluateExpression('csc(-30)', { angleUnit: 'DEG' }).value).toBeCloseTo(-2, 10);
  });

  it('handles negative angle singularities as Math ERROR', () => {
    expect(evaluateExpression('tan(-90)', { angleUnit: 'DEG' }).error).toBe('Math ERROR');
    expect(evaluateExpression('sec(-90)', { angleUnit: 'DEG' }).error).toBe('Math ERROR');
    expect(evaluateExpression('cot(-180)', { angleUnit: 'DEG' }).error).toBe('Math ERROR');
    expect(evaluateExpression('csc(-180)', { angleUnit: 'DEG' }).error).toBe('Math ERROR');
  });

  it('handles GRAD angle mode calculations and singularities', () => {
    expect(evaluateExpression('sin(100)', { angleUnit: 'GRAD' }).value).toBeCloseTo(1, 10);
    expect(evaluateExpression('cos(200)', { angleUnit: 'GRAD' }).value).toBeCloseTo(-1, 10);
    expect(evaluateExpression('tan(50)', { angleUnit: 'GRAD' }).value).toBeCloseTo(1, 10);
    expect(evaluateExpression('tan(100)', { angleUnit: 'GRAD' }).error).toBe('Math ERROR');
    expect(evaluateExpression('cot(0)', { angleUnit: 'GRAD' }).error).toBe('Math ERROR');
  });

  it('calculates combinatorics nPr and nCr with domain validation', () => {
    expect(evaluateExpression('nPr(6, 2)').value).toBe(30);
    expect(evaluateExpression('nCr(6, 2)').value).toBe(15);
    expect(evaluateExpression('nPr(4, 5)').error).toBe('Math ERROR');
    expect(evaluateExpression('nCr(4, -1)').error).toBe('Math ERROR');
  });

  it('guards unbounded factorials against overflow', () => {
    expect(evaluateExpression('factorial(170)').status).toBe('success');
    expect(evaluateExpression('factorial(171)').error).toBe('Math ERROR');
    expect(evaluateExpression('factorial(-3)').error).toBe('Math ERROR');
  });

  it('verifies operator precedence and nested parentheses', () => {
    expect(evaluateExpression('2 + 3 * (4 - 1)^2').value).toBe(29);
    expect(evaluateExpression('(-3)^2').value).toBe(9);
    expect(evaluateExpression('-(3^2)').value).toBe(-9);
  });
});

