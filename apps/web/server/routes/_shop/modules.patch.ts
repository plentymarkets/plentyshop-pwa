import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';

interface PatchBody {
  id: string;
  enabled: boolean;
}

const getFlagsPath = (): string => {
  const flagsEnv = process.env.JSON_FEATURE_FLAGS_FILE ?? '/etc/plenty/feature-flags/flags.json';
  return isAbsolute(flagsEnv) ? flagsEnv : resolve(process.cwd(), flagsEnv);
};

export default defineEventHandler(async (event) => {
  const body = await readBody<PatchBody>(event);

  if (!body?.id || typeof body.enabled !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'id and enabled are required' });
  }

  const flagsPath = getFlagsPath();
  let flags: Record<string, unknown> = {};

  if (existsSync(flagsPath)) {
    try {
      flags = JSON.parse(readFileSync(flagsPath, 'utf-8')) as Record<string, unknown>;
    } catch {
      throw createError({ statusCode: 500, statusMessage: 'Failed to read feature flags file' });
    }
  }

  flags[`extension.${body.id}.enabled`] = body.enabled;

  writeFileSync(flagsPath, JSON.stringify(flags, null, 2) + '\n');

  return { id: body.id, enabled: body.enabled };
});
