/**
 * Template Action Builder
 * Provides a fluent API for building PlopJS actions
 * Eliminates duplication in manual action array building
 */

import type { GeneratorAction, PromptAnswers } from '../types';
import { PathResolver } from './PathResolver';

/**
 * Fluent builder for creating PlopJS actions
 * Reduces boilerplate and ensures consistent action patterns
 */
export class ActionBuilder {
  private readonly actions: GeneratorAction[] = [];
  private readonly basePath: string;
  private readonly templatePath: string;
  private readonly name: string;
  private readonly generatorType: string;
  private data?: PromptAnswers;

  constructor(
    name: string,
    generatorType: string,
    private readonly pathResolver: PathResolver = new PathResolver(),
  ) {
    this.name = name;
    this.generatorType = generatorType;
    this.basePath = this.resolveBasePath();
    this.templatePath = this.pathResolver.getRelativeTemplatePath(generatorType);
  }

  /**
   * Create a new ActionBuilder for a specific generator type
   */
  static forGenerator(type: string, name: string): ActionBuilder {
    return new ActionBuilder(name, type);
  }

  /**
   * Set additional data to pass to templates
   */
  withData(data: PromptAnswers): this {
    this.data = data;
    return this;
  }

  /**
   * Add the main component/composable file
   */
  addMainFile(
    options: {
      template?: string;
      extension?: string;
      fileName?: string;
    } = {},
  ): this {
    const {
      template = `${this.generatorType}.${this.getDefaultExtension()}.hbs`,
      fileName = this.getMainFileName(options.extension),
    } = options;

    this.actions.push({
      type: 'add',
      path: `${this.basePath}/${fileName}`,
      templateFile: `${this.templatePath}/${template}`,
      data: this.data,
    });

    return this;
  }

  /**
   * Add types.ts file
   */
  addTypes(template?: string): this {
    const templateFile = template || `types.ts.hbs`;

    this.actions.push({
      type: 'add',
      path: `${this.basePath}/types.ts`,
      templateFile: `${this.templatePath}/${templateFile}`,
      data: this.data,
    });

    return this;
  }

  /**
   * Add test file
   */
  addTests(
    options: {
      template?: string;
      fileName?: string;
    } = {},
  ): this {
    const { template = `${this.generatorType}.spec.ts.hbs`, fileName = this.getTestFileName() } = options;

    this.actions.push({
      type: 'add',
      path: `${this.basePath}/__tests__/${fileName}`,
      templateFile: `${this.templatePath}/${template}`,
      data: this.data,
    });

    return this;
  }

  /**
   * Add index.ts file
   */
  addIndex(template?: string): this {
    const templateFile = template || 'index.ts.hbs';

    this.actions.push({
      type: 'add',
      path: `${this.basePath}/index.ts`,
      templateFile: `${this.templatePath}/${templateFile}`,
      data: this.data,
    });

    return this;
  }

  /**
   * Add a custom file with full control
   */
  addCustomFile(fileName: string, templateFile: string, customData?: PromptAnswers): this {
    this.actions.push({
      type: 'add',
      path: `${this.basePath}/${fileName}`,
      templateFile: `${this.templatePath}/${templateFile}`,
      data: customData || this.data,
    });

    return this;
  }

  /**
   * Add a file to a custom path (outside the base path)
   */
  addFileToPath(fullPath: string, templateFile: string, customData?: PromptAnswers): this {
    this.actions.push({
      type: 'add',
      path: fullPath,
      templateFile: `${this.templatePath}/${templateFile}`,
      data: customData || this.data,
    });

    return this;
  }

  /**
   * Build and return the final actions array
   */
  build(): GeneratorAction[] {
    return [...this.actions];
  }

  /**
   * Resolve base path using PathResolver
   */
  private resolveBasePath(): string {
    const result = this.pathResolver.resolve(this.generatorType, this.name);
    return result.basePath;
  } /**
   * Get default file extension based on generator type
   */
  private getDefaultExtension(): string {
    switch (this.generatorType) {
      case 'component':
      case 'ui-component':
      case 'settings':
        return 'vue';
      case 'composable':
        return 'ts';
      default:
        return 'ts';
    }
  }

  /**
   * Get main file name with proper formatting
   */
  private getMainFileName(extension?: string): string {
    const ext = extension || this.getDefaultExtension();

    switch (this.generatorType) {
      case 'component':
      case 'ui-component':
        return `{{pascalCase name}}.${ext}`;
      case 'composable':
        return `{{name}}.${ext}`;
      default:
        return `{{name}}.${ext}`;
    }
  }

  /**
   * Get test file name with proper formatting
   */
  private getTestFileName(): string {
    switch (this.generatorType) {
      case 'component':
      case 'ui-component':
        return '{{pascalCase name}}.spec.ts';
      case 'composable':
        return '{{name}}.spec.ts';
      default:
        return '{{name}}.spec.ts';
    }
  }
}

/**
 * Convenience functions for common patterns
 */
export class ActionBuilderPresets {
  /**
   * Standard Vue component with types and tests
   */
  static vueComponent(name: string, data?: PromptAnswers): GeneratorAction[] {
    return ActionBuilder.forGenerator('component', name)
      .withData(data || { name })
      .addMainFile()
      .addTypes()
      .addTests()
      .build();
  }

  /**
   * UI component with types and tests
   */
  static uiComponent(name: string, data?: PromptAnswers): GeneratorAction[] {
    return ActionBuilder.forGenerator('ui-component', name)
      .withData(data || { name })
      .addMainFile()
      .addTypes()
      .addTests()
      .build();
  }

  /**
   * Composable with types, index, and tests
   */
  static composable(name: string, data?: PromptAnswers): GeneratorAction[] {
    return ActionBuilder.forGenerator('composable', name)
      .withData(data || { name })
      .addMainFile()
      .addTypes()
      .addIndex()
      .addTests()
      .build();
  }

  /**
   * Settings component with types and tests
   */
  static settingsComponent(name: string, data?: PromptAnswers): GeneratorAction[] {
    return ActionBuilder.forGenerator('settings', name)
      .withData(data || { name })
      .addMainFile()
      .addTypes()
      .addTests()
      .build();
  }
}
