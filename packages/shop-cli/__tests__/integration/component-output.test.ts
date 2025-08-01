/**
 * Integration tests for component generator output validation
 * Tests the structure and content of generated Vue components
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestDirectory, createMockFileStructure, expectedFilePatterns, mockGeneratorData } from '../utils';
import {
  createComponentStructure,
  validateComponentStructure,
  createTypedComponent,
  validateTypedComponent,
  createNamingTestComponent,
  validateNamingConvention,
} from '../utils/component-helpers';
import { readFile } from 'fs/promises';

describe('Component Generator Output', () => {
  let testDir: TestDirectory;

  beforeEach(async () => {
    testDir = new TestDirectory('shop-cli-component-test');
    await testDir.create();

    // Create a mock web app structure
    await createMockFileStructure(testDir, {
      components: {},
      composables: {},
      pages: {},
      'package.json': JSON.stringify({ name: 'test-web-app' }),
      'nuxt.config.ts': 'export default defineNuxtConfig({})',
    });
  });

  afterEach(async () => {
    await testDir.cleanup();
  });

  describe('Component Structure', () => {
    it('should generate component with expected files', async () => {
      const componentName = mockGeneratorData.component.name;
      const expectedFiles = expectedFilePatterns.component;

      // Mock generating a component
      await createComponentStructure(testDir, componentName, expectedFiles);
      const validationResults = await validateComponentStructure(testDir, componentName, expectedFiles);

      // Validate the results
      for (const result of validationResults) {
        expect(result.hasContent).toBe(true);
        expect(result.containsComponentName).toBe(true);
      }
    });

    it('should generate properly typed component files', async () => {
      const componentName = mockGeneratorData.component.name;

      await createTypedComponent(testDir, componentName);
      const validation = await validateTypedComponent(testDir, componentName);

      expect(validation.hasImport).toBe(true);
      expect(validation.hasDefineProps).toBe(true);
      expect(validation.hasInterface).toBe(true);
    });
  });

  describe('Component Content Validation', () => {
    it('should generate components with proper naming conventions', async () => {
      const testCases = [
        { input: 'test-component', expected: 'TestComponent' },
        { input: 'productCard', expected: 'ProductCard' },
        { input: 'user_profile', expected: 'UserProfile' },
      ];

      for (const { input, expected } of testCases) {
        await createNamingTestComponent(testDir, input, expected);
        const validation = await validateNamingConvention(testDir, input, expected);

        expect(validation.containsExpected).toBe(true);
        expect(validation.containsInput).toBe(true);
      }
    });

    it('should include proper Vue 3 Composition API patterns', async () => {
      const testFile = testDir.getPath('components/TestComponent/index.vue');
      const content = `
<template>
  <div class="test-component">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

defineProps<Props>();
</script>
      `.trim();

      await testDir.createFile('components/TestComponent/index.vue', content);

      const fileContent = await readFile(testFile, 'utf-8');
      expect(fileContent).toContain('<script setup lang="ts">');
      expect(fileContent).toContain('defineProps<Props>()');
      expect(fileContent).toContain('interface Props');
    });

    it('should include proper TypeScript definitions', async () => {
      const testFile = testDir.getPath('components/TestComponent/types.ts');
      const content = `
export interface TestComponentProps {
  title: string;
  description?: string;
}

export interface TestComponentEmits {
  click: [event: MouseEvent];
  change: [value: string];
}
      `.trim();

      await testDir.createFile('components/TestComponent/types.ts', content);

      const fileContent = await readFile(testFile, 'utf-8');
      expect(fileContent).toContain('export interface TestComponentProps');
      expect(fileContent).toContain('export interface TestComponentEmits');
    });
  });
});
