import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const LANG_DIR = path.resolve(__dirname, '../../../app/lang');
const MAX_DEPTH = 5;

function getJsonFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f: string) => f.endsWith('.json'))
    .map((f: string) => path.join(dir, f));
}

function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function findTooDeepKeys(obj: Record<string, unknown>): string[] {
  const stack: Array<{ node: Record<string, unknown>; depth: number; path: string[] }> = [
    { node: obj, depth: 1, path: [] },
  ];
  const result: string[] = [];
  while (stack.length) {
    const { node, depth, path } = stack.pop()!;
    if (depth > MAX_DEPTH) {
      result.push(path.join('.'));
      continue;
    }
    for (const key in node) {
      if (isObject(node[key])) {
        stack.push({ node: node[key] as Record<string, unknown>, depth: depth + 1, path: [...path, key] });
      }
    }
  }
  return result;
}

function findOrphanKeys(obj: Record<string, unknown>): string[] {
  const stack: Array<{ node: Record<string, unknown>; parentKeys: string[]; path: string[] }> = [
    { node: obj, parentKeys: [], path: [] },
  ];
  const result: string[] = [];
  while (stack.length) {
    const { node, parentKeys, path } = stack.pop()!;
    for (const key in node) {
      const value = node[key];
      if (isObject(value)) {
        if (parentKeys.length === 0 && Object.keys(value).length === 0) {
          result.push([...path, key].join('.'));
        }
        stack.push({ node: value as Record<string, unknown>, parentKeys: [...parentKeys, key], path: [...path, key] });
      } else {
        if (parentKeys.length === 0) {
          result.push([...path, key].join('.'));
        }
      }
    }
  }
  return result;
}

describe('localization JSON structure', () => {
  const files = getJsonFiles(LANG_DIR);
  files.forEach((file) => {
    const json = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (Object.keys(json).length === 0) return;

    it(`${path.basename(file)}: max ${MAX_DEPTH} levels deep`, () => {
      const tooDeep = findTooDeepKeys(json);

      if (tooDeep.length) {
        throw new Error(
          `Language file '${path.basename(file)}' has the following problems:\n    - keys '${tooDeep.join(', ')}' have more than ${MAX_DEPTH} levels depth`,
        );
      }
      expect(tooDeep.length).toBe(0);
    });

    it(`${path.basename(file)}: every key has a parent`, () => {
      const orphans = findOrphanKeys(json);

      if (orphans.length) {
        throw new Error(
          `Language file '${path.basename(file)}' has the following problems:\n    - keys '${orphans.join(', ')}' do not have a parent`,
        );
      }
      expect(orphans.length).toBe(0);
    });
  });
});
