/**
 * Component Generator for PlentyONE Shop
 * Generates Vue 3 components with TypeScript, tests, and proper structure
 */

import type { NodePlopAPI } from 'plop';
import { BaseGenerator, ActionBuilder } from '../../core';
import type { GeneratorAction, PromptAnswers, GeneratorPrompt, PathResolver } from '../../core';
import { componentPrompts } from './component-prompts';
import { validateComponentName } from '../../utils/validation';

const BLOCK_DEFAULT_ACCESS_CONTROL = ['content'];

/**
 * Component Generator using BaseGenerator pattern
 */
class ComponentGenerator extends BaseGenerator {
  readonly name = 'component';
  readonly description = 'Generate a Vue component with TypeScript support';

  getPrompts(): GeneratorPrompt[] {
    return componentPrompts as GeneratorPrompt[];
  }

  private resolveOptions(data: PromptAnswers): {
    skipTests: boolean;
    skipTypes: boolean;
    withForm: boolean;
    withView: boolean;
    withToolbar: boolean;
    complexForm: boolean;
    category: string;
    accessControl: string[];
  } {
    return {
      skipTests: Boolean(data.skipTests ?? process.env.PLENTYSHOP_SKIP_TESTS === 'true'),
      skipTypes: Boolean(data.skipTypes ?? process.env.PLENTYSHOP_SKIP_TYPES === 'true'),
      withForm: Boolean(data.withForm ?? process.env.PLENTYSHOP_WITH_FORM === 'true'),
      withView: Boolean(data.withView ?? process.env.PLENTYSHOP_WITH_VIEW === 'true'),
      withToolbar: Boolean(data.withToolbar ?? process.env.PLENTYSHOP_WITH_TOOLBAR === 'true'),
      complexForm: Boolean(data.complexForm ?? process.env.PLENTYSHOP_COMPLEX_FORM === 'true'),
      category: this.resolveCategory(data),
      accessControl: this.resolveAccessControl(data),
    };
  }

  private resolveCategory(data: PromptAnswers): string {
    if (typeof data.category === 'string' && data.category.trim().length > 0) {
      return data.category;
    }
    return process.env.PLENTYSHOP_CATEGORY ?? '';
  }

  /**
   * Never returns an empty array — an empty `accessControl` makes a block permanently
   * unselectable in the CMS editor with no error anywhere (`pageHasAccessToCategory()`).
   */
  private resolveAccessControl(data: PromptAnswers): string[] {
    if (Array.isArray(data.accessControl) && data.accessControl.length > 0) {
      return data.accessControl as string[];
    }

    const envValue = process.env.PLENTYSHOP_ACCESS_CONTROL;
    if (envValue) {
      const parsed = envValue
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      if (parsed.length > 0) {
        return parsed;
      }
    }

    return BLOCK_DEFAULT_ACCESS_CONTROL;
  }

  createActions(data: PromptAnswers): GeneratorAction[] {
    const options = this.resolveOptions(data);
    const templateData = { ...data, ...options };
    const builder = ActionBuilder.forGenerator('component', data.name, this.pathResolver, { isBlock: options.withForm })
      .withData(templateData)
      .addMainFile();

    if (!options.skipTypes) builder.addTypes();
    if (!options.skipTests) builder.addTests();

    if (options.withForm) {
      builder.addCustomFile('defaults.ts', 'defaults.ts.hbs');
      builder.addCustomFile('icon.svg', 'icon.svg.hbs');

      if (options.complexForm) {
        this.addComplexFormFiles(builder, data.name, options.skipTests);
      } else {
        builder.addCustomFile(`${data.name}Form.vue`, 'component-form.vue.hbs');
      }
    }

    if (options.withView) builder.addCustomFile('View.vue', 'component-view.vue.hbs');
    if (options.withToolbar) builder.addCustomFile(`${data.name}ToolbarTrigger.vue`, 'component-toolbar.vue.hbs');

    return builder.build();
  }

  /**
   * Scaffolds the `--complex-form` shape (orchestrator + one generic `forms/` sub-form + one
   * generic `partials/` fragment), matching the real `UtilityBar` block's structure, instead of a
   * single `Form.vue`.
   */
  private addComplexFormFiles(builder: ActionBuilder, name: string, skipTests: boolean): void {
    const basePath = builder.resolvedBasePath;

    builder.addCustomFile(`${name}Form.vue`, 'component-form-orchestrator.vue.hbs');
    builder.addFileToPath(`${basePath}/forms/${name}SettingsForm.vue`, 'forms/component-subform.vue.hbs');
    builder.addFileToPath(`${basePath}/partials/${name}SectionEditor.vue`, 'partials/component-partial.vue.hbs');

    if (!skipTests) {
      builder.addFileToPath(
        `${basePath}/forms/__tests__/${name}SettingsForm.spec.ts`,
        'forms/component-subform.spec.ts.hbs',
      );
      builder.addFileToPath(
        `${basePath}/partials/__tests__/${name}SectionEditor.spec.ts`,
        'partials/component-partial.spec.ts.hbs',
      );
    }
  }

  validateInput(data: PromptAnswers): string | true {
    return validateComponentName(data.name);
  }
}

export default function componentGenerator(plop: NodePlopAPI, pathResolver: PathResolver): void {
  const generator = new ComponentGenerator(pathResolver);
  generator.register(plop);
}
