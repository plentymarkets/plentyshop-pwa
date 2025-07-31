import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorUtils, ErrorType, createErrorHandler } from '../../src/core/error-handling';
import type { ErrorHandlingConfig } from '../../src/core/error-handling';

describe('ErrorUtils', () => {
  describe('createErrorInfo', () => {
    it('should create error info from Error objects', () => {
      const error = new Error('Test error message');
      
      const errorInfo = ErrorUtils.createErrorInfo(error, {
        type: ErrorType.VALIDATION,
        context: 'test context',
      });
      
      expect(errorInfo.type).toBe(ErrorType.VALIDATION);
      expect(errorInfo.message).toBe('Test error message');
      expect(errorInfo.context).toBe('test context');
      expect(errorInfo.originalError).toBe(error);
    });

    it('should create error info from string errors', () => {
      const errorInfo = ErrorUtils.createErrorInfo('String error', {
        type: ErrorType.FILESYSTEM,
      });
      
      expect(errorInfo.type).toBe(ErrorType.FILESYSTEM);
      expect(errorInfo.message).toBe('String error');
      expect(errorInfo.originalError).toBeUndefined();
    });

    it('should handle unknown error types', () => {
      const errorInfo = ErrorUtils.createErrorInfo({ custom: 'object' });
      
      expect(errorInfo.message).toBe('[object Object]');
    });
  });

  describe('reportToConsole', () => {
    let consoleSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should report errors to console', () => {
      const errorInfo = {
        type: ErrorType.VALIDATION,
        message: 'Test error',
        context: 'test context',
        suggestions: ['Try this', 'Or that'],
      };
      
      ErrorUtils.reportToConsole(errorInfo, true, true);
      
      expect(consoleSpy).toHaveBeenCalledWith('❌ [VALIDATION] Test error');
      expect(consoleSpy).toHaveBeenCalledWith('   Context: test context');
      expect(consoleSpy).toHaveBeenCalledWith('   Suggestions:');
      expect(consoleSpy).toHaveBeenCalledWith('   • Try this');
      expect(consoleSpy).toHaveBeenCalledWith('   • Or that');
    });

    it('should respect verbose and showSuggestions flags', () => {
      const errorInfo = {
        type: ErrorType.VALIDATION,
        message: 'Test error',
        context: 'test context',
        suggestions: ['Try this'],
      };
      
      ErrorUtils.reportToConsole(errorInfo, false, false);
      
      expect(consoleSpy).toHaveBeenCalledWith('❌ [VALIDATION] Test error');
      expect(consoleSpy).not.toHaveBeenCalledWith('   Context: test context');
      expect(consoleSpy).not.toHaveBeenCalledWith('   Suggestions:');
    });
  });
});

describe('createErrorHandler', () => {
  it('should create error handler with custom config', () => {
    const config: Partial<ErrorHandlingConfig> = {
      failFast: true,
      verbose: false,
    };
    
    const handler = createErrorHandler(config);
    
    expect(handler).toBeDefined();
    
    // Test that config is applied by checking fail-fast behavior
    const operation = () => {
      throw new Error('Test error');
    };
    
    expect(() => handler.wrapValidation(operation)).toThrow('Test error');
  });

  it('should create error handler with default config when no config provided', () => {
    const handler = createErrorHandler();
    
    expect(handler).toBeDefined();
  });
});
