/**
 * Tests for ActionBuilder and ActionBuilderPresets
 */

import { describe, it, expect } from 'vitest';
import { ActionBuilder, ActionBuilderPresets } from '../index';

describe('ActionBuilder', () => {
  describe('Fluent API', () => {
    it('should create a component with all files', () => {
      const actions = ActionBuilder.forGenerator('component', 'TestComponent')
        .withData({ name: 'TestComponent' })
        .addMainFile()
        .addTypes()
        .addTests()
        .build();

      expect(actions).toHaveLength(3);

      // Main file
      expect(actions[0]).toEqual({
        type: 'add',
        path: '../../apps/web/components/TestComponent/{{pascalCase name}}.vue',
        templateFile: 'templates/component/component.vue.hbs',
        data: { name: 'TestComponent' },
      });

      // Types file
      expect(actions[1]).toEqual({
        type: 'add',
        path: '../../apps/web/components/TestComponent/types.ts',
        templateFile: 'templates/component/types.ts.hbs',
        data: { name: 'TestComponent' },
      });

      // Test file
      expect(actions[2]).toEqual({
        type: 'add',
        path: '../../apps/web/components/TestComponent/__tests__/{{pascalCase name}}.spec.ts',
        templateFile: 'templates/component/component.spec.ts.hbs',
        data: { name: 'TestComponent' },
      });
    });

    it('should create a composable with all files', () => {
      const actions = ActionBuilder.forGenerator('composable', 'useTestData')
        .withData({ name: 'useTestData' })
        .addMainFile()
        .addTypes()
        .addIndex()
        .addTests()
        .build();

      expect(actions).toHaveLength(4);

      // Main file
      expect(actions[0]).toEqual({
        type: 'add',
        path: '../../apps/web/composables/useTestData/{{name}}.ts',
        templateFile: 'templates/composable/composable.ts.hbs',
        data: { name: 'useTestData' },
      });

      // Types file
      expect(actions[1]).toEqual({
        type: 'add',
        path: '../../apps/web/composables/useTestData/types.ts',
        templateFile: 'templates/composable/types.ts.hbs',
        data: { name: 'useTestData' },
      });

      // Index file
      expect(actions[2]).toEqual({
        type: 'add',
        path: '../../apps/web/composables/useTestData/index.ts',
        templateFile: 'templates/composable/index.ts.hbs',
        data: { name: 'useTestData' },
      });

      // Test file
      expect(actions[3]).toEqual({
        type: 'add',
        path: '../../apps/web/composables/useTestData/__tests__/{{name}}.spec.ts',
        templateFile: 'templates/composable/composable.spec.ts.hbs',
        data: { name: 'useTestData' },
      });
    });

    it('should support custom templates', () => {
      const actions = ActionBuilder.forGenerator('component', 'CustomComponent')
        .addMainFile({ template: 'custom-component.vue.hbs' })
        .addTypes('custom-types.ts.hbs')
        .addTests({ template: 'custom-test.spec.ts.hbs' })
        .build();

      expect(actions[0].templateFile).toBe('templates/component/custom-component.vue.hbs');
      expect(actions[1].templateFile).toBe('templates/component/custom-types.ts.hbs');
      expect(actions[2].templateFile).toBe('templates/component/custom-test.spec.ts.hbs');
    });

    it('should support custom files', () => {
      const actions = ActionBuilder.forGenerator('component', 'CustomComponent')
        .addCustomFile('README.md', 'readme.md.hbs')
        .addFileToPath('/custom/path/file.ts', 'custom.ts.hbs')
        .build();

      expect(actions).toHaveLength(2);

      expect(actions[0]).toEqual({
        type: 'add',
        path: '../../apps/web/components/CustomComponent/README.md',
        templateFile: 'templates/component/readme.md.hbs',
        data: undefined,
      });

      expect(actions[1]).toEqual({
        type: 'add',
        path: '/custom/path/file.ts',
        templateFile: 'templates/component/custom.ts.hbs',
        data: undefined,
      });
    });

    it('should handle different file extensions', () => {
      const actions = ActionBuilder.forGenerator('component', 'TestComponent')
        .addMainFile({ extension: 'jsx' })
        .build();

      expect(actions[0].path).toBe('../../apps/web/components/TestComponent/{{pascalCase name}}.jsx');
    });
  });

  describe('Path Resolution', () => {
    it('should resolve component paths correctly', () => {
      const actions = ActionBuilder.forGenerator('component', 'TestComponent').addMainFile().build();

      expect(actions[0].path).toMatch(/components\/TestComponent\/{{pascalCase name}}\.vue$/);
    });

    it('should resolve composable paths correctly', () => {
      const actions = ActionBuilder.forGenerator('composable', 'useTestData').addMainFile().build();

      expect(actions[0].path).toBe('../../apps/web/composables/useTestData/{{name}}.ts');
    });
  });
});

describe('ActionBuilderPresets', () => {
  it('should create vue component preset', () => {
    const actions = ActionBuilderPresets.vueComponent('TestComponent');

    expect(actions).toHaveLength(3);
    expect(actions[0].templateFile).toBe('templates/component/component.vue.hbs');
    expect(actions[1].templateFile).toBe('templates/component/types.ts.hbs');
    expect(actions[2].templateFile).toBe('templates/component/component.spec.ts.hbs');
  });

  it('should create composable preset', () => {
    const actions = ActionBuilderPresets.composable('useTestData');

    expect(actions).toHaveLength(4);
    expect(actions[0].templateFile).toBe('templates/composable/composable.ts.hbs');
    expect(actions[1].templateFile).toBe('templates/composable/types.ts.hbs');
    expect(actions[2].templateFile).toBe('templates/composable/index.ts.hbs');
    expect(actions[3].templateFile).toBe('templates/composable/composable.spec.ts.hbs');
  });

  it('should accept custom data in presets', () => {
    const customData = { name: 'TestComponent', description: 'A test component' };
    const actions = ActionBuilderPresets.vueComponent('TestComponent', customData);

    actions.forEach((action) => {
      expect(action.data).toEqual(customData);
    });
  });
});

describe('ActionBuilder Type Safety', () => {
  it('should return correct types for fluent interface', () => {
    const builder = ActionBuilder.forGenerator('component', 'Test');

    // These should all return 'this' type for chaining
    const chainedBuilder = builder.withData({ name: 'Test' }).addMainFile().addTypes().addTests().addIndex();

    // Final build should return GeneratorAction[]
    const actions = chainedBuilder.build();

    expect(Array.isArray(actions)).toBe(true);
    expect(actions.every((action) => typeof action === 'object')).toBe(true);
  });
});
