/**
 * Type definitions for error handling utilities
 */

/**
 * Error types for different failure scenarios
 */
export enum ErrorType {
  VALIDATION = 'validation',
  GENERATION = 'generation',
  FILESYSTEM = 'filesystem',
  TEMPLATE = 'template',
  PLUGIN = 'plugin',
  UNKNOWN = 'unknown',
}

/**
 * Structured error information
 */
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  context?: string;
  originalError?: Error;
  suggestions?: string[];
}

/**
 * Configuration for error handling behavior
 */
export interface ErrorHandlingConfig {
  /** Whether to throw errors or return error results */
  failFast: boolean;
  /** Whether to show verbose error information */
  verbose: boolean;
  /** Whether to show suggested solutions */
  showSuggestions: boolean;
  /** Custom error reporter function */
  reporter?: (error: ErrorInfo) => void;
}

/**
 * Result type for operations that can fail
 */
export type ErrorResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ErrorInfo;
    };

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
