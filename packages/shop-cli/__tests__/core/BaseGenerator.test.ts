/**
 * Tests for BaseGenerator factory pattern
 */

import { describe, it, expect, vi } from 'vitest';
import { BaseGenerator } from '../../src/core/BaseGenerator';
import type { GeneratorAction, PromptAnswers, GeneratorPrompt } from '../../src/types';

// Mock generator for testing
class TestGenerator extends BaseGenerator {
  readonly name = 'test';
  readonly description = 'Test generator for BaseGenerator pattern';

  getPrompts(): GeneratorPrompt[] {
    return [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name?',
        validate: (input: string) => input.length > 0 ? true : 'Name is required',
      },
    ];
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
    
    // Verify the generator was registered with correct name
    expect(mockPlop.setGenerator).toHaveBeenCalledWith('test', expect.any(Object));
    
    // Verify the registered config has the right structure
    const registeredConfig = mockPlop.setGenerator.mock.calls[0][1];
    expect(registeredConfig.description).toBe('Test generator for BaseGenerator pattern');
    expect(Array.isArray(registeredConfig.prompts)).toBe(true);
    expect(registeredConfig.prompts).toHaveLength(1);
    expect(typeof registeredConfig.actions).toBe('function');
  });

  it('should handle data validation in actions function', () => {
    const generator = new TestGenerator();
    const mockPlop = {
      setGenerator: vi.fn(),
    };
    
    generator.register(mockPlop as unknown as Parameters<typeof generator.register>[0]);
    
    // Get the actions function that was registered
    const registeredConfig = mockPlop.setGenerator.mock.calls[0][1];
    const actionsFunction = registeredConfig.actions;
    
    // Should throw error for undefined data
    expect(() => actionsFunction(undefined)).toThrow('No data provided for test generation');
    
    // Should work for valid data
    const validData = { name: 'TestComponent' };
    const actions = actionsFunction(validData);
    expect(actions).toHaveLength(1);
    expect(actions[0].path).toBe('test/TestComponent.txt');
  });
});
