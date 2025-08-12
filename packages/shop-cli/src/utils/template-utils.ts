import { join } from 'node:path';
import type {
  DestinationOptions,
  ComponentOptions,
  TemplateFile,
  TemplateAction,
  GeneratorConfigOptions,
} from '../types/template-utils';

/**
 * Template utilities for PlentyONE Shop generators
 * Provides path generation and template resolution functions
 */

/**
 * Gets the template directory for a specific generator type
 */
export function getTemplatePath(generatorType: string): string {
  return join(process.cwd(), 'templates', generatorType);
}

/**
 * Path mappings for different generator types
 */
const GENERATOR_PATHS = {
  component: (webAppPath: string, name: string) => join(webAppPath, 'components', name),
  composable: (webAppPath: string, name: string) => join(webAppPath, 'composables', name),
  test: (webAppPath: string) => join(webAppPath, '__tests__'),
} as const;

/**
 * Gets the destination path for a specific generator type
 * @todo Implement special case for settings which need a category
 */
export function getDestinationPath(generatorType: string, name: string, options: DestinationOptions = {}): string {
  const { webAppPath = '../../apps/web' } = options;

  const pathGenerator = GENERATOR_PATHS[generatorType as keyof typeof GENERATOR_PATHS];
  if (pathGenerator) {
    return pathGenerator(webAppPath, name);
  }

  throw new Error(`Unknown generator type: ${generatorType}`);
}

/**
 * Creates template actions for PlopJS
 */
export function createTemplateActions(
  generatorType: string,
  templateFiles: TemplateFile[],
  options: DestinationOptions = {},
): TemplateAction[] {
  const actions: TemplateAction[] = [];
  const templatePath = getTemplatePath(generatorType);
  const destinationBase = getDestinationPath(generatorType, '{{pascalCase name}}', options);

  for (const templateFile of templateFiles) {
    const action: TemplateAction = {
      type: 'add',
      path: join(destinationBase, templateFile.destination || templateFile.name),
      templateFile: join(templatePath, templateFile.template || templateFile.name),
      skipIfExists: templateFile.skipIfExists !== false,
      force: false,
    };

    if (templateFile.condition) {
      action.skip = templateFile.condition;
    }

    actions.push(action);
  }

  return actions;
}

/**
 * Creates template file definitions for common patterns
 */
export function createComponentTemplateFiles(options: ComponentOptions = {}) {
  const { includeTypes = true, includeIndex = true, includeTests = true } = options;

  const files = [
    {
      name: '{{pascalCase name}}.vue',
      template: 'component.vue.hbs',
    },
  ];

  if (includeTypes) {
    files.push({
      name: 'types.ts',
      template: 'types.ts.hbs',
    });
  }

  if (includeIndex) {
    files.push({
      name: 'index.ts',
      template: 'index.ts.hbs',
    });
  }

  if (includeTests) {
    files.push({
      name: '__tests__/{{pascalCase name}}.spec.ts',
      template: 'component.spec.ts.hbs',
    });
  }

  return files;
}

/**
 * Creates template file definitions for composables
 */
export function createComposableTemplateFiles(options: ComponentOptions = {}): TemplateFile[] {
  const { includeTypes = true, includeIndex = true, includeTests = true } = options;

  const files = [
    {
      name: '{{camelCase name}}.ts',
      template: 'composable.ts.hbs',
    },
  ];

  if (includeTypes) {
    files.push({
      name: 'types.ts',
      template: 'types.ts.hbs',
    });
  }

  if (includeIndex) {
    files.push({
      name: 'index.ts',
      template: 'index.ts.hbs',
    });
  }

  if (includeTests) {
    files.push({
      name: '__tests__/{{camelCase name}}.spec.ts',
      template: 'composable.spec.ts.hbs',
    });
  }

  return files;
}

/**
 * Resolves template file paths relative to the templates directory
 */
export function resolveTemplatePath(generatorType: string, fileName: string): string {
  return join(getTemplatePath(generatorType), fileName);
}

/**
 * Validates that required template files exist
 * @todo Implement validation logic
 * For now, validation happens during actual generation
 */
export function validateTemplateFiles(_generatorType: string, _templateFiles: TemplateFile[]): string[] {
  const errors: string[] = [];

  return errors;
}

/**
 * Creates a complete generator configuration
 */
export function createGeneratorConfig(type: string, options: GeneratorConfigOptions = {}) {
  const { description = `Generate a new ${type}`, prompts = [], templateFiles = [], actions = [] } = options;

  return {
    description,
    prompts,
    actions: [...actions, ...createTemplateActions(type, templateFiles, options)],
  };
}
