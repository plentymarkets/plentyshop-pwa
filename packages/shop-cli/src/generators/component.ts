/**
 * Component Generator for PlentyONE Shop
 * Generates Vue 3 components with TypeScript, tests, and proper structure
 */

import type { NodePlopAPI } from 'plop';
import { BaseGenerator } from '../core/BaseGenerator';
import type { GeneratorAction, PromptAnswers, GeneratorPrompt } from '../types';
import { getDestinationPath } from '../utils/template-utils';
import { componentPrompts } from './component-prompts';

/**
 * Component Generator using BaseGenerator pattern
 */
class ComponentGenerator extends BaseGenerator {
  readonly name = 'component';
  readonly description = 'Generate a Vue component with TypeScript support';

  getPrompts(): GeneratorPrompt[] {
    return componentPrompts as GeneratorPrompt[];
  }

  createActions(data: PromptAnswers): GeneratorAction[] {
    const componentPath = getDestinationPath('component', data.name);

    return [
      {
        type: 'add',
        path: `${componentPath}/{{pascalCase name}}.vue`,
        templateFile: 'templates/component/component.vue.hbs',
        data,
      },
      {
        type: 'add',
        path: `${componentPath}/types.ts`,
        templateFile: 'templates/component/types.ts.hbs',
      },
      {
        type: 'add',
        path: `${componentPath}/__tests__/{{pascalCase name}}.spec.ts`,
        templateFile: 'templates/component/component.spec.ts.hbs',
        data,
      },
    ];
  }
}

export default function componentGenerator(plop: NodePlopAPI): void {
  const generator = new ComponentGenerator();
  generator.register(plop);
}
