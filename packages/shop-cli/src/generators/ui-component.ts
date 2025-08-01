/**
 * UI Component Generator for PlentyONE Shop
 * Generates UI components following Vue.js style guide patterns
 * Enforces Base and Single-Instance component patterns
 */

import type { NodePlopAPI } from 'plop';
import { BaseGenerator, ActionBuilder } from '../core';
import type { GeneratorAction, PromptAnswers, GeneratorPrompt } from '../core';
import { uiComponentPrompts } from './ui-component-prompts';
import { validateComponentName } from '../utils/validation';

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
    return ActionBuilder.forGenerator('ui-component', data.name)
      .withData(data)
      .addMainFile()
      .addTypes()
      .addTests()
      .build();
  }

  validateInput(data: PromptAnswers): string | true {
    return validateComponentName(data.componentName);
  }
}

export default function uiComponentGenerator(plop: NodePlopAPI): void {
  const generator = new UIComponentGenerator();
  generator.register(plop);
}
