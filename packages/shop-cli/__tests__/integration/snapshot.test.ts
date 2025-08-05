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
  createMockSettingsStructure,
  createMockPageStructure,
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

      // Generate file tree
      const fileTree = await generateFileTree(componentDir);

      // Snapshot test - this will create/compare against stored snapshot
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

  describe('Settings Structure Snapshots', () => {
    it('should match expected settings component structure', async () => {
      const settingsName = 'ProductDisplaySettings';
      const settingsDir = join(testWebAppPath, 'components', 'settings', 'product', 'display');

      await createMockSettingsStructure(settingsDir, settingsName);

      const fileTree = await generateFileTree(settingsDir);
      expect(fileTree).toMatchSnapshot('settings-product-display-structure');
    });
  });

  describe('Page Structure Snapshots', () => {
    it('should match expected page structure', async () => {
      const pageName = 'product-detail';
      const pageDir = join(testWebAppPath, 'pages');

      await createMockPageStructure(pageDir, pageName);

      const fileTree = await generateFileTree(pageDir);
      expect(fileTree).toMatchSnapshot('page-product-detail-structure');
    });
  });
});
