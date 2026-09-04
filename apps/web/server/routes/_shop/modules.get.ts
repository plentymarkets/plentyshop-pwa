import { readFileSync, existsSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';

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

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event);
  const extensions = (runtimeConfig.shopCoreExtensions ?? []) as Array<{ id: string; version: string | null }>;
  const flags = readFlags();

  return extensions.map((ext) => {
    const flagKey = `extension.${ext.id}.enabled`;
    const flagValue = flags[flagKey];
    return {
      id: ext.id,
      version: ext.version,
      enabled: flagValue !== undefined ? flagValue : true,
    };
  });
});
