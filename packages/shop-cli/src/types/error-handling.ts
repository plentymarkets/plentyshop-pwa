/**
 * Type definitions for error handling utilities
 */

export interface ErrorDetails {
  [key: string]: unknown;
}

export type UserFriendlyMessageKey =
  | 'componentExists'
  | 'invalidComponentName'
  | 'invalidComposableName'
  | 'projectNotFound'
  | 'noWritePermission';

/**
 * Custom error class for generator-specific errors
 */
export class GeneratorError extends Error {
  constructor(
    public readonly code: UserFriendlyMessageKey,
    message: string,
    public readonly details?: ErrorDetails,
  ) {
    super(message);
    this.name = 'GeneratorError';
  }
}
