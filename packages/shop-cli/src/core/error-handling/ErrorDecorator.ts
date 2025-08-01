import type { ActionType } from 'plop';
import { ErrorHandler, defaultErrorHandler } from './index';

/**
 * Simple error wrapper function for generator methods
 * Alternative to decorators for easier type safety
 */
export function wrapGeneratorMethod(
  method: (...args: unknown[]) => ActionType[],
  context: string,
  errorHandler: ErrorHandler = defaultErrorHandler,
): (...args: unknown[]) => ActionType[] {
  return (...args: unknown[]): ActionType[] => {
    const operation = () => method(...args);
    const result = errorHandler.wrapGeneratorExecution(context, operation);

    if (!result.success) {
      return []; // Return empty actions on error
    }

    return result.data;
  };
}
