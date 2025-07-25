import { join } from 'node:path';
import type {
  DestinationOptions,
  ComponentOptions,
  PageOptions,
  SettingsOptions,
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
 * Gets the destination path for a specific generator type
 */
export function getDestinationPath(generatorType: string, name: string, options: DestinationOptions = {}): string {
  const { webAppPath = '../../apps/web' } = options;

  switch (generatorType) {
    case 'component':
      return join(webAppPath, 'components', name);

    case 'ui':
      return join(webAppPath, 'components/ui', name);

    case 'composable':
      return join(webAppPath, 'composables', name);

    case 'page':
      return join(webAppPath, 'pages');

    case 'settings': {
      const { category = 'general' } = options;
      return join(webAppPath, 'components/settings', category, name);
    }

    case 'block':
      return join(webAppPath, 'components/blocks', name);

    case 'test':
      return join(webAppPath, '__tests__');

    default:
      throw new Error(`Unknown generator type: ${generatorType}`);
  }
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

    // Add conditional logic if specified
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
 * Creates template file definitions for pages
 */
export function createPageTemplateFiles(options: PageOptions = {}): TemplateFile[] {
  const { isDynamic = false, includeLayout = false, includeMiddleware = false } = options;

  const fileName = isDynamic ? '[slug].vue' : '{{kebabCase name}}.vue';

  const files = [
    {
      name: fileName,
      template: 'page.vue.hbs',
    },
  ];

  if (includeLayout) {
    files.push({
      name: 'layouts/{{kebabCase name}}.vue',
      template: 'layout.vue.hbs',
    });
  }

  if (includeMiddleware) {
    files.push({
      name: 'middleware/{{kebabCase name}}.ts',
      template: 'middleware.ts.hbs',
    });
  }

  return files;
}

/**
 * Creates template file definitions for settings components
 */
export function createSettingsTemplateFiles(options: SettingsOptions = {}): TemplateFile[] {
  const { includeTypes = true, includeToolbarTrigger = false, includeTests = true } = options;

  const files = [
    {
      name: '{{pascalCase name}}.vue',
      template: 'settings.vue.hbs',
    },
  ];

  if (includeTypes) {
    files.push({
      name: 'types.ts',
      template: 'types.ts.hbs',
    });
  }

  if (includeToolbarTrigger) {
    files.push({
      name: '{{pascalCase name}}ToolbarTrigger.vue',
      template: 'toolbar-trigger.vue.hbs',
    });
  }

  if (includeTests) {
    files.push({
      name: '__tests__/{{pascalCase name}}.spec.ts',
      template: 'settings.spec.ts.hbs',
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
 */
export function validateTemplateFiles(generatorType: string, templateFiles: TemplateFile[]): string[] {
  const errors: string[] = [];
  // Note: In real implementation, we'd validate file existence here
  // For now, validation happens during actual generation

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
