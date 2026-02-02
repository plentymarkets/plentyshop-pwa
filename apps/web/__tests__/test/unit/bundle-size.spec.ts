import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'fast-glob';

/**
 * Define your limits in Kilobytes (KB)
 */
const BUDGETS = {
  entryChunk: 720,
};

const OUTPUT_DIR = path.resolve(__dirname, '../../../.output/public/_nuxt');
const BUILD_EXISTS = fs.existsSync(OUTPUT_DIR);

describe('Production Bundle Size Audit', () => {
  it.skipIf(!BUILD_EXISTS)('should ensure entry chunks are under budget', () => {
    const entryFiles = globSync(`${OUTPUT_DIR}/entry.js`);

    expect(entryFiles.length).toBeGreaterThan(0);

    entryFiles.forEach((filePath) => {
      const stats = fs.statSync(filePath);
      const sizeInKB = stats.size / 1024;
      const fileName = path.basename(filePath);

      expect(sizeInKB, `File "${fileName}" is ${sizeInKB.toFixed(2)}KB (Limit: ${BUDGETS.entryChunk}KB)`).toBeLessThan(
        BUDGETS.entryChunk,
      );
    });
  });
});
