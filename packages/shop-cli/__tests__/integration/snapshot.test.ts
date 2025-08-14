/**
 * Snapshot tests for generator file structures
 * Validates that generated files match expected structures
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import {
  createSnapshotTestDirectory,
  cleanupTestDirectory,
  createMockComponentStructure,
  createMockComposableStructure,
  generateFileTree,
} from '../utils/index.js';

describe('Generator File Structure Snapshots', () => {
  let testDir: string;
  let testWebAppPath: string;

  beforeEach(async () => {
    const testDirs = await createSnapshotTestDirectory();
    testDir = testDirs.testDir;
    testWebAppPath = testDirs.testWebAppPath;
  });

  afterEach(async () => {
    await cleanupTestDirectory(testDir);
  });

  describe('Component Structure Snapshots', () => {
    it('should match expected component file structure', async () => {
      const componentName = 'ProductCard';
      const componentDir = join(testWebAppPath, 'components', componentName);

      // Create expected component structure
      await createMockComponentStructure(componentDir, componentName);

      const fileTree = await generateFileTree(componentDir);

      expect(fileTree).toMatchSnapshot('component-product-card-structure');
    });
  });

  describe('Composable Structure Snapshots', () => {
    it('should match expected composable file structure', async () => {
      const composableName = 'useProductCart';
      const composableDir = join(testWebAppPath, 'composables', composableName);

      await createMockComposableStructure(composableDir, composableName);

      const fileTree = await generateFileTree(composableDir);
      expect(fileTree).toMatchSnapshot('composable-product-cart-structure');
    });
  });
});
