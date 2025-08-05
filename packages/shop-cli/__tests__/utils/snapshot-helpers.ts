/**
 * Snapshot testing helper functions
 * Utilities for snapshot testing of file structures
 */

import { mkdir, writeFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export interface FileTreeNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
  size?: number;
}

export async function createSnapshotTestDirectory(): Promise<{ testDir: string; testWebAppPath: string }> {
  const testDir = join(tmpdir(), `shop-cli-snapshot-test-${Date.now()}`);
  const testWebAppPath = join(testDir, 'web-app');

  await mkdir(testWebAppPath, { recursive: true });

  return { testDir, testWebAppPath };
}

export async function createMockComponentStructure(componentDir: string, componentName: string): Promise<void> {
  await mkdir(componentDir, { recursive: true });
  await mkdir(join(componentDir, '__tests__'), { recursive: true });

  const files = [`${componentName}.vue`, 'types.ts', 'index.ts', `__tests__/${componentName}.spec.ts`];

  for (const file of files) {
    await writeFile(join(componentDir, file), `// Mock ${file} content`);
  }
}

export async function createMockComposableStructure(composableDir: string, composableName: string): Promise<void> {
  await mkdir(composableDir, { recursive: true });
  await mkdir(join(composableDir, '__tests__'), { recursive: true });

  const files = [`${composableName}.ts`, 'types.ts', 'index.ts', `__tests__/${composableName}.spec.ts`];

  for (const file of files) {
    await writeFile(join(composableDir, file), `// Mock ${file} content`);
  }
}

export async function createMockSettingsStructure(settingsDir: string, settingsName: string): Promise<void> {
  await mkdir(settingsDir, { recursive: true });
  await mkdir(join(settingsDir, '__tests__'), { recursive: true });

  const files = [`${settingsName}.vue`, 'ToolbarTrigger.vue', 'types.ts', `__tests__/${settingsName}.spec.ts`];

  for (const file of files) {
    await writeFile(join(settingsDir, file), `// Mock ${file} content`);
  }
}

export async function createMockPageStructure(pageDir: string, pageName: string): Promise<void> {
  await mkdir(pageDir, { recursive: true });

  const files = [`${pageName}.vue`, '[slug].vue'];

  for (const file of files) {
    await writeFile(join(pageDir, file), `// Mock ${file} content`);
  }
}

export async function generateFileTree(dirPath: string): Promise<FileTreeNode> {
  const stats = await stat(dirPath);
  const name = dirPath.split('/').pop() || '';

  if (stats.isFile()) {
    return {
      name,
      type: 'file',
      size: stats.size,
    };
  }

  if (stats.isDirectory()) {
    const children: FileTreeNode[] = [];
    const entries = await readdir(dirPath);

    for (const entry of entries.sort()) {
      const entryPath = join(dirPath, entry);
      const childNode = await generateFileTree(entryPath);
      children.push(childNode);
    }

    return {
      name,
      type: 'directory',
      children,
    };
  }

  throw new Error(`Unknown file type: ${dirPath}`);
}
