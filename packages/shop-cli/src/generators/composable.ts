/**
 * Composable generator configuration
 * Creates Vue composables with API integration, state management, and dual fetch methods
 */

import { NodePlopAPI } from 'plop';
import { BaseGenerator } from '../core/BaseGenerator';
import type { GeneratorAction, PromptAnswers, GeneratorPrompt } from '../types';
import { composablePrompts } from './composable-prompts.js';

/**
 * Composable Generator using BaseGenerator pattern
 */
class ComposableGenerator extends BaseGenerator {
  readonly name = 'composable';
  readonly description = 'Generate a new Vue composable with API integration';

  getPrompts(): GeneratorPrompt[] {
    return composablePrompts as GeneratorPrompt[];
  }

  createActions(_data: PromptAnswers): GeneratorAction[] {
    return [
      {
        type: 'add',
        path: '../../apps/web/composables/{{name}}/{{name}}.ts',
        templateFile: 'templates/composable/composable.ts.hbs',
      },
      {
        type: 'add',
        path: '../../apps/web/composables/{{name}}/types.ts',
        templateFile: 'templates/composable/types.ts.hbs',
      },
      {
        type: 'add',
        path: '../../apps/web/composables/{{name}}/index.ts',
        templateFile: 'templates/composable/index.ts.hbs',
      },
      {
        type: 'add',
        path: '../../apps/web/composables/{{name}}/__tests__/{{name}}.spec.ts',
        templateFile: 'templates/composable/composable.spec.ts.hbs',
      },
    ];
  }
}

export default function composableGenerator(plop: NodePlopAPI): void {
  const generator = new ComposableGenerator();
  generator.register(plop);
}
