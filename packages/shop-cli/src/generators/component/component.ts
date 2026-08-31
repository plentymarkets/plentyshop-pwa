/**
 * Component Generator for PlentyONE Shop
 * Generates Vue 3 components with TypeScript, tests, and proper structure
 */

import type { NodePlopAPI } from 'plop';
import { BaseGenerator, ActionBuilder } from '../../core';
import type { GeneratorAction, PromptAnswers, GeneratorPrompt, PathResolver } from '../../core';
import { componentPrompts } from './component-prompts';
import { validateComponentName } from '../../utils/validation';

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
  } {
    return {
      skipTests: Boolean(data.skipTests ?? process.env.PLENTYSHOP_SKIP_TESTS === 'true'),
      skipTypes: Boolean(data.skipTypes ?? process.env.PLENTYSHOP_SKIP_TYPES === 'true'),
      withForm: Boolean(data.withForm ?? process.env.PLENTYSHOP_WITH_FORM === 'true'),
      withView: Boolean(data.withView ?? process.env.PLENTYSHOP_WITH_VIEW === 'true'),
      withToolbar: Boolean(data.withToolbar ?? process.env.PLENTYSHOP_WITH_TOOLBAR === 'true'),
    };
  }

  createActions(data: PromptAnswers): GeneratorAction[] {
    const options = this.resolveOptions(data);
    const builder = ActionBuilder.forGenerator('component', data.name, this.pathResolver, { isBlock: options.withForm })
      .withData(data)
      .addMainFile();

    if (!options.skipTypes) builder.addTypes();
    if (!options.skipTests) builder.addTests();
    if (options.withForm) builder.addCustomFile(`${data.name}Form.vue`, 'component-form.vue.hbs');
    if (options.withView) builder.addCustomFile('View.vue', 'component-view.vue.hbs');
    if (options.withToolbar) builder.addCustomFile(`${data.name}ToolbarTrigger.vue`, 'component-toolbar.vue.hbs');

    return builder.build();
  }

  validateInput(data: PromptAnswers): string | true {
    return validateComponentName(data.name);
  }
}

export default function componentGenerator(plop: NodePlopAPI, pathResolver: PathResolver): void {
  const generator = new ComponentGenerator(pathResolver);
  generator.register(plop);
}
