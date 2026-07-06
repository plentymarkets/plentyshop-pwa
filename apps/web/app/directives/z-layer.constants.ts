import type { ZLayerName } from './z-layer.types';

export const Z_LAYERS: Record<ZLayerName, number> = {
  base: 0,
  raised: 1,
  overlap: 2,
  'editor-drawer': 10,
  'editor-inline': 30,
  sticky: 40,
  dropdown: 50,
  notifications: 60,
  'drawer-backdrop': 70,
  drawer: 80,
  cookiebar: 90,
  'editor-toolbar': 100,
  'modal-backdrop': 200,
  modal: 210,
  popover: 220,
  loader: 300,
  picker: 400,
  toast: 500,
  max: 9999,
};

export type { ZLayerName };

/**
 * Container layers auto-apply `isolation: isolate` to create
 * a new stacking context that traps child z-indexes.
 */
export const ISOLATE_LAYERS: ReadonlySet<ZLayerName> = new Set([
  'editor-drawer',
  'editor-toolbar',
  'sticky',
  'drawer',
  'drawer-backdrop',
  'modal',
  'modal-backdrop',
  'loader',
  'max',
]);
