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

function isNestedDirectoryStructure(content: string | MockFileStructure): content is MockFileStructure {
  return typeof content === 'object' && !Array.isArray(content);
}

/**
 * Create a mock file structure in a test directory
 */
export async function createMockFileStructure(
  testDir: TestDirectory,
  structure: MockFileStructure,
  basePath = '',
): Promise<void> {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = join(basePath, name);

    if (isNestedDirectoryStructure(content)) {
      await createMockFileStructure(testDir, content, fullPath);
    } else {
      await testDir.createFile(fullPath, content);
    }
  }
}
