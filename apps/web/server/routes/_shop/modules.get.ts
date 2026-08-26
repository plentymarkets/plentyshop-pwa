import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineEventHandler(() => {
  const path = resolve(process.cwd(), 'module.manifest.json');

  if (!existsSync(path)) {
    return [];
  }

  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return [];
  }
});
