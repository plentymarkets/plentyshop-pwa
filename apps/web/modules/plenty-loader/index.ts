/* eslint-disable no-console */
import { defineNuxtModule } from 'nuxt/kit';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Nuxt, ModuleDependencies } from '@nuxt/schema';
import type { ExtensionEntry } from './runtime/types';

function loadExtensions(rootDir: string): ExtensionEntry[] {
  const manifestPath =
    [resolve(rootDir, 'extensions-manifest.json'), resolve(rootDir, 'build/extensions-manifest.json')].find(existsSync) ?? null;

  if (!manifestPath) return [];

  try {
    const raw: unknown = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    if (!Array.isArray(raw)) return [];
    return [...raw].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  } catch {
    return [];
  }
}

const plentyLoaderModule = defineNuxtModule({
  meta: {
    name: 'plenty-loader',
    configKey: 'plentyLoader',
  },
  defaults: {},
  setup(_options, nuxt) {
    const extensions = loadExtensions(nuxt.options.rootDir);

    for (const ext of extensions) {
      if (!ext.id || !ext.entry) continue;

      if (ext.settings && Object.keys(ext.settings).length > 0) {
        nuxt.options.runtimeConfig.public[ext.id] = ext.settings;
        console.log(`[plenty-loader] Injected runtimeConfig.public.${ext.id}`);
      }
    }
  },
});

plentyLoaderModule.getModuleDependencies = (nuxt: Nuxt): ModuleDependencies => {
  const manifestPath =
    [resolve(nuxt.options.rootDir, 'extensions-manifest.json'), resolve(nuxt.options.rootDir, 'build/extensions-manifest.json')].find(
      existsSync,
    ) ?? null;

  if (!manifestPath) {
    console.log('[plenty-loader] No extensions-manifest.json found — skipping.');
    return {};
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  } catch {
    console.error('[plenty-loader] Failed to parse extensions-manifest.json — skipping.');
    return {};
  }

  if (!Array.isArray(raw) || raw.length === 0) {
    console.log('[plenty-loader] extensions-manifest.json is empty — skipping.');
    return {};
  }

  const sorted = [...raw].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  const deps: ModuleDependencies = {};

  for (const ext of sorted) {
    if (!ext.id || !ext.entry) {
      console.warn(`[plenty-loader] Skipping invalid extension entry: ${JSON.stringify(ext)}`);
      continue;
    }
    deps[ext.entry] = {};
    console.log(`[plenty-loader] Loaded extension: ${ext.entry}`);
  }

  return deps;
};

export default plentyLoaderModule;
