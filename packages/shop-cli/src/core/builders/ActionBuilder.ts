/**
 * Template Action Builder
 * Provides a fluent API for building PlopJS actions
 * Eliminates duplication in manual action array building
 */

import { PathResolver, type GeneratorAction, type PromptAnswers } from '../index';
import type { PathOptions } from '../path/types';
import { dryRunManager } from '../../utils/dry-run';

/** `'add'` in a real run; a dry-run-only action type when `--dry-run` is active, so real writes are never affected. */
const ADD_ACTION_TYPE = 'add';
const DRY_RUN_ADD_ACTION_TYPE = 'dry-run-add';

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
    private readonly pathResolver: PathResolver,
    private readonly pathOptions?: PathOptions,
  ) {
    this.name = name;
    this.generatorType = generatorType;
    this.basePath = this.resolveBasePath();
    this.templatePath = this.pathResolver.getRelativeTemplatePath(generatorType);
  }

  /**
   * Create a new ActionBuilder for a specific generator type
   */
  static forGenerator(type: string, name: string, pathResolver: PathResolver, pathOptions?: PathOptions): ActionBuilder {
    return new ActionBuilder(name, type, pathResolver, pathOptions);
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
      type: this.actionType(),
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
      type: this.actionType(),
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
      type: this.actionType(),
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
      type: this.actionType(),
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
      type: this.actionType(),
      path: `${this.basePath}/${fileName}`,
      templateFile: `${this.templatePath}/${templateFile}`,
      data: customData || this.data,
    });

    return this;
  }

  /**
   * The component's resolved base directory (relative to `packages/shop-cli`), for callers that
   * need to place files in a subdirectory (e.g. `forms/`, `partials/`) rather than at its root.
   */
  get resolvedBasePath(): string {
    return this.basePath;
  }

  /**
   * Add a file to a custom path (outside the base path)
   */
  addFileToPath(fullPath: string, templateFile: string, customData?: PromptAnswers): this {
    this.actions.push({
      type: this.actionType(),
      path: fullPath,
      templateFile: `${this.templatePath}/${templateFile}`,
      data: customData || this.data,
    });

    return this;
  }

  /**
   * Build and return the final actions array.
   * In dry-run mode, appends a final action that prints the planned-operations summary once all
   * preceding dry-run-add actions have logged themselves.
   */
  build(): GeneratorAction[] {
    if (dryRunManager.isDryRun) {
      return [...this.actions, { type: 'dry-run-summary', path: '' }];
    }
    return [...this.actions];
  }

  private actionType(): string {
    return dryRunManager.isDryRun ? DRY_RUN_ADD_ACTION_TYPE : ADD_ACTION_TYPE;
  }

  /**
   * Resolve base path using PathResolver
   */
  private resolveBasePath(): string {
    const result = this.pathResolver.resolve(this.generatorType, this.name, this.pathOptions);
    return result.basePath;
  } /**
   * Get default file extension based on generator type
   */
  private getDefaultExtension(): string {
    switch (this.generatorType) {
      case 'component':
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
 * Note: These presets require a PathResolver to be passed in
 */
export class ActionBuilderPresets {
  /**
   * Standard Vue component with types and tests
   */
  static vueComponent(name: string, pathResolver: PathResolver, data?: PromptAnswers): GeneratorAction[] {
    return ActionBuilder.forGenerator('component', name, pathResolver)
      .withData(data || { name })
      .addMainFile()
      .addTypes()
      .addTests()
      .build();
  }

  /**
   * Composable with types, index, and tests
   */
  static composable(name: string, pathResolver: PathResolver, data?: PromptAnswers): GeneratorAction[] {
    return ActionBuilder.forGenerator('composable', name, pathResolver)
      .withData(data || { name })
      .addMainFile()
      .addTypes()
      .addIndex()
      .addTests()
      .build();
  }
}
