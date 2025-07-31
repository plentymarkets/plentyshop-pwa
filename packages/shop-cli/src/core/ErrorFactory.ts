import { ErrorHandler } from './ErrorHandler';
import type { ErrorHandlingConfig } from './ErrorHandler';

/**
 * Global error handler instance with default configuration
 */
export const defaultErrorHandler = new ErrorHandler();

/**
 * Convenience function to create an error handler with custom config
 */
export function createErrorHandler(config: Partial<ErrorHandlingConfig> = {}): ErrorHandler {
  return new ErrorHandler(config);
}
