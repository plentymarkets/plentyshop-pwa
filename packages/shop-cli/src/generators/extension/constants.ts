import type { SubscriptionInterval } from './types';

/** Directory (relative to the repo root) that extensions are generated into. */
export const EXTENSIONS_DIR = 'packages';
export const EXTENSION_DIR_PREFIX = 'module-';

export const MARKETPLACE_CATEGORY = '4408';
export const MIN_PAID_PRICE = 10;
export const SHOP_CORE_VERSION_RANGE = '^1.42.0';
export const INITIAL_VERSION = '0.1.0';
export const LICENSE = 'BSD-3-Clause';

export const SUBSCRIPTION_INTERVALS: SubscriptionInterval[] = ['monthly', 'quarterly', 'half-yearly', 'yearly'];

export const AUTHOR_ICON_SIZES = [
  { name: 'icon_author_xs.png', size: 32 },
  { name: 'icon_author_sm.png', size: 256 },
  { name: 'icon_author_md.png', size: 512 },
];

export const PLUGIN_ICON_SIZES = [
  { name: 'icon_plugin_xs.png', size: 32 },
  { name: 'icon_plugin_sm.png', size: 256 },
  { name: 'icon_plugin_md.png', size: 512 },
];

export const PREVIEW_WIDTH = 1280;
export const PREVIEW_HEIGHT = 720;
export const PLACEHOLDER_COLOR = [92, 124, 250] as const;
export const DOCUMENT_LANGUAGES = ['en', 'de'] as const;
