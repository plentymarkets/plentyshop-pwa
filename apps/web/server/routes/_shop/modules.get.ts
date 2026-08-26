import { readFileSync, existsSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';

interface ManifestEntry {
  id: string;
  entry: string;
  version?: string;
  enabled?: boolean;
  settings?: Record<string, unknown>;
  privateSettings?: Record<string, unknown>;
}

const readManifest = (): ManifestEntry[] => {
  const path = resolve(process.cwd(), 'module.manifest.json');
  if (!existsSync(path)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as ManifestEntry[];
  } catch {
    return [];
  }
};

const readFlags = (): Record<string, boolean> => {
  const flagsEnv = process.env.JSON_FEATURE_FLAGS_FILE ?? '/etc/plenty/feature-flags/flags.json';
  const flagsPath = isAbsolute(flagsEnv) ? flagsEnv : resolve(process.cwd(), flagsEnv);
  if (!existsSync(flagsPath)) {
    return {};
  }
  try {
    return JSON.parse(readFileSync(flagsPath, 'utf-8')) as Record<string, boolean>;
  } catch {
    return {};
  }
};

export default defineEventHandler(() => {
  const manifest = readManifest();
  const flags = readFlags();

  return manifest.map((entry) => {
    const flagKey = `extension.${entry.id}.enabled`;
    const flagValue = flags[flagKey];
    return {
      ...entry,
      enabled: flagValue !== undefined ? flagValue : entry.enabled !== false,
    };
  });
});
