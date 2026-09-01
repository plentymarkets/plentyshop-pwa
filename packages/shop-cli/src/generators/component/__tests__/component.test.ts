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

  describe('block scaffolding (--with-form)', () => {
    it('should always include defaults.ts and icon.svg actions', () => {
      const actions = getActionsFunction()({ name: 'TestBlock', withForm: true, category: 'cards' });

      expect(actions.some((action) => action.path.endsWith('/defaults.ts'))).toBe(true);
      expect(actions.some((action) => action.path.endsWith('/icon.svg'))).toBe(true);
    });

    it('should never resolve accessControl to an empty array, even with no answer/env var', () => {
      const actions = getActionsFunction()({ name: 'TestBlock', withForm: true, category: 'cards' });

      const defaultsAction = actions.find((action) => action.path.endsWith('/defaults.ts'));
      expect(defaultsAction?.data?.accessControl).toEqual(['content']);
    });

    it('should pass through an explicit accessControl selection unchanged', () => {
      const actions = getActionsFunction()({
        name: 'TestBlock',
        withForm: true,
        category: 'cards',
        accessControl: ['content', 'product'],
      });

      const defaultsAction = actions.find((action) => action.path.endsWith('/defaults.ts'));
      expect(defaultsAction?.data?.accessControl).toEqual(['content', 'product']);
    });

    it('should add a single Form.vue by default, not the complex-form file set', () => {
      const actions = getActionsFunction()({ name: 'TestBlock', withForm: true, category: 'cards' });

      expect(actions.some((action) => action.path.endsWith('TestBlockForm.vue'))).toBe(true);
      expect(actions.some((action) => action.path.includes('/forms/'))).toBe(false);
      expect(actions.some((action) => action.path.includes('/partials/'))).toBe(false);
    });

    it('should add the forms/ + partials/ file set instead of a single Form.vue when complexForm is set', () => {
      const actions = getActionsFunction()({
        name: 'TestBlock',
        withForm: true,
        complexForm: true,
        category: 'cards',
      });

      expect(actions.some((action) => action.path.endsWith('/forms/TestBlockSettingsForm.vue'))).toBe(true);
      expect(actions.some((action) => action.path.endsWith('/partials/TestBlockSectionEditor.vue'))).toBe(true);
      expect(actions.some((action) => action.path.endsWith('/forms/__tests__/TestBlockSettingsForm.spec.ts'))).toBe(
        true,
      );
      expect(actions.some((action) => action.path.endsWith('/partials/__tests__/TestBlockSectionEditor.spec.ts'))).toBe(
        true,
      );

      const orchestrator = actions.find((action) => action.path.endsWith('TestBlockForm.vue'));
      expect(orchestrator?.templateFile).toContain('component-form-orchestrator.vue.hbs');
    });

    it('should skip the forms/partials __tests__ specs when skipTests is set', () => {
      const actions = getActionsFunction()({
        name: 'TestBlock',
        withForm: true,
        complexForm: true,
        skipTests: true,
        category: 'cards',
      });

      expect(actions.some((action) => action.path.includes('__tests__'))).toBe(false);
    });

    it('should match the expected --with-form --complex-form directory shape', () => {
      const actions = getActionsFunction()({
        name: 'TestBlock',
        withForm: true,
        complexForm: true,
        category: 'cards',
      });

      const relativePaths = actions.map((action) => action.path.replace(/^.*apps\/web\/app\//, '')).sort();

      expect(relativePaths).toMatchSnapshot('component-with-form-complex-form-structure');
    });
  });
});
