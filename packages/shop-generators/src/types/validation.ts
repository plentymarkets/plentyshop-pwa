/**
 * Type definitions for validation utilities
 */

export interface ValidationReturn {
  valid: boolean;
  message?: string;
}

/**
 * Input answers from generator prompts
 */
export interface GeneratorInputAnswers {
  name?: unknown;
  description?: unknown;
  [key: string]: unknown;
}
