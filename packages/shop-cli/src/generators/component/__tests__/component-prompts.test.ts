/**
 * Tests for the component generator's block-related prompts (category, accessControl, complexForm)
 */

import { describe, it, expect, afterEach } from 'vitest';
import { componentPrompts } from '../component-prompts';

type PromptConfig = {
  name: string;
  validate?: (input: unknown) => string | boolean;
  when?: (answers: Record<string, unknown>) => boolean;
};

const getPrompt = (name: string): PromptConfig => {
  const prompt = (componentPrompts as PromptConfig[]).find((p) => p.name === name);
  if (!prompt) throw new Error(`No prompt named ${name}`);
  return prompt;
};

const ENV_KEYS = ['PLENTYSHOP_WITH_FORM', 'PLENTYSHOP_COMPLEX_FORM', 'PLENTYSHOP_CATEGORY', 'PLENTYSHOP_ACCESS_CONTROL'];

afterEach(() => {
  for (const key of ENV_KEYS) delete process.env[key];
});

describe('category prompt', () => {
  const category = getPrompt('category');

  it('should reject an empty or whitespace-only value', () => {
    expect(category.validate?.('')).not.toBe(true);
    expect(category.validate?.('   ')).not.toBe(true);
  });

  it('should accept a non-empty value', () => {
    expect(category.validate?.('cards')).toBe(true);
  });

  it('should not prompt when withForm answer is falsy and PLENTYSHOP_WITH_FORM is unset', () => {
    expect(category.when?.({ withForm: false })).toBe(false);
  });

  it('should prompt when withForm answer is true', () => {
    expect(category.when?.({ withForm: true })).toBe(true);
  });

  it('should prompt when PLENTYSHOP_WITH_FORM=true even if the withForm prompt itself was skipped', () => {
    process.env.PLENTYSHOP_WITH_FORM = 'true';
    expect(category.when?.({})).toBe(true);
  });

  it('should not prompt when PLENTYSHOP_CATEGORY is already set', () => {
    process.env.PLENTYSHOP_WITH_FORM = 'true';
    process.env.PLENTYSHOP_CATEGORY = 'cards';
    expect(category.when?.({})).toBe(false);
  });
});

describe('accessControl prompt', () => {
  const accessControl = getPrompt('accessControl');

  it('should reject an empty selection — an empty accessControl makes a block permanently invisible', () => {
    expect(accessControl.validate?.([])).not.toBe(true);
  });

  it('should accept a non-empty selection', () => {
    expect(accessControl.validate?.(['content'])).toBe(true);
  });

  it('should prompt when PLENTYSHOP_WITH_FORM=true even if the withForm prompt itself was skipped', () => {
    process.env.PLENTYSHOP_WITH_FORM = 'true';
    expect(accessControl.when?.({})).toBe(true);
  });

  it('should not prompt when PLENTYSHOP_ACCESS_CONTROL is already set', () => {
    process.env.PLENTYSHOP_WITH_FORM = 'true';
    process.env.PLENTYSHOP_ACCESS_CONTROL = 'content';
    expect(accessControl.when?.({})).toBe(false);
  });
});

describe('complexForm prompt', () => {
  const complexForm = getPrompt('complexForm');

  it('should not prompt for a plain component (no withForm)', () => {
    expect(complexForm.when?.({ withForm: false })).toBe(false);
  });

  it('should prompt when withForm answer is true', () => {
    expect(complexForm.when?.({ withForm: true })).toBe(true);
  });

  it('should not prompt when PLENTYSHOP_COMPLEX_FORM is already set', () => {
    process.env.PLENTYSHOP_WITH_FORM = 'true';
    process.env.PLENTYSHOP_COMPLEX_FORM = 'true';
    expect(complexForm.when?.({})).toBe(false);
  });
});
