/**
 * UI Component Generator for PlentyONE Shop
 * Generates UI components following Vue.js style guide patterns
 * Enforces Base and Single-Instance component patterns
 */

import type { NodePlopAPI } from 'plop';
import { getDestinationPath } from '../utils/template-utils';
import { uiComponentPrompts } from './ui-component-prompts';

function createUIComponentActions(data: Record<string, unknown> | undefined) {
  if (!data) {
    throw new Error('No data provided for UI component generation');
  }

  const componentPath = getDestinationPath('ui', data.name as string);

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

export default function uiComponentGenerator(plop: NodePlopAPI): void {
  plop.setGenerator('ui-component', {
    description: 'Generate a UI component following Vue.js style guide patterns (Base or Single-Instance)',
    prompts: uiComponentPrompts,
    actions: createUIComponentActions,
  });
}
