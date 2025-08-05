/**
 * Tests for BaseGenerator factory pattern
 */

import { describe, it, expect, vi } from 'vitest';
import { BaseGenerator } from '../index';
import type { GeneratorAction, PromptAnswers, GeneratorPrompt } from '../types';

class TestGenerator extends BaseGenerator {
  readonly name = 'test';
  readonly description = 'Test generator for BaseGenerator pattern';

  getPrompts(): GeneratorPrompt[] {
    return [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name?',
        validate: (input: string) => (input.length > 0 ? true : 'Name is required'),
      },
    ];
  }

  validateInput(data: PromptAnswers): string | true {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      return 'Name is required and must be a non-empty string';
    }
    return true;
  }

  createActions(data: PromptAnswers): GeneratorAction[] {
    return [
      {
        type: 'add',
        path: `test/${data.name}.txt`,
        templateFile: 'test.txt.hbs',
        data,
      },
    ];
  }
}

describe('BaseGenerator', () => {
  it('should create a generator with correct properties', () => {
    const generator = new TestGenerator();

    expect(generator.name).toBe('test');
    expect(generator.description).toBe('Test generator for BaseGenerator pattern');
  });

  it('should return prompts correctly', () => {
    const generator = new TestGenerator();
    const prompts = generator.getPrompts();

    expect(prompts).toHaveLength(1);
    expect(prompts[0].name).toBe('name');
    expect(prompts[0].type).toBe('input');
  });

  it('should create actions correctly', () => {
    const generator = new TestGenerator();
    const data: PromptAnswers = { name: 'TestComponent' };
    const actions = generator.createActions(data);

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe('add');
    expect(actions[0].path).toBe('test/TestComponent.txt');
  });

  it('should verify generator registration', () => {
    const generator = new TestGenerator();
    const mockPlop = {
      setGenerator: vi.fn(),
    };

    generator.register(mockPlop as unknown as Parameters<typeof generator.register>[0]);

    expect(mockPlop.setGenerator).toHaveBeenCalledWith('test', expect.any(Object));

    const registeredConfig = mockPlop.setGenerator.mock.calls[0][1];
    expect(registeredConfig.description).toBe('Test generator for BaseGenerator pattern');
    expect(Array.isArray(registeredConfig.prompts)).toBe(true);
    expect(registeredConfig.prompts).toHaveLength(1);
    expect(typeof registeredConfig.actions).toBe('function');
  });

  it('should handle data validation with error handling', () => {
    const generator = new TestGenerator();
    const mockPlop = {
      setGenerator: vi.fn(),
    };

    generator.register(mockPlop as unknown as Parameters<typeof generator.register>[0]);

    const registeredConfig = mockPlop.setGenerator.mock.calls[0][1];
    const actionsFunction = registeredConfig.actions;

    const emptyResult = actionsFunction(undefined);
    expect(emptyResult).toEqual([]);

    const validData = { name: 'TestComponent' };
    const actions = actionsFunction(validData);
    expect(actions).toHaveLength(1);
    expect(actions[0].path).toBe('test/TestComponent.txt');
  });
});
