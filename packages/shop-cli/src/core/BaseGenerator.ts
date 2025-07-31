/**
 * Base Generator Factory Pattern
 * Provides a consistent structure for all PlopJS generators
 * Eliminates duplication and enforces common patterns
 */

import type { NodePlopAPI } from 'plop';
import type { GeneratorAction, GeneratorPrompt, PromptAnswers } from '../types';
import { defaultErrorHandler } from './error-handling';
import type { ErrorHandler } from './error-handling';

/**
 * Abstract base class for all PlopJS generators
 * Provides common structure, validation, and error handling
 */
export abstract class BaseGenerator {
  /** Unique identifier for the generator */
  abstract readonly name: string;
  
  /** Human-readable description */
  abstract readonly description: string;

  /** Error handler for consistent error management */
  protected errorHandler: ErrorHandler;

  constructor(errorHandler?: ErrorHandler) {
    this.errorHandler = errorHandler || defaultErrorHandler;
  }

  /**
   * Define prompts for user input
   * Must be implemented by subclasses
   */
  abstract getPrompts(): GeneratorPrompt[];

  /**
   * Create actions for file generation
   * Must be implemented by subclasses
   */
  abstract createActions(data: PromptAnswers): GeneratorAction[];

  /**
   * Validate user input
   * Return true if valid, error message if invalid
   */
  abstract validateInput(data: PromptAnswers): string | true;

  /**
   * Register this generator with plop
   */
  register(plop: NodePlopAPI): void {
    plop.setGenerator(this.name, {
      description: this.description,
      prompts: this.getPrompts(),
      actions: (data) => this.generateWithErrorHandling(data as PromptAnswers),
    });
  }

  /**
   * Protected helper to ensure data is provided with error handling
   */
  protected ensureData(data: PromptAnswers | undefined): PromptAnswers | null {
    const result = this.errorHandler.wrapValidation(() => {
      if (!data) {
        throw new Error(`No data provided for ${this.name} generation`);
      }

      const validation = this.validateInput(data);
      if (validation !== true) {
        throw new Error(validation);
      }

      return data;
    }, `${this.name} data validation`);

    return result.success ? result.data : null;
  }

  /**
   * Generate actions with error handling wrapper
   */
  private generateWithErrorHandling(data: PromptAnswers | undefined): GeneratorAction[] {
    const result = this.errorHandler.wrapGeneratorExecution(
      this.name,
      () => {
        const validatedData = this.ensureData(data);
        if (!validatedData) {
          return []; // Return empty array for graceful degradation
        }
        return this.createActions(validatedData);
      }
    );

    return result.success ? (result.data as GeneratorAction[]) : [];
  }
}
