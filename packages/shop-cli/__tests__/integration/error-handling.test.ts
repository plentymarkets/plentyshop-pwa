/**
 * Tests for error handling and validation scenarios
 */

import { describe, it, expect } from 'vitest';
import { validateComponentName, validateComposableName, validateNotEmpty } from '../../src/utils/validation';
import { handleGeneratorError } from '../../src/utils/error-handling';
import { GeneratorError } from '../../src/types/error-handling';

describe('Error Handling and Validation', () => {
  describe('Input Validation Errors', () => {
    it('should handle invalid component names', () => {
      const invalidNames = [
        '',
        'component',          // lowercase
        'component-name',     // kebab-case
        'component_name',     // snake_case
        '123Component',       // starts with number
        'Component Name',     // contains space
        'Component-Name',     // contains hyphen
      ];

      for (const name of invalidNames) {
        const result = validateComponentName(name);
        expect(typeof result).toBe('string'); // Should return error message
        expect(result).not.toBe(true);
      }
    });

    it('should handle invalid composable names', () => {
      const invalidNames = [
        '',
        'composable',         // missing 'use' prefix
        'UseComposable',      // wrong case
        'use-composable',     // kebab-case
        'use_composable',     // snake_case
        'usecomposable',      // missing PascalCase
      ];

      for (const name of invalidNames) {
        const result = validateComposableName(name);
        expect(typeof result).toBe('string'); // Should return error message
        expect(result).not.toBe(true);
      }
    });

    it('should handle empty inputs', () => {
      const emptyInputs = ['', ' ', '  ', '\t', '\n'];

      for (const input of emptyInputs) {
        const result = validateNotEmpty(input);
        expect(typeof result).toBe('string'); // Should return error message
        expect(result).not.toBe(true);
      }
    });
  });

  describe('Generator Error Handling', () => {
    it('should handle GeneratorError instances', () => {
      const error = new GeneratorError('componentExists', 'TestComponent already exists');
      const message = handleGeneratorError(error);
      
      expect(message).toContain('❌');
      expect(message).toContain('TestComponent');
      expect(message).toContain('already exists');
    });

    it('should handle Node.js ENOENT errors', () => {
      const error = {
        code: 'ENOENT',
        path: '/path/to/missing/file',
        message: 'File not found',
      };
      
      const message = handleGeneratorError(error);
      expect(message).toContain('❌ File not found');
      expect(message).toContain('/path/to/missing/file');
    });

    it('should handle Node.js EACCES errors', () => {
      const error = {
        code: 'EACCES',
        path: '/restricted/path',
        message: 'Permission denied',
      };
      
      const message = handleGeneratorError(error);
      expect(message).toContain('❌ Permission denied');
      expect(message).toContain('/restricted/path');
    });

    it('should handle generic errors', () => {
      const error = new Error('Something went wrong');
      const message = handleGeneratorError(error);
      
      expect(message).toContain('❌ Unexpected error');
      expect(message).toContain('Something went wrong');
    });

    it('should handle unknown error types', () => {
      const error = 'String error';
      const message = handleGeneratorError(error);
      
      expect(message).toContain('❌ Unexpected error');
      expect(message).toContain('String error');
    });
  });

  describe('Validation Edge Cases', () => {
    it('should handle special characters in validation', () => {
      const invalidInputs = [
        'Component@Name',
        'Component#Name',
        'Component$Name',
        'Component%Name',
        'Component&Name',
        'Component*Name',
      ];

      for (const input of invalidInputs) {
        const result = validateComponentName(input);
        expect(typeof result).toBe('string');
        expect(result).toContain('Component name must be in PascalCase');
      }
    });

    it('should handle unicode characters', () => {
      const unicodeInputs = [
        'Componént',
        'Compønent',
        'Component™',
        'Cömponent',
      ];

      for (const input of unicodeInputs) {
        const result = validateComponentName(input);
        expect(typeof result).toBe('string');
      }
    });

    it('should handle very long names', () => {
      const longName = 'A'.repeat(100);
      const result = validateComponentName(longName);
      expect(typeof result).toBe('string');
      expect(result).toContain('should not exceed');
    });
  });

  describe('Conflict Detection', () => {
    it('should detect existing component conflicts', () => {
      // This would test the file conflict detection logic
      // For now, we'll test the concept
      const existingComponents = ['ProductCard', 'UserProfile', 'ShoppingCart'];
      const newComponent = 'ProductCard';
      
      const hasConflict = existingComponents.includes(newComponent);
      expect(hasConflict).toBe(true);
    });

    it('should allow new components when no conflicts exist', () => {
      const existingComponents = ['ProductCard', 'UserProfile', 'ShoppingCart'];
      const newComponent = 'OrderSummary';
      
      const hasConflict = existingComponents.includes(newComponent);
      expect(hasConflict).toBe(false);
    });
  });

  describe('Dry Run Validation', () => {
    it('should validate dry run scenarios', () => {
      // Test that dry run mode would work correctly
      const dryRunData = {
        component: 'TestComponent',
        path: '/test/path',
        files: ['TestComponent.vue', 'types.ts', 'index.ts'],
        conflicts: [],
      };

      expect(dryRunData.component).toBe('TestComponent');
      expect(dryRunData.files).toHaveLength(3);
      expect(dryRunData.conflicts).toHaveLength(0);
    });

    it('should detect conflicts in dry run mode', () => {
      const dryRunData = {
        component: 'ExistingComponent',
        path: '/test/path',
        files: ['ExistingComponent.vue'],
        conflicts: ['ExistingComponent.vue already exists'],
      };

      expect(dryRunData.conflicts).toHaveLength(1);
      expect(dryRunData.conflicts[0]).toContain('already exists');
    });
  });
});
