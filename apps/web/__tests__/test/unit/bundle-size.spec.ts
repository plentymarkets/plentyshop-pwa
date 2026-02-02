import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Define your limits in Kilobytes (KB)
 */
const BUDGETS = {
  entryChunk: 720,
};

const OUTPUT_DIR = path.resolve(__dirname, '../../../.output/public/_nuxt');

console.log('Dir Name', __dirname);
console.log('Bundle size audit - checking files in:', OUTPUT_DIR);
const BUILD_EXISTS = fs.existsSync(OUTPUT_DIR);

describe('Production Bundle Size Audit', () => {
  it.skipIf(!BUILD_EXISTS)('should ensure entry.js is under budget', () => {
    const entryPath = path.join(OUTPUT_DIR, 'entry.js');

    expect(fs.existsSync(entryPath), `Entry file not found at ${entryPath}`).toBe(true);

    const stats = fs.statSync(entryPath);
    const sizeInKB = stats.size / 1024;
    const fileName = path.basename(entryPath);

    expect(sizeInKB, `File "${fileName}" is ${sizeInKB.toFixed(2)}KB (Limit: ${BUDGETS.entryChunk}KB)`).toBeLessThan(
      BUDGETS.entryChunk,
    );
  });
});
