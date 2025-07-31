import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorHandler, ErrorType } from '../../src/core/error-handling';

// Test helper functions to reduce nesting
const createSuccessfulOperation = () => () => [
  'add:test.js:content' // Simple string format for ActionType
];

const createFailingOperation = (message: string) => () => {
  throw new Error(message);
};

const createValidOperation = () => () => 'valid result';

describe('Error Handling System', () => {
  let errorHandler: ErrorHandler;
  let mockReporter: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockReporter = vi.fn();
    errorHandler = new ErrorHandler({
      failFast: false,
      verbose: true,
      showSuggestions: true,
      reporter: mockReporter,
    });
  });

  describe('ErrorHandler - Generator Execution', () => {
    it('should return success result for successful operations', () => {
      const operation = createSuccessfulOperation();
      
      const result = errorHandler.wrapGeneratorExecution('test-generator', operation);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0]).toBe('add:test.js:content');
      }
    });

    it('should handle errors and return error result', () => {
      const operation = createFailingOperation('Test error');
      
      const result = errorHandler.wrapGeneratorExecution('test-generator', operation);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe(ErrorType.GENERATION);
        expect(result.error.message).toBe('Test error');
        expect(result.error.context).toContain('Generator: test-generator');
      }
    });

    it('should include data context in verbose mode', () => {
      const operation = createFailingOperation('Test error');
      const testData = { name: 'TestComponent' };
      
      errorHandler.wrapGeneratorExecution('test-generator', operation, testData);
      
      expect(mockReporter).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.stringContaining('TestComponent'),
        })
      );
    });
  });

  describe('ErrorHandler - Validation', () => {
    it('should return success result for valid operations', () => {
      const operation = createValidOperation();
      
      const result = errorHandler.wrapValidation(operation, 'test validation');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('valid result');
      }
    });

    it('should handle validation errors', () => {
      const operation = createFailingOperation('Validation failed');
      
      const result = errorHandler.wrapValidation(operation, 'test validation');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe(ErrorType.VALIDATION);
        expect(result.error.context).toBe('test validation');
        expect(result.error.suggestions).toContain('Check input format and requirements');
      }
    });
  });

  describe('ErrorHandler - File System Operations', () => {
    it('should handle file system errors', () => {
      const operation = createFailingOperation('ENOENT: File not found');
      
      const result = errorHandler.wrapFileSystemOperation(operation, 'file read');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe(ErrorType.FILESYSTEM);
        expect(result.error.suggestions).toContain('Check file and directory permissions');
      }
    });
  });

  describe('ErrorHandler - Template Processing', () => {
    it('should handle template errors', () => {
      const operation = createFailingOperation('Template syntax error');
      
      const result = errorHandler.wrapTemplateProcessing(operation, 'component.hbs');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe(ErrorType.TEMPLATE);
        expect(result.error.context).toBe('Template: component.hbs');
        expect(result.error.suggestions).toContain('Check template syntax and helpers');
      }
    });
  });

  describe('ErrorHandler - Plugin Operations', () => {
    it('should handle plugin errors', () => {
      const operation = createFailingOperation('Plugin initialization failed');
      
      const result = errorHandler.wrapPluginOperation(operation, 'string-case-plugin');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe(ErrorType.PLUGIN);
        expect(result.error.context).toBe('Plugin: string-case-plugin');
        expect(result.error.suggestions).toContain('Check plugin configuration');
      }
    });
  });

  describe('ErrorHandler - Fail Fast Configuration', () => {
    it('should throw errors when failFast is true', () => {
      const failFastHandler = new ErrorHandler({ failFast: true });
      const operation = createFailingOperation('Test error');
      
      expect(() => failFastHandler.wrapValidation(operation)).toThrow('Test error');
    });

    it('should not throw errors when failFast is false', () => {
      const operation = createFailingOperation('Test error');
      
      expect(() => errorHandler.wrapValidation(operation)).not.toThrow();
    });
  });
});
