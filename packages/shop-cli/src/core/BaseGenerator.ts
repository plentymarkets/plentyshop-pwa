/**
 * Base Generator Factory Pattern
 * Provides a consistent structure for all PlopJS generators
 * Eliminates duplication and enforces common patterns
 */

import type { NodePlopAPI } from 'plop';
import type { GeneratorAction, GeneratorPrompt, PromptAnswers } from '../types';

/**
 * Abstract base class for all generators
 * Provides consistent structure and eliminates duplication
 */
export abstract class BaseGenerator {
  abstract readonly name: string;
  abstract readonly description: string;

  /**
   * Get prompts for this generator
   */
  abstract getPrompts(): GeneratorPrompt[];

  /**
   * Create actions based on user input
   */
  abstract createActions(data: PromptAnswers): GeneratorAction[];

  /**
   * Register this generator with PlopJS
   */
  register(plop: NodePlopAPI): void {
    plop.setGenerator(this.name, {
      description: this.description,
      prompts: this.getPrompts(),
      actions: (data: unknown) => {
        const ensuredData = this.ensureData(data as PromptAnswers);
        return this.createActions(ensuredData);
      },
    });
  }

  /**
   * Optional: Validate user input before generating
   */
  protected validateInput(data: PromptAnswers): string | true {
    if (!data.name || typeof data.name !== 'string') {
      return 'Name is required and must be a string';
    }
    return true;
  }

  /**
   * Protected helper to ensure data is provided
   */
  protected ensureData(data: PromptAnswers | undefined): PromptAnswers {
    if (!data) {
      throw new Error(`No data provided for ${this.name} generation`);
    }

    const validation = this.validateInput(data);
    if (validation !== true) {
      throw new Error(validation);
    }

    return data;
  }
}
