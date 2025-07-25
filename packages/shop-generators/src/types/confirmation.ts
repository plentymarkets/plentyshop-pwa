/**
 * Type definitions for confirmation utilities
 */

export interface GeneratorAnswers {
  name?: string;
  description?: string;
  type?: string;
  force?: boolean;
  dryRun?: boolean;
  withTests?: boolean;
  overwrite?: boolean;
  generateMultiple?: boolean;
  destructiveConfirmation?: string;
  [key: string]: any;
}

export interface PromptConfig {
  type: string;
  name: string;
  message: string | ((answers: GeneratorAnswers) => string);
  default?: boolean;
  when?: (answers: GeneratorAnswers) => boolean;
  validate?: (input: any) => boolean | string;
}
