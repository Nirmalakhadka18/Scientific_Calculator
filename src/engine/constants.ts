export const EPSILON = 1e-12;

export const ALLOWED_FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
  'asin', 'acos', 'atan', 'acot', 'asec', 'acsc',
  'sinh', 'cosh', 'tanh', 'coth', 'sech', 'csch',
  'asinh', 'acosh', 'atanh', 'acoth', 'asech', 'acsch',
  'sqrt', 'cbrt', 'nthRoot', 'pow', 'exp', 'log', 'log10', 'ln', 'abs',
  'factorial', 'permutations', 'combinations', 'nPr', 'nCr',
  'round', 'floor', 'ceil', 'mod', 'add', 'subtract', 'multiply', 'divide'
]);

export const ALLOWED_CONSTANTS = new Set([
  'pi', 'e', 'Ans', 'deg', 'rad'
]);

export const ERROR_MESSAGES = {
  SYNTAX: 'Syntax ERROR',
  MATH: 'Math ERROR',
  STACK: 'Stack ERROR',
  DOMAIN: 'Math ERROR',
} as const;
