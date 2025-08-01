/**
 * Type definitions for PlopJS generators
 * Used by BaseGenerator and all concrete generator implementations
 */

export interface GeneratorAction {
  type: string;
  path: string;
  templateFile?: string;
  data?: Record<string, unknown>;
  skipIfExists?: boolean;
  force?: boolean;
}

export interface PromptAnswers {
  name: string;
  [key: string]: unknown;
}

export interface GeneratorPrompt {
  type: string;
  name: string;
  message: string;
  validate?: (input: string) => string | true;
  choices?: string[] | { name: string; value: string }[];
  default?: string | boolean;
}
