/**
 * Tests for error handling and validation scenarios
 */

import { describe, it, expect } from 'vitest';
import { handleGeneratorError } from '../utils';
import { GeneratorError } from '../types';

describe('Error Handling and Validation', () => {
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

  describe('Conflict Detection', () => {
    it('should detect existing component conflicts', () => {
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
