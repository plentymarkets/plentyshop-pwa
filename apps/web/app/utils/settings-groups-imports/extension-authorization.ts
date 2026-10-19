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

/**
 * Extracts the directory prefix up to and including `runtime/` from a glob-matched path, used to
 * correlate a settings component with the `extension.config.ts` of the package it was loaded from.
 */
export const extractRuntimeRoot = (path: string): string | null => {
  const match = path.match(RUNTIME_ROOT_PATTERN);
  return match?.[1] ?? null;
};

/**
 * Builds a lookup of declared extension name by runtime-root directory from a set of
 * `extension.config.ts` glob results.
 */
export const buildExtensionNameByRuntimeRoot = (
  configs: Record<string, ExtensionConfigModule>,
): Record<string, string> => {
  const nameByRuntimeRoot: Record<string, string> = {};

  Object.entries(configs).forEach(([path, configModule]) => {
    const runtimeRoot = extractRuntimeRoot(path);
    const name = configModule.default?.name;

    if (runtimeRoot && name) {
      nameByRuntimeRoot[runtimeRoot] = name;
    }
  });

  return nameByRuntimeRoot;
};

const extensionNameByRuntimeRoot = buildExtensionNameByRuntimeRoot(extensionConfigs);

/**
 * Determines whether a settings component glob path belongs to an active extension.
 * Only packages that declare their own `runtime/extension.config.ts` (via `defineExtensionConfig`)
 * are gated through `isExtensionAuthorized`. Everything else - first-party components, built-in
 * modules without an extension config, and agency-local modules under `~~/modules` - is always
 * authorized, since it was never part of the backend-driven extension registry to begin with.
 */
export const isSettingsPathAuthorized = (
  path: string,
  nameByRuntimeRoot: Record<string, string> = extensionNameByRuntimeRoot,
): boolean => {
  const runtimeRoot = extractRuntimeRoot(path);
  const extensionName = runtimeRoot ? nameByRuntimeRoot[runtimeRoot] : undefined;

  if (!extensionName) {
    return true;
  }

  return isExtensionAuthorized(extensionName);
};
