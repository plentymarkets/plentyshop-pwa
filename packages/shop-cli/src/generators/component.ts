/**
 * Component Generator for PlentyONE Shop
 * Generates Vue 3 components with TypeScript, tests, and proper structure
 */

import type { NodePlopAPI } from 'plop';
import { BaseGenerator, ActionBuilder } from '../core';
import type { GeneratorAction, PromptAnswers, GeneratorPrompt } from '../types';
import { componentPrompts } from './component-prompts';
import { validateComponentName } from '../utils/validation';

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
    return ActionBuilder.forGenerator('component', data.name)
      .withData(data)
      .addMainFile()
      .addTypes()
      .addTests()
      .build();
  }

  validateInput(data: PromptAnswers): string | true {
    return validateComponentName(data.name);
  }
}

export default function componentGenerator(plop: NodePlopAPI): void {
  const generator = new ComponentGenerator();
  generator.register(plop);
}
