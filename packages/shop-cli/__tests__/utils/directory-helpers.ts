/**
 * Test directory management utilities
 * Classes and functions for managing temporary test directories
 */

import { mkdir, rm, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

/**
 * Test directory management class
 */
export class TestDirectory {
  public path: string;

  constructor(prefix = 'shop-cli-test') {
    this.path = join(tmpdir(), `${prefix}-${Date.now()}`);
  }

  async create(): Promise<void> {
    await mkdir(this.path, { recursive: true });
  }

  async cleanup(): Promise<void> {
    if (existsSync(this.path)) {
      await rm(this.path, { recursive: true });
    }
  }

  async createFile(relativePath: string, content: string): Promise<string> {
    const fullPath = join(this.path, relativePath);
    const dir = join(fullPath, '..');
    await mkdir(dir, { recursive: true });
    await writeFile(fullPath, content);
    return fullPath;
  }

  getPath(relativePath = ''): string {
    return join(this.path, relativePath);
  }
}

/**
 * Simple directory helper functions
 */
export async function createTempTestDirectory(): Promise<string> {
  const testDir = join(tmpdir(), `shop-cli-test-${Date.now()}`);
  await mkdir(testDir, { recursive: true });
  return testDir;
}

export async function cleanupTestDirectory(testDir: string): Promise<void> {
  if (existsSync(testDir)) {
    await rm(testDir, { recursive: true });
  }
}
