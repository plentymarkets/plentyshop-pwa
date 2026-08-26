import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

interface PatchBody {
  id: string;
  enabled: boolean;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<PatchBody>(event);

  if (!body?.id || typeof body.enabled !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'id and enabled are required' });
  }

  const path = resolve(process.cwd(), 'module.manifest.json');

  if (!existsSync(path)) {
    throw createError({ statusCode: 404, statusMessage: 'module.manifest.json not found' });
  }

  let manifest: unknown[];

  try {
    manifest = JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to read module.manifest.json' });
  }

  const entry = manifest.find((m): m is Record<string, unknown> => !!m && typeof m === 'object' && (m as Record<string, unknown>).id === body.id);

  if (!entry) {
    throw createError({ statusCode: 404, statusMessage: `Module "${body.id}" not found in manifest` });
  }

  entry.enabled = body.enabled;

  writeFileSync(path, JSON.stringify(manifest, null, 2) + '\n');

  return entry;
});
