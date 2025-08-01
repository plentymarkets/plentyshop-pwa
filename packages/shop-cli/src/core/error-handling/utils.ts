/**
 * Error handling utilities for PlentyONE Shop generators
 */

import type { ErrorDetails, UserFriendlyMessageKey } from './types';

/**
 * Custom error class for generator-specific errors
 */
export class GeneratorError extends Error {
  public code: string;
  public details: ErrorDetails;

  constructor(message: string, code: string, details: ErrorDetails = {}) {
    super(message);
    this.name = 'GeneratorError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Error codes for different types of generator errors
 */
export const ERROR_CODES = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  FILE_EXISTS: 'FILE_EXISTS',
  INVALID_PATH: 'INVALID_PATH',
  TEMPLATE_ERROR: 'TEMPLATE_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  UNKNOWN_GENERATOR: 'UNKNOWN_GENERATOR',
};

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(errors: string[]): string | null {
  if (!errors || errors.length === 0) {
    return null;
  }

  if (errors.length === 1) {
    return `❌ ${errors[0]}`;
  }

  return ['❌ Multiple validation errors:', ...errors.map((error: string) => `   • ${error}`)].join('\n');
}

/**
 * Handles GeneratorError instances with specific error codes
 */
function handleGeneratorErrorCode(error: GeneratorError): string {
  switch (error.code) {
    case ERROR_CODES.VALIDATION_FAILED:
      return `❌ Validation Error: ${error.message}`;

    case ERROR_CODES.FILE_EXISTS:
      return `❌ File Conflict: ${error.message}\n💡 Use --force to overwrite or choose a different name.`;

    case ERROR_CODES.INVALID_PATH:
      return `❌ Invalid Path: ${error.message}`;

    case ERROR_CODES.TEMPLATE_ERROR:
      return `❌ Template Error: ${error.message}\n💡 Please check the template files and try again.`;

    case ERROR_CODES.PERMISSION_DENIED:
      return `❌ Permission Error: ${error.message}\n💡 Check file permissions and try again.`;

    case ERROR_CODES.UNKNOWN_GENERATOR:
      return `❌ Unknown Generator: ${error.message}\n💡 Run 'npm run generate' to see available generators.`;

    default:
      return `❌ Generator Error: ${error.message}`;
  }
}

/**
 * Handles standard Node.js error codes
 */
function handleNodeError(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const nodeError = error as { code: string; path?: string; message?: string };

    if (nodeError.code === 'ENOENT') {
      return `❌ File not found: ${nodeError.path || nodeError.message}`;
    }

    if (nodeError.code === 'EACCES') {
      return `❌ Permission denied: ${nodeError.path || nodeError.message}`;
    }

    if (nodeError.code === 'EEXIST') {
      return `❌ File already exists: ${nodeError.path || nodeError.message}`;
    }
  }

  return null;
}

/**
 * Handles and formats different types of errors
 */
export function handleGeneratorError(error: unknown): string {
  // Handle GeneratorError instances
  if (error instanceof GeneratorError) {
    return handleGeneratorErrorCode(error);
  }

  // Handle standard Node.js errors
  const nodeErrorMessage = handleNodeError(error);
  if (nodeErrorMessage) {
    return nodeErrorMessage;
  }

  // Generic error handling
  const message = error instanceof Error ? error.message : String(error);
  return `❌ Unexpected error: ${message}`;
}

/**
 * Wrapper for safe execution of generator functions
 */
export async function safeExecute<T>(fn: () => Promise<T> | T, _context = 'Generator'): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const formattedError = handleGeneratorError(error);
    console.error(`\n${formattedError}\n`);

    // Log detailed error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Detailed error:', error);
    }

    throw error;
  }
}

/**
 * User-friendly error messages for common issues
 */
export const USER_FRIENDLY_MESSAGES = {
  componentExists: (name: string) =>
    `Component "${name}" already exists. Consider:\n` +
    `   • Choosing a different name\n` +
    `   • Using the existing component\n` +
    `   • Removing the existing component first`,

  invalidComponentName: (name: string) =>
    `"${name}" is not a valid component name. Component names should:\n` +
    `   • Start with a capital letter\n` +
    `   • Use PascalCase (e.g., ProductCard)\n` +
    `   • Not contain spaces or special characters\n` +
    `   • Not be HTML element names or reserved words`,

  invalidComposableName: (name: string) =>
    `"${name}" is not a valid composable name. Composable names should:\n` +
    `   • Start with "use"\n` +
    `   • Use camelCase (e.g., useProductCart)\n` +
    `   • Not contain spaces or special characters\n` +
    `   • Not be reserved words`,

  projectNotFound: () =>
    `Cannot find PlentyONE Shop PWA project structure.\n` +
    `   • Make sure you're running this from the project root\n` +
    `   • Ensure the project has apps/web/ directory\n` +
    `   • Check that you're in the correct workspace`,

  noWritePermission: (path: string) =>
    `Cannot write to "${path}". This might be due to:\n` +
    `   • Insufficient file permissions\n` +
    `   • The directory is read-only\n` +
    `   • Antivirus software blocking the operation`,
} as const;

/**
 * Creates user-friendly messages with suggestions
 */
export function createFriendlyMessage(messageKey: UserFriendlyMessageKey, ...args: unknown[]): string {
  const messageFunction = USER_FRIENDLY_MESSAGES[messageKey];
  if (typeof messageFunction === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (messageFunction as any)(...args);
  }
  return `Unknown error: ${messageKey}`;
}
