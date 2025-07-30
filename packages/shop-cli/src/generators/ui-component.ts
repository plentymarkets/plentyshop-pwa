/**
 * UI Component Generator for PlentyONE Shop
 * Generates UI components following Vue.js style guide patterns
 * Enforces Base and Single-Instance component patterns
 */

import type { NodePlopAPI } from 'plop';
import { BaseGenerator } from '../core/BaseGenerator';
import type { GeneratorAction, PromptAnswers, GeneratorPrompt } from '../types';
import { getDestinationPath } from '../utils/template-utils';
import { uiComponentPrompts } from './ui-component-prompts';

/**
 * UI Component Generator using BaseGenerator pattern
 */
class UIComponentGenerator extends BaseGenerator {
  readonly name = 'ui-component';
  readonly description = 'Generate a UI component following Vue.js style guide patterns (Base or Single-Instance)';

  getPrompts(): GeneratorPrompt[] {
    return uiComponentPrompts as GeneratorPrompt[];
  }

  createActions(data: PromptAnswers): GeneratorAction[] {
    const componentPath = getDestinationPath('ui', data.name);

    return [
      {
        type: 'add',
        path: `${componentPath}/{{pascalCase name}}.vue`,
        templateFile: 'templates/ui-component/ui-component.vue.hbs',
        data,
      },
      {
        type: 'add',
        path: `${componentPath}/types.ts`,
        templateFile: 'templates/ui-component/types.ts.hbs',
        data,
      },
      {
        type: 'add',
        path: `${componentPath}/__tests__/{{pascalCase name}}.spec.ts`,
        templateFile: 'templates/ui-component/ui-component.spec.ts.hbs',
        data,
      },
    ];
  }
}

export default function uiComponentGenerator(plop: NodePlopAPI): void {
  const generator = new UIComponentGenerator();
  generator.register(plop);
}
