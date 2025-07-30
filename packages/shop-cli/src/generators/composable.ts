/**
 * Composable generator configuration
 * Creates Vue composables with API integration, state management, and dual fetch methods
 */

import { NodePlopAPI } from 'plop';
import { composablePrompts } from './composable-prompts.js';

export default function composableGenerator(plop: NodePlopAPI): void {
  plop.setGenerator('composable', {
    description: 'Generate a new Vue composable with API integration',
    prompts: composablePrompts,
    actions: [
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
    ],
  });
}
