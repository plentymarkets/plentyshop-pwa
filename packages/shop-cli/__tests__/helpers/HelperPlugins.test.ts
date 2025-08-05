import { describe, it, expect, vi } from 'vitest';
import { StringCasePlugin, ComposablePlugin, UtilityPlugin } from '../../src/helpers/plugins';
import type { NodePlopAPI } from 'plop';

const createMockPlop = (): NodePlopAPI & { getHelper: (name: string) => (...args: unknown[]) => unknown } => {
  const helpers = new Map<string, (...args: unknown[]) => unknown>();

  return {
    setHelper: vi.fn((name: string, fn: (...args: unknown[]) => unknown) => {
      helpers.set(name, fn);
    }),
    getHelper: (name: string) => helpers.get(name) as (...args: unknown[]) => unknown,
  } as unknown as NodePlopAPI & { getHelper: (name: string) => (...args: unknown[]) => unknown };
};

describe('Helper Plugins', () => {
  describe('StringCasePlugin', () => {
    it('should register string case helpers', () => {
      const plugin = new StringCasePlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      expect(mockPlop.setHelper).toHaveBeenCalledWith('pascalCase', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('camelCase', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('kebabCase', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('humanCase', expect.any(Function));
    });

    it('should convert strings to pascalCase correctly', () => {
      const plugin = new StringCasePlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      const pascalCase = mockPlop.getHelper('pascalCase');
      expect(pascalCase('hello world')).toBe('HelloWorld');
      expect(pascalCase('my-component')).toBe('MyComponent');
      expect(pascalCase('test_name')).toBe('TestName');
      expect(pascalCase('')).toBe('');
    });

    it('should convert strings to camelCase correctly', () => {
      const plugin = new StringCasePlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      const camelCase = mockPlop.getHelper('camelCase');
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('my-component')).toBe('myComponent');
      expect(camelCase('TestName')).toBe('testName');
      expect(camelCase('')).toBe('');
    });

    it('should convert strings to kebab-case correctly', () => {
      const plugin = new StringCasePlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      const kebabCase = mockPlop.getHelper('kebabCase');
      expect(kebabCase('HelloWorld')).toBe('hello-world');
      expect(kebabCase('myComponent')).toBe('my-component');
      expect(kebabCase('test_name')).toBe('test-name');
      expect(kebabCase('')).toBe('');
    });
  });

  describe('ComposablePlugin', () => {
    it('should register composable helpers', () => {
      const plugin = new ComposablePlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      expect(mockPlop.setHelper).toHaveBeenCalledWith('composableBaseName', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('makeComposableName', expect.any(Function));
    });

    it('should extract base name from composable', () => {
      const plugin = new ComposablePlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      const composableBaseName = mockPlop.getHelper('composableBaseName');
      expect(composableBaseName('useProductCart')).toBe('productCart');
      expect(composableBaseName('useAPI')).toBe('aPI');
      expect(composableBaseName('productCart')).toBe('productCart');
      expect(composableBaseName('')).toBe('');
    });

    it('should create composable name from base', () => {
      const plugin = new ComposablePlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      const makeComposableName = mockPlop.getHelper('makeComposableName');
      expect(makeComposableName('ProductCart')).toBe('useProductCart');
      expect(makeComposableName('useProductCart')).toBe('useProductCart');
      expect(makeComposableName('API')).toBe('useAPI');
      expect(makeComposableName('')).toBe('');
    });
  });

  describe('UtilityPlugin', () => {
    it('should register utility helpers', () => {
      const plugin = new UtilityPlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      expect(mockPlop.setHelper).toHaveBeenCalledWith('testId', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('currentDate', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('currentYear', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('concat', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('filePath', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('importPath', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('ifEquals', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('ifNotEmpty', expect.any(Function));
    });

    it('should create test id correctly', () => {
      const plugin = new UtilityPlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      const testId = mockPlop.getHelper('testId');
      expect(testId('ProductCard')).toBe('productcard');
      expect(testId('User Profile')).toBe('user-profile');
      expect(testId('test@email.com')).toBe('test-email-com');
      expect(testId('')).toBe('');
    });

    it('should return current date and year', () => {
      const plugin = new UtilityPlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      const currentDate = mockPlop.getHelper('currentDate');
      const currentYear = mockPlop.getHelper('currentYear');

      expect(typeof currentDate()).toBe('string');
      expect(currentDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof currentYear()).toBe('number');
      expect(currentYear()).toBeGreaterThan(2020);
    });

    it('should concatenate values', () => {
      const plugin = new UtilityPlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      const concat = mockPlop.getHelper('concat');
      expect(concat('hello', ' ', 'world', {})).toBe('hello world');
      expect(concat('a', 'b', 'c', {})).toBe('abc');
    });

    it('should create file paths correctly', () => {
      const plugin = new UtilityPlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      const filePath = mockPlop.getHelper('filePath');
      expect(filePath('components', 'ProductCard', 'types.ts', {})).toBe('components/ProductCard/types.ts');
      expect(filePath('src', 'utils', {})).toBe('src/utils');
      expect(filePath('', 'test', '', 'file.ts', {})).toBe('test/file.ts'); // filters out empty strings
    });

    it('should create import paths correctly', () => {
      const plugin = new UtilityPlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      const importPath = mockPlop.getHelper('importPath');
      expect(importPath('ProductCard', 'types')).toBe('./types');
      expect(importPath('ProductCard', './types')).toBe('./types');
      expect(importPath('ProductCard', '../utils/helpers')).toBe('../utils/helpers');
      expect(importPath('', '')).toBe('');
    });
  });
});
