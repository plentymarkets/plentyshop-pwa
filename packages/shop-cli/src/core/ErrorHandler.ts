import type { ActionType } from 'plop';
import type { PromptAnswers } from '../types';
import { ErrorUtils } from './ErrorUtils';

/**
 * Error types for different failure scenarios
 */
export enum ErrorType {
  VALIDATION = 'validation',
  GENERATION = 'generation',
  FILESYSTEM = 'filesystem',
  TEMPLATE = 'template',
  PLUGIN = 'plugin',
  UNKNOWN = 'unknown'
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
export type ErrorResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: ErrorInfo;
};

/**
 * Default error handling configuration
 */
export const DEFAULT_ERROR_CONFIG: ErrorHandlingConfig = {
  failFast: false,
  verbose: true,
  showSuggestions: true,
};

/**
 * Centralized error handling wrapper for generators
 * Provides consistent error boundaries and user-friendly error reporting
 */
export class ErrorHandler {
  private readonly config: ErrorHandlingConfig;

  constructor(config: Partial<ErrorHandlingConfig> = {}) {
    this.config = { ...DEFAULT_ERROR_CONFIG, ...config };
  }

  /**
   * Wrap a generator action execution with error handling
   */
  wrapGeneratorExecution(
    generatorName: string,
    operation: () => ActionType[],
    data?: PromptAnswers
  ): ErrorResult<ActionType[]> {
    try {
      const result = operation();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return this.handleGeneratorError(error, generatorName, data);
    }
  }

  /**
   * Wrap validation operations with error handling
   */
  wrapValidation<T>(
    operation: () => T,
    context: string = 'Validation'
  ): ErrorResult<T> {
    return this.wrapOperation(operation, {
      type: ErrorType.VALIDATION,
      context,
      suggestions: [
        'Check input format and requirements',
        'Verify naming conventions',
        'Ensure required fields are provided'
      ]
    });
  }

  /**
   * Wrap file system operations with error handling
   */
  wrapFileSystemOperation<T>(
    operation: () => T,
    context: string = 'File operation'
  ): ErrorResult<T> {
    return this.wrapOperation(operation, {
      type: ErrorType.FILESYSTEM,
      context,
      suggestions: [
        'Check file and directory permissions',
        'Verify paths exist and are accessible',
        'Ensure sufficient disk space'
      ]
    });
  }

  /**
   * Wrap template processing with error handling
   */
  wrapTemplateProcessing<T>(
    operation: () => T,
    templateName: string
  ): ErrorResult<T> {
    return this.wrapOperation(operation, {
      type: ErrorType.TEMPLATE,
      context: `Template: ${templateName}`,
      suggestions: [
        'Check template syntax and helpers',
        'Verify all required data is provided',
        'Ensure template file exists'
      ]
    });
  }

  /**
   * Wrap plugin operations with error handling
   */
  wrapPluginOperation<T>(
    operation: () => T,
    pluginName: string
  ): ErrorResult<T> {
    return this.wrapOperation(operation, {
      type: ErrorType.PLUGIN,
      context: `Plugin: ${pluginName}`,
      suggestions: [
        'Check plugin configuration',
        'Verify plugin dependencies',
        'Ensure plugin is properly initialized'
      ]
    });
  }

  /**
   * Create an error info object from an unknown error
   */
  createErrorInfo(
    error: unknown,
    overrides: Partial<ErrorInfo> = {}
  ): ErrorInfo {
    return ErrorUtils.createErrorInfo(error, overrides);
  }

  /**
   * Report an error to the user
   */
  reportError(errorInfo: ErrorInfo): void {
    if (this.config.reporter) {
      this.config.reporter(errorInfo);
      return;
    }

    ErrorUtils.reportToConsole(errorInfo, this.config.verbose, this.config.showSuggestions);
  }

  /**
   * Generic operation wrapper
   */
  private wrapOperation<T>(
    operation: () => T,
    errorConfig: Partial<ErrorInfo>
  ): ErrorResult<T> {
    try {
      const result = operation();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      const errorInfo = this.createErrorInfo(error, errorConfig);
      this.reportError(errorInfo);

      if (this.config.failFast) {
        throw new Error(errorInfo.message);
      }

      return {
        success: false,
        error: errorInfo
      };
    }
  }

  /**
   * Handle generator-specific errors
   */
  private handleGeneratorError(
    error: unknown,
    generatorName: string,
    data?: PromptAnswers
  ): ErrorResult<ActionType[]> {
    const errorInfo = this.createErrorInfo(error, {
      type: ErrorType.GENERATION,
      context: `Generator: ${generatorName}`,
      suggestions: [
        'Check if all required data is provided',
        'Verify template files exist',
        'Ensure target directories are writable'
      ]
    });

    // Add context data if available
    if (data && this.config.verbose) {
      errorInfo.context = `${errorInfo.context} | Data: ${JSON.stringify(data, null, 2)}`;
    }

    this.reportError(errorInfo);

    if (this.config.failFast) {
      throw new Error(errorInfo.message);
    }

    return {
      success: false,
      error: errorInfo
    };
  }
}
