import type { ErrorInfo, ErrorType } from './ErrorHandler';

/**
 * Utility functions for error handling
 */
export class ErrorUtils {
  /**
   * Create an error info object from an unknown error
   */
  static createErrorInfo(error: unknown, overrides: Partial<ErrorInfo> = {}): ErrorInfo {
    const baseInfo: ErrorInfo = {
      type: 'unknown' as ErrorType,
      message: 'An unknown error occurred',
      ...overrides,
    };

    if (error instanceof Error) {
      baseInfo.message = error.message;
      baseInfo.originalError = error;
    } else if (typeof error === 'string') {
      baseInfo.message = error;
    } else {
      baseInfo.message = String(error);
    }

    return baseInfo;
  }

  /**
   * Default console error reporter
   */
  static reportToConsole(errorInfo: ErrorInfo, verbose = true, showSuggestions = true): void {
    console.error(`❌ [${errorInfo.type.toUpperCase()}] ${errorInfo.message}`);

    if (verbose && errorInfo.context) {
      console.error(`   Context: ${errorInfo.context}`);
    }

    if (verbose && errorInfo.originalError) {
      console.error(`   Original Error:`, errorInfo.originalError);
    }

    if (showSuggestions && errorInfo.suggestions?.length) {
      console.error(`   Suggestions:`);
      errorInfo.suggestions.forEach((suggestion) => {
        console.error(`   • ${suggestion}`);
      });
    }
  }
}
