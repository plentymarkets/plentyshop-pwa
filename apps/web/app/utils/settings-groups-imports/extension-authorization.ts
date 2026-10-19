import type { ExtensionConfigModule } from './types';

const extensionConfigRoot = import.meta.glob('/node_modules/*/runtime/extension.config.ts', {
  eager: true,
}) as Record<string, ExtensionConfigModule>;

const extensionConfigWorkspace = import.meta.glob('@workspace/node_modules/{*,@*/*}/{,*/}runtime/extension.config.ts', {
  eager: true,
}) as Record<string, ExtensionConfigModule>;

const extensionConfigNuxtModules = import.meta.glob('~~/modules/*/runtime/extension.config.ts', {
  eager: true,
}) as Record<string, ExtensionConfigModule>;

const extensionConfigs = { ...extensionConfigRoot, ...extensionConfigWorkspace, ...extensionConfigNuxtModules };

const RUNTIME_ROOT_PATTERN = /^(.*\/runtime\/)/;

const extractRuntimeRoot = (path: string): string | null => {
  const match = path.match(RUNTIME_ROOT_PATTERN);
  return match?.[1] ?? null;
};

const extensionNameByRuntimeRoot: Record<string, string> = {};

Object.entries(extensionConfigs).forEach(([path, configModule]) => {
  const runtimeRoot = extractRuntimeRoot(path);
  const name = configModule.default?.name;

  if (runtimeRoot && name) {
    extensionNameByRuntimeRoot[runtimeRoot] = name;
  }
});

/**
 * Determines whether a settings component glob path belongs to an active extension.
 * Only packages that declare their own `runtime/extension.config.ts` (via `defineExtensionConfig`)
 * are gated through `isExtensionAuthorized`. Everything else - first-party components, built-in
 * modules without an extension config, and agency-local modules under `~~/modules` - is always
 * authorized, since it was never part of the backend-driven extension registry to begin with.
 */
export const isSettingsPathAuthorized = (path: string): boolean => {
  const runtimeRoot = extractRuntimeRoot(path);
  const extensionName = runtimeRoot ? extensionNameByRuntimeRoot[runtimeRoot] : undefined;

  if (!extensionName) {
    return true;
  }

  return isExtensionAuthorized(extensionName);
};
