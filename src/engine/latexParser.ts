/**
 * Converts MathLive LaTeX mathematical expressions into safe linear expressions
 * suitable for mathjs parsing and evaluation.
 */

/**
 * Extracts content inside matching braces { ... } starting at index start.
 * Returns the inner string and the ending index after the closing brace.
 */
function extractBalancedBraces(str: string, start: number): { content: string; endIndex: number } | null {
  if (str[start] !== '{') return null;
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') {
      depth--;
      if (depth === 0) {
        return { content: str.substring(start + 1, i), endIndex: i + 1 };
      }
    }
  }
  return null;
}

/**
 * Extracts content inside matching brackets [ ... ] starting at index start.
 */
function extractBalancedBrackets(str: string, start: number): { content: string; endIndex: number } | null {
  if (str[start] !== '[') return null;
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === '[') depth++;
    else if (str[i] === ']') {
      depth--;
      if (depth === 0) {
        return { content: str.substring(start + 1, i), endIndex: i + 1 };
      }
    }
  }
  return null;
}

/**
 * Recursively converts nested \frac{num}{den} to ((num)/(den))
 */
export function convertFractions(str: string): string {
  let match: RegExpExecArray | null;
  let result = str;

  while ((match = /\\frac\s*\{/.exec(result)) !== null) {
    const startIndex = match.index;
    const brace1Start = startIndex + match[0].length - 1;
    const numExtract = extractBalancedBraces(result, brace1Start);
    if (!numExtract) break;

    const afterNum = result.slice(numExtract.endIndex).trimStart();
    if (!afterNum.startsWith('{')) {
      break;
    }
    const brace2Offset = result.indexOf('{', numExtract.endIndex);
    const denExtract = extractBalancedBraces(result, brace2Offset);
    if (!denExtract) break;

    const numConverted = convertFractions(numExtract.content);
    const denConverted = convertFractions(denExtract.content);

    const replacement = `((${numConverted})/(${denConverted}))`;
    result = result.substring(0, startIndex) + replacement + result.substring(denExtract.endIndex);
  }

  return result;
}

/**
 * Recursively converts \sqrt[n]{x} and \sqrt{x}
 */
export function convertRoots(str: string): string {
  let result = str;

  // 1. \sqrt[n]{x}
  while (true) {
    const match = /\\sqrt\s*\[/.exec(result);
    if (!match) break;
    const startIndex = match.index;
    const bracketStart = startIndex + match[0].length - 1;
    const orderExtract = extractBalancedBrackets(result, bracketStart);
    if (!orderExtract) break;

    const afterOrder = result.slice(orderExtract.endIndex).trimStart();
    if (!afterOrder.startsWith('{')) break;

    const braceStart = result.indexOf('{', orderExtract.endIndex);
    const radicandExtract = extractBalancedBraces(result, braceStart);
    if (!radicandExtract) break;

    const n = convertRoots(orderExtract.content);
    const x = convertRoots(radicandExtract.content);

    const replacement = `nthRoot(${x}, ${n})`;
    result = result.substring(0, startIndex) + replacement + result.substring(radicandExtract.endIndex);
  }

  // 2. \sqrt{x}
  while (true) {
    const match = /\\sqrt\s*\{/.exec(result);
    if (!match) break;
    const startIndex = match.index;
    const braceStart = startIndex + match[0].length - 1;
    const radicandExtract = extractBalancedBraces(result, braceStart);
    if (!radicandExtract) break;

    const x = convertRoots(radicandExtract.content);
    const replacement = `sqrt(${x})`;
    result = result.substring(0, startIndex) + replacement + result.substring(radicandExtract.endIndex);
  }

  return result;
}

/**
 * Converts powers like ^{exp} to ^(exp)
 */
export function convertPowers(str: string): string {
  let result = str;
  while (true) {
    const match = /\^\s*\{/.exec(result);
    if (!match) break;
    const startIndex = match.index;
    const braceStart = startIndex + match[0].length - 1;
    const expExtract = extractBalancedBraces(result, braceStart);
    if (!expExtract) break;

    const exp = convertPowers(expExtract.content);
    const replacement = `^(${exp})`;
    result = result.substring(0, startIndex) + replacement + result.substring(expExtract.endIndex);
  }
  return result;
}

/**
 * Inserts multiplication signs where implicit multiplication is intended
 * e.g., 2(3) -> 2*(3), (2)(3) -> (2)*(3), 2\pi -> 2*pi, 4sqrt(2) -> 4*sqrt(2)
 */
export function insertImplicitMultiplication(str: string): string {
  let res = str;

  // Number followed by '(' -> num * (
  res = res.replace(/(\d)(\s*\()/g, '$1*$2');

  // ')' followed by '(' -> ) * (
  res = res.replace(/(\))(\s*\()/g, '$1*$2');

  // ')' followed by number -> ) * num
  res = res.replace(/(\))(\s*\d)/g, '$1*$2');

  // Number or ')' followed by a constant/identifier (pi, e, Ans, sin, cos, tan, sqrt, etc.)
  res = res.replace(/(\d|\))(\s*)(pi|e|Ans|sin|cos|tan|cot|sec|csc|asin|acos|atan|acot|asec|acsc|sinh|cosh|tanh|coth|sech|csch|log|ln|sqrt|cbrt|nthRoot)/g, '$1*$3');

  // Factorial followed by number or '(' or function
  res = res.replace(/(!)(\s*)(\d|\(|pi|e|Ans|sin|cos|tan|sqrt)/g, '$1*$3');

  return res;
}

/**
 * Full LaTeX string to safe Mathjs linear string converter
 */
export function latexToMathjs(latex: string): string {
  if (!latex || !latex.trim()) return '';

  let str = latex.trim();

  // Strip MathLive placeholders or empty formatting
  str = str.replace(/\\placeholder\{[^}]*\}/g, '');
  str = str.replace(/\\square/g, '');

  // Convert fractions and roots first (structural nesting)
  str = convertFractions(str);
  str = convertRoots(str);
  str = convertPowers(str);

  // Standard LaTeX mathematical symbols and functions
  str = str.replace(/\\times\s*10\^(\d+|\([+-]?\d+\))/g, '*10^($1)');
  str = str.replace(/\\times/g, '*');
  str = str.replace(/\\cdot/g, '*');
  str = str.replace(/\\div/g, '/');
  str = str.replace(/\\left\(/g, '(');
  str = str.replace(/\\right\)/g, ')');
  str = str.replace(/\\left\[/g, '(');
  str = str.replace(/\\right\]/g, ')');
  str = str.replace(/\\left\|([^|]+)\\right\|/g, 'abs($1)');
  str = str.replace(/\\pi/g, 'pi');
  str = str.replace(/\\exponentialE/g, 'e');

  // Inverse trig notations like \sin^{-1}(x) or \sin^{-1} x
  str = str.replace(/\\sin\^\{-1\}/g, 'asin');
  str = str.replace(/\\cos\^\{-1\}/g, 'acos');
  str = str.replace(/\\tan\^\{-1\}/g, 'atan');
  str = str.replace(/\\cot\^\{-1\}/g, 'acot');
  str = str.replace(/\\sec\^\{-1\}/g, 'asec');
  str = str.replace(/\\csc\^\{-1\}/g, 'acsc');

  // Basic trig & log functions
  str = str.replace(/\\sin/g, 'sin');
  str = str.replace(/\\cos/g, 'cos');
  str = str.replace(/\\tan/g, 'tan');
  str = str.replace(/\\cot/g, 'cot');
  str = str.replace(/\\sec/g, 'sec');
  str = str.replace(/\\csc/g, 'csc');
  str = str.replace(/\\ln/g, 'ln');
  str = str.replace(/\\log_\{10\}/g, 'log10');
  str = str.replace(/\\log/g, 'log10');

  // Percentages: 50% -> (50/100)
  str = str.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

  // Clean remaining backslashes from simple words
  str = str.replace(/\\([a-zA-Z]+)/g, '$1');

  // Apply implicit multiplication
  str = insertImplicitMultiplication(str);

  return str.trim();
}
