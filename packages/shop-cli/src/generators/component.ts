/**
 * Component Generator for PlentyONE Shop
 * Generates Vue 3 components with TypeScript, tests, and proper structure
 */

import type { NodePlopAPI } from 'plop';
import { getDestinationPath } from '../utils/template-utils';
import { componentPrompts } from './component-prompts';

/**
 * Create component file generation action
 */
function createComponentFileAction(componentPath: string, data: Record<string, unknown>) {
  return {
    type: 'add',
    path: `${componentPath}/{{pascalCase name}}.vue`,
    templateFile: 'templates/component/component.vue.hbs',
    data,
  };
}

/**
 * Create test file generation action
 */
function createTestFileAction(componentPath: string, data: Record<string, unknown>) {
  return {
    type: 'add',
    path: `${componentPath}/__tests__/{{pascalCase name}}.spec.ts`,
    templateFile: 'templates/component/component.spec.ts.hbs',
    data,
  };
}

function createComponentActions(data: Record<string, unknown> | undefined) {
  if (!data) {
    throw new Error('No data provided for component generation');
  }

  const componentPath = getDestinationPath('component', data.name as string);

  return [
    createComponentFileAction(componentPath, data),
    {
      type: 'add',
      path: `${componentPath}/types.ts`,
      templateFile: 'templates/component/types.ts.hbs',
    },
    createTestFileAction(componentPath, data),
  ];
}

export default function componentGenerator(plop: NodePlopAPI): void {
  plop.setGenerator('component', {
    description: 'Generate a Vue component with TypeScript support',
    prompts: componentPrompts,
    actions: createComponentActions,
  });
}
