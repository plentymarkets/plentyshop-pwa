export type ZLayerName =
  | 'base'
  | 'raised'
  | 'overlap'
  | 'editor-drawer'
  | 'editor-inline'
  | 'sticky'
  | 'dropdown'
  | 'notifications'
  | 'drawer-backdrop'
  | 'drawer'
  | 'cookiebar'
  | 'editor-toolbar'
  | 'modal-backdrop'
  | 'modal'
  | 'popover'
  | 'loader'
  | 'picker'
  | 'toast'
  | 'max';

export interface ZLayerOptions {
  layer: ZLayerName;
  isolate?: boolean;
}

export type ZLayerValue = ZLayerName | ZLayerOptions;
