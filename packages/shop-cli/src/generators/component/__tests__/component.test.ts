/**
 * Tests for the component generator's action/path wiring
 */

import { describe, it, expect } from 'vitest';
import componentGenerator from '../component';
import { PathResolver } from '../../../core/path/PathResolver';
import type { GeneratorAction, PromptAnswers } from '../../../core/generators/types';

const getActionsFunction = () => {
  const pathResolver = new PathResolver();
  const setGenerator = (_name: string, config: { actions: (data?: PromptAnswers) => GeneratorAction[] }) => {
    actionsFunction = config.actions;
  };
  let actionsFunction!: (data?: PromptAnswers) => GeneratorAction[];

  componentGenerator({ setGenerator } as unknown as Parameters<typeof componentGenerator>[0], pathResolver);

  return actionsFunction;
};

describe('componentGenerator', () => {
  it('should resolve a block (--with-form) into components/blocks/<Name>/', () => {
    const actions = getActionsFunction()({ name: 'TestBlock', withForm: true });

    const mainFile = actions.find((action) => action.path.endsWith('{{pascalCase name}}.vue'));
    expect(mainFile?.path).toContain('components/blocks/TestBlock');
  });

  it('should resolve a plain component (no --with-form) into components/<Name>/, unaffected', () => {
    const actions = getActionsFunction()({ name: 'TestComponent', withForm: false });

    const mainFile = actions.find((action) => action.path.endsWith('{{pascalCase name}}.vue'));
    expect(mainFile?.path).toContain('components/TestComponent');
    expect(mainFile?.path).not.toContain('components/blocks');
  });
});
