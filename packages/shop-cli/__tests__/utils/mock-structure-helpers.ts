/**
 * Mock file structure utilities
 * Helper functions for creating mock file structures in tests
 */

import { join } from 'path';
import { TestDirectory } from './directory-helpers';

/**
 * Mock file structure interface
 */
export interface MockFileStructure {
  [path: string]: string | MockFileStructure;
}

/**
 * Create a mock file structure in a test directory
 */
export async function createMockFileStructure(
  testDir: TestDirectory,
  structure: MockFileStructure,
  basePath = ''
): Promise<void> {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = join(basePath, name);
    
    if (typeof content === 'string') {
      await testDir.createFile(fullPath, content);
    } else {
      // It's a nested directory structure
      await createMockFileStructure(testDir, content, fullPath);
    }
  }
}
