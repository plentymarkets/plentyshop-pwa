import { readFile } from 'node:fs/promises';
import { createError, defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
  const filePath = process.env.JSON_FEATURE_FLAGS_FILE ?? '/etc/plenty/feature-flags/flags.json';

  try {
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    throw createError({ statusCode: 404, message: `Feature flags file not found: ${filePath}` });
  }
});
