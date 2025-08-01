/**
 * Composable generator configuration
 * Creates Vue composables with API integration, state management, and dual fetch methods
 */

import type { NodePlopAPI } from 'plop';
import { BaseGenerator, ActionBuilder } from '../../core';
import type { GeneratorAction, PromptAnswers, GeneratorPrompt } from '../../core';
import { composablePrompts } from './composable-prompts';
import { validateComposableName } from '../../utils/validation';

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
    return ActionBuilder.forGenerator('composable', _data.name)
      .withData(_data)
      .addMainFile()
      .addTypes()
      .addIndex()
      .addTests()
      .build();
  }

  validateInput(data: PromptAnswers): string | true {
    return validateComposableName(data.name);
  }
}

export default function composableGenerator(plop: NodePlopAPI): void {
  const generator = new ComposableGenerator();
  generator.register(plop);
}
