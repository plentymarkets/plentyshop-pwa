/**
 * Type definitions for template utilities
 */

export interface DestinationOptions {
  webAppPath?: string;
  category?: string;
}

export interface ComponentOptions {
  includeTypes?: boolean;
  includeIndex?: boolean;
  includeTests?: boolean;
}

export interface PageOptions {
  isDynamic?: boolean;
  includeLayout?: boolean;
  includeMiddleware?: boolean;
}

export interface SettingsOptions {
  includeTypes?: boolean;
  includeToolbarTrigger?: boolean;
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
  prompts?: any[];
  templateFiles?: TemplateFile[];
  actions?: any[];
}
