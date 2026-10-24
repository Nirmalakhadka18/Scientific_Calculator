import { ALLOWED_CONSTANTS, ALLOWED_FUNCTIONS, ERROR_MESSAGES } from './constants.js';

/**
 * Validates balanced parentheses in an expression
 */
export function areParenthesesBalanced(expr: string): boolean {
  let count = 0;
  for (const ch of expr) {
    if (ch === '(') count++;
    else if (ch === ')') {
      count--;
      if (count < 0) return false;
    }
  }
  return count === 0;
}

/**
 * Sanitizes and validates an expression against allowed identifiers
 * Blocks any arbitrary JS injection, prototype access, eval, etc.
 */
export function validateExpressionSecurity(expr: string): { isValid: boolean; error?: string } {
  // Check for forbidden JavaScript keywords or properties
  const forbiddenPatterns = [
    /\bwindow\b/i,
    /\bdocument\b/i,
    /\bglobal\b/i,
    /\bprocess\b/i,
    /\bconstructor\b/i,
    /\b__proto__\b/i,
    /\bprototype\b/i,
    /\bimport\b/i,
    /\brequire\b/i,
    /\beval\b/i,
    /\bFunction\b/i,
    /\bsetTimeout\b/i,
    /\bsetInterval\b/i,
    /\bfetch\b/i,
    /[;{}[\]`$]/, // Braces/semicolons/backticks are not allowed in the evaluated linear mathjs expression
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(expr)) {
      return { isValid: false, error: ERROR_MESSAGES.SYNTAX };
    }
  }

  // Extract all identifiers (words)
  const identifierRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g;
  let match: RegExpExecArray | null;

  while ((match = identifierRegex.exec(expr)) !== null) {
    const ident = match[0];
    if (!ALLOWED_FUNCTIONS.has(ident) && !ALLOWED_CONSTANTS.has(ident)) {
      return { isValid: false, error: ERROR_MESSAGES.SYNTAX };
    }
  }

  return { isValid: true };
}

/**
 * Validates syntax structure for obvious errors (e.g. dangling operators, consecutive invalid operators)
 */
export function validateSyntax(expr: string): { isValid: boolean; error?: string } {
  const trimmed = expr.trim();
  if (!trimmed) {
    return { isValid: false, error: ERROR_MESSAGES.SYNTAX };
  }

  if (!areParenthesesBalanced(trimmed)) {
    return { isValid: false, error: ERROR_MESSAGES.SYNTAX };
  }

  // Expression ending in binary operator (e.g., "2 +", "5 *")
  if (/[+\-*/^]$/.test(trimmed)) {
    return { isValid: false, error: ERROR_MESSAGES.SYNTAX };
  }

  // Invalid consecutive operators (e.g., "++", "*/", "//")
  if (/([*/^]{2,})|([+\-]{3,})/.test(trimmed)) {
    return { isValid: false, error: ERROR_MESSAGES.SYNTAX };
  }

  return { isValid: true };
}
