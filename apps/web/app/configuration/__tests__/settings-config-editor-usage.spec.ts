import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import settingsConfig from '../settings.config';
import { GUARANTEE_NOTICE_DISPLAY_MODE_SETTING } from '../../utils/checkout/guarantee-notice-display-mode';

// Keys that are intentionally read-only in the editor (legacy settings kept for backward-compatible
// reads) and therefore never appear behind an updateSetting() call. Resolve each setting's inline
// fallback when reading, so it does not need a default in settings.config.ts.
const KEYS_WITHOUT_EDITOR_WRITE = new Set(['showGuaranteeNotice']);

// useSiteSettings() is sometimes called with an identifier instead of a string literal
// (e.g. an imported constant for a settings key shared between read and write).
const DYNAMIC_KEY_IDENTIFIERS: Record<string, string> = {
  GUARANTEE_NOTICE_DISPLAY_MODE_SETTING,
};

const settingsDir = path.resolve(__dirname, '../../components/settings');

const collectVueFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectVueFiles(entryPath);
    }
    return entry.name.endsWith('.vue') ? [entryPath] : [];
  });

/**
 * Scans every settings editor component for setting keys that are actually written via
 * updateSetting(). Used to guard settings.config.ts against defining keys the editor never
 * sets (dead defaults) and against the editor writing keys with no default (silent save gaps).
 */
const collectKeysWrittenInEditor = (): Set<string> => {
  const writtenKeys = new Set<string>();

  for (const file of collectVueFiles(settingsDir)) {
    const source = fs.readFileSync(file, 'utf-8');
    if (!source.includes('updateSetting')) {
      continue;
    }

    for (const match of source.matchAll(/useSiteSettings\(\s*'([a-zA-Z0-9_]+)'\s*,?\s*\)/g)) {
      const key = match[1];
      if (key) {
        writtenKeys.add(key);
      }
    }

    for (const match of source.matchAll(/useSiteSettings\(\s*([A-Z0-9_]+)\s*\)/g)) {
      const identifier = match[1];
      const resolvedKey = identifier ? DYNAMIC_KEY_IDENTIFIERS[identifier] : undefined;
      if (resolvedKey) {
        writtenKeys.add(resolvedKey);
      }
    }

    // A handful of components iterate a local array of setting keys, e.g.
    // `settings.forEach((key) => { const { updateSetting } = useSiteSettings(key); ... })`.
    if (/useSiteSettings\(\s*key\s*\)/.test(source)) {
      for (const arrayLiteral of source.matchAll(/\[([^[\]]*)\]/g)) {
        const literalGroup = arrayLiteral[1];
        if (!literalGroup) {
          continue;
        }
        for (const entry of literalGroup.matchAll(/'([a-zA-Z0-9_]+)'/g)) {
          const key = entry[1];
          if (key) {
            writtenKeys.add(key);
          }
        }
      }
    }
  }

  return writtenKeys;
};

describe('settings.config.ts editor usage', () => {
  const writtenKeys = collectKeysWrittenInEditor();
  const configKeys = Object.keys(settingsConfig);

  it('does not define a default for a setting that is never set in the editor', () => {
    const deadKeys = configKeys.filter((key) => !writtenKeys.has(key));

    expect(deadKeys).toEqual([]);
  });

  it('provides a default for every setting that the editor sets', () => {
    const configKeySet = new Set(configKeys);
    const missingDefaults = [...writtenKeys].filter(
      (key) => !configKeySet.has(key) && !KEYS_WITHOUT_EDITOR_WRITE.has(key),
    );

    expect(missingDefaults).toEqual([]);
  });
});
