import { describe, it, expect } from 'vitest';
import {
  pascalCase,
  camelCase,
  kebabCase,
  composableBaseName,
  makeComposableName,
  testId,
  filePath,
  importPath,
  currentDate,
  currentYear
} from '../src/helpers/naming';

describe('Naming Helpers', () => {
  describe('pascalCase', () => {
    it('converts to PascalCase correctly', () => {
      expect(pascalCase('hello world')).toBe('HelloWorld');
      expect(pascalCase('my-component')).toBe('MyComponent');
      expect(pascalCase('user_profile')).toBe('UserProfile');
      expect(pascalCase('API')).toBe('API');
    });

    it('handles edge cases', () => {
      expect(pascalCase('')).toBe('');
      expect(pascalCase(null as any)).toBe('');
      expect(pascalCase(undefined as any)).toBe('');
    });
  });

  describe('camelCase', () => {
    it('converts to camelCase correctly', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('my-component')).toBe('myComponent');
      expect(camelCase('UserProfile')).toBe('userProfile');
    });
  });

  describe('kebabCase', () => {
    it('converts to kebab-case correctly', () => {
      expect(kebabCase('HelloWorld')).toBe('hello-world');
      expect(kebabCase('myComponent')).toBe('my-component');
      expect(kebabCase('API_URL')).toBe('api-url');
    });
  });

  describe('composableBaseName', () => {
    it('removes use prefix correctly', () => {
      expect(composableBaseName('useProductCart')).toBe('ProductCart');
      expect(composableBaseName('useAPI')).toBe('API');
      expect(composableBaseName('ProductCart')).toBe('ProductCart');
    });
  });

  describe('makeComposableName', () => {
    it('adds use prefix correctly', () => {
      expect(makeComposableName('ProductCart')).toBe('useProductCart');
      expect(makeComposableName('API')).toBe('useAPI');
      expect(makeComposableName('useExisting')).toBe('useExisting');
    });
  });

  describe('testId', () => {
    it('creates test id correctly', () => {
      expect(testId('ProductCard')).toBe('product-card');
      expect(testId('UserProfile')).toBe('user-profile');
    });
  });

  describe('filePath', () => {
    it('creates file paths correctly', () => {
      expect(filePath('components', 'ProductCard', 'types.ts')).toBe('components/ProductCard/types.ts');
      expect(filePath('src', 'utils')).toBe('src/utils');
      expect(filePath()).toBe('');
    });
  });

  describe('importPath', () => {
    it('creates import paths correctly', () => {
      expect(importPath('ProductCard', 'types')).toBe('./types');
      expect(importPath('components', '../utils/validation')).toBe('../utils/validation');
      expect(importPath('components', './types')).toBe('./types');
    });
  });

  describe('currentDate', () => {
    it('returns current date in ISO format', () => {
      const date = currentDate();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('currentYear', () => {
    it('returns current year', () => {
      const year = currentYear();
      expect(year).toBeGreaterThan(2020);
      expect(year).toBeLessThan(2030);
    });
  });
});
