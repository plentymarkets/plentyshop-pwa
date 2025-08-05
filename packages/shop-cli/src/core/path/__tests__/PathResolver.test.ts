/**
 * Tests for PathResolver and path strategies
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PathResolver, pathResolver } from '../index';
import type { PathConfig, PathOptions } from '../types';

describe('PathResolver', () => {
  describe('Default Configuration', () => {
    it('should provide correct default paths', () => {
      expect(pathResolver.getProjectRoot()).toMatch(/.*plentyshop-pwa$/);
      expect(pathResolver.getWebAppPath()).toMatch(/.*plentyshop-pwa\/apps\/web$/);
      expect(pathResolver.getTemplatePath('component')).toMatch(/.*templates\/component$/);
    });

    it('should list available generator types', () => {
      const types = pathResolver.getAvailableTypes();
      expect(types).toContain('component');
      expect(types).toContain('composable');
    });
  });

  describe('Component Strategy', () => {
    it('should resolve component paths correctly', () => {
      const result = pathResolver.resolve('component', 'TestComponent');

      expect(result.basePath).toBe('../../apps/web/components/TestComponent');
      expect(result.mainFile).toBe('../../apps/web/components/TestComponent/{{pascalCase name}}.vue');
      expect(result.typesFile).toBe('../../apps/web/components/TestComponent/types.ts');
      expect(result.testFile).toBe('../../apps/web/components/TestComponent/__tests__/{{pascalCase name}}.spec.ts');
      expect(result.indexFile).toBeUndefined();
      expect(result.files).toHaveLength(3);
    });

    it('should handle custom options for components', () => {
      const options: PathOptions = {
        fileName: 'CustomName',
        extension: 'jsx',
      };

      const result = pathResolver.resolve('component', 'TestComponent', options);

      expect(result.mainFile).toBe('../../apps/web/components/TestComponent/CustomName.jsx');
    });
  });

  describe('Composable Strategy', () => {
    it('should resolve composable paths correctly', () => {
      const result = pathResolver.resolve('composable', 'useTestData');

      expect(result.basePath).toBe('../../apps/web/composables/useTestData');
      expect(result.mainFile).toBe('../../apps/web/composables/useTestData/{{name}}.ts');
      expect(result.typesFile).toBe('../../apps/web/composables/useTestData/types.ts');
      expect(result.indexFile).toBe('../../apps/web/composables/useTestData/index.ts');
      expect(result.testFile).toBe('../../apps/web/composables/useTestData/__tests__/{{name}}.spec.ts');
      expect(result.files).toHaveLength(4);
    });
  });

  describe('Settings Strategy', () => {
    it('should resolve settings paths correctly', () => {
      const result = pathResolver.resolve('settings', 'TestSetting');

      expect(result.basePath).toBe('../../apps/web/components/settings/general/TestSetting');
      expect(result.mainFile).toBe('../../apps/web/components/settings/general/TestSetting/{{pascalCase name}}.vue');
      expect(result.typesFile).toBe('../../apps/web/components/settings/general/TestSetting/types.ts');
      expect(result.testFile).toBe(
        '../../apps/web/components/settings/general/TestSetting/__tests__/{{pascalCase name}}.spec.ts',
      );
      expect(result.triggerFile).toBe('../../apps/web/components/settings/general/TestSetting/ToolbarTrigger.vue');
      expect(result.files).toHaveLength(4);
    });

    it('should handle custom category for settings', () => {
      const result = pathResolver.resolve('settings', 'TestSetting', { category: 'product' });

      expect(result.basePath).toBe('../../apps/web/components/settings/product/TestSetting');
      expect(result.mainFile).toBe('../../apps/web/components/settings/product/TestSetting/{{pascalCase name}}.vue');
    });
  });

  describe('Page Strategy', () => {
    it('should resolve static page paths correctly', () => {
      const result = pathResolver.resolve('page', 'about');

      expect(result.basePath).toBe('../../apps/web/pages');
      expect(result.mainFile).toBe('../../apps/web/pages/about.vue');
      expect(result.files).toHaveLength(1);
      expect(result.typesFile).toBeUndefined();
      expect(result.testFile).toBeUndefined();
    });

    it('should resolve dynamic page paths correctly', () => {
      const result = pathResolver.resolve('page', 'slug', { isDynamic: true });

      expect(result.mainFile).toBe('../../apps/web/pages/[slug].vue');
    });
  });

  describe('Block Strategy', () => {
    it('should resolve block paths correctly', () => {
      const result = pathResolver.resolve('block', 'TestBlock');

      expect(result.basePath).toBe('../../apps/web/components/blocks/TestBlock');
      expect(result.mainFile).toBe('../../apps/web/components/blocks/TestBlock/{{pascalCase name}}.vue');
      expect(result.typesFile).toBe('../../apps/web/components/blocks/TestBlock/types.ts');
      expect(result.testFile).toBe('../../apps/web/components/blocks/TestBlock/__tests__/{{pascalCase name}}.spec.ts');
      expect(result.formFile).toBe('../../apps/web/components/blocks/TestBlock/{{pascalCase name}}Form.vue');
      expect(result.files).toHaveLength(4);
    });
  });

  describe('Custom Configuration', () => {
    let customResolver: PathResolver;

    beforeEach(() => {
      const customConfig: Partial<PathConfig> = {
        webAppRoot: '/custom/web',
        templatesRoot: '/custom/templates',
      };
      customResolver = new PathResolver(customConfig);
    });

    it('should use custom configuration', () => {
      expect(customResolver.getWebAppPath()).toBe('/custom/web');
      expect(customResolver.getTemplatePath('component')).toBe('/custom/templates/component');
    });

    it('should resolve paths with custom config', () => {
      const result = customResolver.resolve('component', 'TestComponent');

      expect(result.basePath).toBe('../../apps/web/components/TestComponent');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for unknown generator type', () => {
      expect(() => {
        pathResolver.resolve('unknown', 'test');
      }).toThrow('No path strategy found for generator type: unknown');
    });
  });

  describe('Custom Strategy Registration', () => {
    it('should allow registering custom strategies', () => {
      const customStrategy = {
        resolve: (name: string) => ({
          basePath: `../../custom/${name}`,
          mainFile: `../../custom/${name}/custom.ts`,
          files: [`../../custom/${name}/custom.ts`],
        }),
      };

      pathResolver.register('custom', customStrategy);

      const result = pathResolver.resolve('custom', 'test');
      expect(result.basePath).toBe('../../custom/test');
      expect(result.mainFile).toBe('../../custom/test/custom.ts');
    });
  });
});
