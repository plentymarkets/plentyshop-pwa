import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('composables index exports', () => {
  const dir = path.resolve(__dirname, '..');
  const indexPath = path.join(dir, 'index.ts');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  const exportedModules = Array.from(indexContent.matchAll(/export \* from '\.\/(.*?)';/g)).map((match) => match[1]);

  const fileModules = fs
    .readdirSync(dir)
    .filter((file) => /^use.*$/.test(file))
    .map((file) => file.replace(/\.ts$/, ''));

  fileModules.push('defaults');

  it('should export every use* composable file', () => {
    expect(exportedModules.sort()).toEqual(fileModules.sort());
  });
});
