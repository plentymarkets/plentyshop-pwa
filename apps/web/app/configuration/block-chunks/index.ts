import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { BlockChunkMap } from './types';

const collectVueFiles = (directory: string): string[] => {
  if (!existsSync(directory)) return [];

  const entries = readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectVueFiles(fullPath);
    }

    return entry.isFile() && entry.name.endsWith('.vue') ? [fullPath] : [];
  });
};

const collectNodeModulesBlockDirs = (nodeModulesPath: string): string[] => {
  if (!existsSync(nodeModulesPath)) return [];

  const packageDirs: string[] = [];
  const directEntries = readdirSync(nodeModulesPath, { withFileTypes: true });

  directEntries.forEach((entry) => {
    if (!entry.isDirectory()) return;

    const directPath = join(nodeModulesPath, entry.name);

    if (entry.name.startsWith('@')) {
      const scopedEntries = readdirSync(directPath, { withFileTypes: true });
      scopedEntries.forEach((scopedEntry) => {
        if (scopedEntry.isDirectory()) {
          packageDirs.push(join(directPath, scopedEntry.name));
        }
      });
      return;
    }

    packageDirs.push(directPath);
  });

  return packageDirs
    .map((packageDir) => join(packageDir, 'runtime/components/blocks'))
    .filter((blockDir) => existsSync(blockDir));
};

export const buildBlockManualChunks = (projectRoot: string = process.cwd()): BlockChunkMap => {
  const chunkMap: BlockChunkMap = {};
  const blockDirs = [
    join(projectRoot, 'app/components/blocks'),
    ...collectVueFiles(join(projectRoot, 'modules'))
      .filter((file) => file.includes('/runtime/components/blocks/'))
      .map((file) => file.substring(0, file.lastIndexOf('/'))),
    ...collectNodeModulesBlockDirs(join(projectRoot, 'node_modules')),
  ];

  const uniqueBlockDirs = Array.from(new Set(blockDirs));

  uniqueBlockDirs.forEach((blockDir) => {
    collectVueFiles(blockDir).forEach((file) => {
      const blockMatch = file.match(/\/blocks\/(?:structure\/)?([^/]+)\/[^/]+\.vue$/);
      if (!blockMatch) return;

      const chunkName = `blocks-${blockMatch[1]}`;
      if (!chunkMap[chunkName]) {
        chunkMap[chunkName] = [];
      }

      chunkMap[chunkName].push(file);
    });
  });

  return chunkMap;
};

export const blockManualChunks = buildBlockManualChunks();
