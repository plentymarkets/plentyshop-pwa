import { describe, it, expect } from 'vitest';
import {
  getTemplatePath,
  getDestinationPath,
  createComponentTemplateFiles,
  createComposableTemplateFiles,
  createGeneratorConfig,
} from '../src/utils/template-utils';

describe('Template Utilities', () => {
  describe('getTemplatePath', () => {
    it('returns correct template paths', () => {
      expect(getTemplatePath('component')).toContain('templates/component');
      expect(getTemplatePath('composable')).toContain('templates/composable');
    });
  });

  describe('getDestinationPath', () => {
    it('returns correct destination paths for components', () => {
      const path = getDestinationPath('component', 'ProductCard');
      expect(path).toContain('components/ProductCard');
    });

    it('returns correct destination paths for composables', () => {
      const path = getDestinationPath('composable', 'useProductCart');
      expect(path).toContain('composables/useProductCart');
    });

    it('throws error for unknown generator type', () => {
      expect(() => getDestinationPath('unknown', 'Test')).toThrow('Unknown generator type: unknown');
    });
  });

  describe('createComponentTemplateFiles', () => {
    it('creates basic component files', () => {
      const files = createComponentTemplateFiles();
      expect(files).toContainEqual({
        name: '{{pascalCase name}}.vue',
        template: 'component.vue.hbs',
      });
      expect(files).toContainEqual({
        name: 'types.ts',
        template: 'types.ts.hbs',
      });
    });

    it('includes optional files when specified', () => {
      const files = createComponentTemplateFiles({
        includeTests: true,
      });

      expect(files.some((f) => f.template === 'component.spec.ts.hbs')).toBe(true);
    });

    it('excludes optional files when not specified', () => {
      const files = createComponentTemplateFiles({
        includeTypes: false,
        includeTests: false,
      });

      expect(files.some((f) => f.name === 'types.ts')).toBe(false);
      expect(files.some((f) => f.template === 'component.spec.ts.hbs')).toBe(false);
    });
  });

  describe('createComposableTemplateFiles', () => {
    it('creates basic composable files', () => {
      const files = createComposableTemplateFiles();
      expect(files).toContainEqual({
        name: '{{camelCase name}}.ts',
        template: 'composable.ts.hbs',
      });
      expect(files).toContainEqual({
        name: 'types.ts',
        template: 'types.ts.hbs',
      });
    });
  });

  describe('createGeneratorConfig', () => {
    it('creates complete generator configuration', () => {
      const config = createGeneratorConfig('component', {
        description: 'Test generator',
        prompts: [{ type: 'input', name: 'test', message: 'Test?' }],
        templateFiles: [{ name: 'test.vue', template: 'test.hbs' }],
      });

      expect(config.description).toBe('Test generator');
      expect(config.prompts).toHaveLength(1);
      expect(config.actions).toHaveLength(1);
    });
  });
});
