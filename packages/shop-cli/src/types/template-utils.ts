/**
 * Type definitions for template utilities
 */

import type { PromptConfig } from './confirmation';

export interface ActionConfig {
  type: string;
  path: string;
  templateFile?: string;
  data?: Record<string, unknown>;
  skipIfExists?: boolean;
  force?: boolean;
}

export interface DestinationOptions {
  webAppPath?: string;
  category?: string;
}

export interface ComponentOptions {
  includeTypes?: boolean;
  includeIndex?: boolean;
  includeTests?: boolean;
}

export interface TemplateFile {
  name: string;
  template?: string;
  destination?: string;
  condition?: string;
  skipIfExists?: boolean;
}

export interface TemplateAction {
  type: string;
  path: string;
  templateFile: string;
  skipIfExists: boolean;
  force: boolean;
  skip?: string;
}

export interface GeneratorConfigOptions extends DestinationOptions {
  description?: string;
  prompts?: PromptConfig[];
  templateFiles?: TemplateFile[];
  actions?: ActionConfig[];
}
