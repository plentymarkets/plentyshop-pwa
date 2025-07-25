/**
 * Error handling utilities for PlentyONE Shop generators
 */

/**
 * Custom error class for generator-specific errors
 */
export class GeneratorError extends Error {
  constructor(message, code, details = {}) {
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
  UNKNOWN_GENERATOR: 'UNKNOWN_GENERATOR'
};

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(errors) {
  if (!errors || errors.length === 0) {
    return null;
  }

  if (errors.length === 1) {
    return `❌ ${errors[0]}`;
  }

  return [
    '❌ Multiple validation errors:',
    ...errors.map(error => `   • ${error}`)
  ].join('\n');
}

/**
 * Handles and formats different types of errors
 */
export function handleGeneratorError(error) {
  if (error instanceof GeneratorError) {
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

  // Handle standard errors
  if (error.code === 'ENOENT') {
    return `❌ File not found: ${error.path || error.message}`;
  }

  if (error.code === 'EACCES') {
    return `❌ Permission denied: ${error.path || error.message}`;
  }

  if (error.code === 'EEXIST') {
    return `❌ File already exists: ${error.path || error.message}`;
  }

  // Generic error handling
  return `❌ Unexpected error: ${error.message}`;
}

/**
 * Wrapper for safe execution of generator functions
 */
export async function safeExecute(fn, context = 'Generator') {
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
  componentExists: (name) => 
    `Component "${name}" already exists. Consider:\n` +
    `   • Choosing a different name\n` +
    `   • Using the existing component\n` +
    `   • Removing the existing component first`,
  
  invalidComponentName: (name) =>
    `"${name}" is not a valid component name. Component names should:\n` +
    `   • Start with a capital letter\n` +
    `   • Use PascalCase (e.g., ProductCard)\n` +
    `   • Not contain spaces or special characters\n` +
    `   • Not be HTML element names or reserved words`,
  
  invalidComposableName: (name) =>
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
  
  noWritePermission: (path) =>
    `Cannot write to "${path}". This might be due to:\n` +
    `   • Insufficient file permissions\n` +
    `   • The directory is read-only\n` +
    `   • Antivirus software blocking the operation`
};

/**
 * Creates user-friendly messages with suggestions
 */
export function createFriendlyMessage(messageKey, ...args) {
  const messageFunction = USER_FRIENDLY_MESSAGES[messageKey];
  if (typeof messageFunction === 'function') {
    return messageFunction(...args);
  }
  return `Unknown error: ${messageKey}`;
}
