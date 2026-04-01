/* eslint-disable no-console */
import { defineNuxtModule, installModule } from 'nuxt/kit';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ExtensionEntry } from './runtime/types';

export default defineNuxtModule({
  meta: {
    name: 'plenty-loader',
    configKey: 'plentyLoader',
  },
  defaults: {},
  async setup(_options, nuxt) {
    const manifestPath =
      [resolve(nuxt.options.rootDir, 'extensions-manifest.json'), resolve(nuxt.options.rootDir, 'build/extensions-manifest.json')].find(
        existsSync,
      ) ?? null;

    if (!manifestPath) {
      console.log('[plenty-loader] No extensions-manifest.json found — skipping.');
      return;
    }

    let extensions: ExtensionEntry[] = [];

    try {
      extensions = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    } catch {
      console.error('[plenty-loader] Failed to parse extensions-manifest.json — skipping.');
      return;
    }

    if (!Array.isArray(extensions) || extensions.length === 0) {
      console.log('[plenty-loader] extensions-manifest.json is empty — skipping.');
      return;
    }

    const sorted = [...extensions].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));

    for (const ext of sorted) {
      if (!ext.id || !ext.entry) {
        console.warn(`[plenty-loader] Skipping invalid extension entry: ${JSON.stringify(ext)}`);
        continue;
      }

      try {
        await installModule(ext.entry, {}, nuxt);
        console.log(`[plenty-loader] Loaded extension: ${ext.entry}`);
      } catch (error) {
        console.error(`[plenty-loader] Failed to load extension "${ext.entry}":`, error);
        continue;
      }

      if (ext.settings && Object.keys(ext.settings).length > 0) {
        nuxt.options.runtimeConfig.public[ext.id] = ext.settings;
        console.log(`[plenty-loader] Injected runtimeConfig.public.${ext.id}`);
      }
    }
  },
});
