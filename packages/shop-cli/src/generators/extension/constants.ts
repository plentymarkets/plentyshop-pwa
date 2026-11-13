import type { SubscriptionInterval } from './types';

/** Directory (relative to the repo root) that extensions are generated into and the template lives in. */
export const EXTENSIONS_DIR = 'packages';
export const EXTENSION_DIR_PREFIX = 'module-';

export const MIN_PAID_PRICE = 10;

export const SUBSCRIPTION_INTERVALS: SubscriptionInterval[] = ['monthly', 'quarterly', 'half-yearly', 'yearly'];

/**
 * The values the hello-world template (`packages/module-hello-world`) was written with.
 * The generator replaces exactly these strings with the wizard answers, so they must stay in sync
 * with the template files (a unit test verifies that every value is still present in the template).
 */
export const TEMPLATE_VALUES = {
  name: '@plentymarkets/hello-world',
  displayNameEn: 'Hello World',
  displayNameDe: 'Hallo Welt',
  descriptionEn: 'A minimal example extension that shows how a marketplace extension is structured.',
  descriptionDe: 'Eine minimale Beispiel-Extension, die den Aufbau einer Marketplace-Extension zeigt.',
  supportEmail: 'support@example.com',
} as const;

/** Files and folders of the template that are never copied (local build output and tooling caches). */
export const TEMPLATE_IGNORED_ENTRIES = new Set([
  'node_modules',
  'dist',
  '.nuxt',
  '.output',
  '.nitro',
  '.cache',
  '.turbo',
  '.data',
  '.DS_Store',
]);

/** File extensions that are copied byte for byte instead of having their placeholders replaced. */
export const BINARY_FILE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico']);
