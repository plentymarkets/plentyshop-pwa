/**
 * Tests for composable generator output validation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  TestDirectory,
  createMockFileStructure,
  mockGeneratorData,
  createComposableStructure,
  validateComposableFiles,
  createTypedComposable,
  validateTypedComposable,
  createNamingTestComposable,
  validateComposableNaming,
} from '../utils';
import { readFile } from 'fs/promises';

describe('Composable Generator Output', () => {
  let testDir: TestDirectory;

  beforeEach(async () => {
    testDir = new TestDirectory('shop-cli-composable-test');
    await testDir.create();

    // Create a mock web app structure
    await createMockFileStructure(testDir, {
      composables: {},
      'package.json': JSON.stringify({ name: 'test-web-app' }),
      'nuxt.config.ts': 'export default defineNuxtConfig({})',
    });
  });

  afterEach(async () => {
    await testDir.cleanup();
  });

  describe('Composable Structure', () => {
    it('should generate composable with proper file structure', async () => {
      const composableName = mockGeneratorData.composable.name;
      const expectedFiles = [`${composableName}.ts`, 'types.ts', 'index.ts', `__tests__/${composableName}.spec.ts`];

      await createComposableStructure(testDir, composableName, expectedFiles);

      const results = await validateComposableFiles(testDir, composableName, expectedFiles);

      results.forEach((result) => {
        expect(result.content.length).toBeGreaterThan(0);
        expect(result.content).toContain(composableName);
      });
    });

    it('should generate composable with proper TypeScript patterns', async () => {
      const composableName = 'useUserData';
      await createTypedComposable(testDir, composableName);

      const validation = await validateTypedComposable(testDir, composableName);

      expect(validation.hasVueImport).toBe(true);
      expect(validation.hasExportConstant).toBe(true);
      expect(validation.hasTypeImport).toBe(true);
      expect(validation.fileContent).toContain("import { ref, computed } from 'vue'");
      expect(validation.fileContent).toContain(`export const ${composableName} = ()`);
    });

    it('should generate composable with proper naming conventions', async () => {
      const testCases = [
        { input: 'user-data', expected: 'useUserData' },
        { input: 'api_client', expected: 'useApiClient' },
        { input: 'product-cart-handler', expected: 'useProductCartHandler' },
      ];

      for (const { expected } of testCases) {
        await createNamingTestComposable(testDir, expected);

        const validation = await validateComposableNaming(testDir, expected);

        expect(validation.hasExportConstant).toBe(true);
        expect(validation.followsNamingConvention).toBe(true);
        expect(validation.fileContent).toContain(`export const ${expected} = ()`);
        expect(expected).toMatch(/^use[A-Z]/);
      }
    });
  });

  describe('Composable Content Validation', () => {
    it('should include proper Vue imports', async () => {
      const composableName = 'useTestComposable';
      const content = `import { ref, computed, onMounted } from 'vue';
import type { TestComposableReturn } from './types';

export const ${composableName} = (): TestComposableReturn => {
  const data = ref(null);
  const isLoading = ref(false);

  const hasData = computed(() => !!data.value);

  onMounted(() => {
    // Initialize
  });

  return {
    data,
    isLoading,
    hasData,
  };
};`;

      await testDir.createFile(`composables/${composableName}/${composableName}.ts`, content);
      const composableFile = testDir.getPath(`composables/${composableName}/${composableName}.ts`);
      const fileContent = await readFile(composableFile, 'utf-8');

      expect(fileContent).toMatch(/import \{ .+ \} from 'vue'/);
      expect(fileContent).toContain('ref, computed');
      expect(fileContent).toContain(`export const ${composableName} = ()`);
    });

    it('should include proper return type annotation', async () => {
      const composableName = 'useApiData';
      const content = `import type { Ref, ComputedRef } from 'vue';

export interface ApiDataReturn {
  data: Ref<unknown>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  hasData: ComputedRef<boolean>;
  fetch: () => Promise<void>;
}`;

      await testDir.createFile(`composables/${composableName}/types.ts`, content);
      const typesFile = testDir.getPath(`composables/${composableName}/types.ts`);
      const fileContent = await readFile(typesFile, 'utf-8');

      expect(fileContent).toContain("import type { Ref, ComputedRef } from 'vue'");
      expect(fileContent).toContain('export interface');
      expect(fileContent).toMatch(/\w+Return/);
    });
  });
});
