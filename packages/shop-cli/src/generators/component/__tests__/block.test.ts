/**
 * Tests for the standalone "block" generator (registered so it shows up in `npx plentyshop
 * generate`'s interactive generator picker, alongside "component" and "composable").
 */

import { describe, it, expect } from 'vitest';
import blockGenerator from '../block';
import { PathResolver } from '../../../core/path/PathResolver';
import type { GeneratorAction, PromptAnswers } from '../../../core/generators/types';

const getBlockActionsFunction = () => {
  const pathResolver = new PathResolver();
  let name = '';
  let actionsFunction!: (data?: PromptAnswers) => GeneratorAction[];
  const setGenerator = (generatorName: string, config: { actions: (data?: PromptAnswers) => GeneratorAction[] }) => {
    name = generatorName;
    actionsFunction = config.actions;
  };

  blockGenerator({ setGenerator } as unknown as Parameters<typeof blockGenerator>[0], pathResolver);

  return { name, actionsFunction };
};

describe('blockGenerator', () => {
  it('should register itself under the name "block", distinct from "component"', () => {
    const { name } = getBlockActionsFunction();
    expect(name).toBe('block');
  });

  it('should always scaffold Form.vue, defaults.ts, and icon.svg without a withForm answer', () => {
    const { actionsFunction } = getBlockActionsFunction();
    const actions = actionsFunction({ name: 'TestBlock', category: 'cards' });

    expect(actions.some((action) => action.path.endsWith('TestBlockForm.vue'))).toBe(true);
    expect(actions.some((action) => action.path.endsWith('/defaults.ts'))).toBe(true);
    expect(actions.some((action) => action.path.endsWith('/icon.svg'))).toBe(true);
  });

  it('should resolve into components/blocks/<Name>/, same as component --with-form', () => {
    const { actionsFunction } = getBlockActionsFunction();
    const actions = actionsFunction({ name: 'TestBlock', category: 'cards' });

    const mainFile = actions.find((action) => action.path.endsWith('{{pascalCase name}}.vue'));
    expect(mainFile?.path).toContain('components/blocks/TestBlock');
  });

  it('should never resolve accessControl to an empty array', () => {
    const { actionsFunction } = getBlockActionsFunction();
    const actions = actionsFunction({ name: 'TestBlock', category: 'cards' });

    const defaultsAction = actions.find((action) => action.path.endsWith('/defaults.ts'));
    expect(defaultsAction?.data?.accessControl).toEqual(['content']);
  });

  it('should scaffold the complex-form file set when complexForm is set', () => {
    const { actionsFunction } = getBlockActionsFunction();
    const actions = actionsFunction({ name: 'TestBlock', category: 'cards', complexForm: true });

    expect(actions.some((action) => action.path.endsWith('/forms/TestBlockSettingsForm.vue'))).toBe(true);
    expect(actions.some((action) => action.path.endsWith('/partials/TestBlockSectionEditor.vue'))).toBe(true);
  });

  it('should pass structure through to the defaults.ts/types.ts template data', () => {
    const { actionsFunction } = getBlockActionsFunction();
    const actions = actionsFunction({ name: 'TestBlock', category: 'cards', structure: true });

    const defaultsAction = actions.find((action) => action.path.endsWith('/defaults.ts'));
    const typesAction = actions.find((action) => action.path.endsWith('/types.ts'));
    expect(defaultsAction?.data?.structure).toBe(true);
    expect(typesAction?.data?.structure).toBe(true);
  });

  it('should not add View.vue or ToolbarTrigger.vue — those are for settings panels, not blocks', () => {
    const { actionsFunction } = getBlockActionsFunction();
    const actions = actionsFunction({ name: 'TestBlock', category: 'cards' });

    expect(actions.some((action) => action.path.endsWith('View.vue'))).toBe(false);
    expect(actions.some((action) => action.path.endsWith('ToolbarTrigger.vue'))).toBe(false);
  });
});
