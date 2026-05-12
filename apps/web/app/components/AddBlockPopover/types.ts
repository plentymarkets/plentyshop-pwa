import type { BlockListCategory, BlockTemplateVariation } from '~/composables/useBlocksList/types';

export interface PopoverPosition {
  left: number;
  top: number;
  opacity: number;
  arrowLeft: number;
  arrowTop: number;
  arrowDirection: 'up' | 'down';
}

export interface FlatVariation {
  category: BlockListCategory;
  variation: BlockTemplateVariation;
  idx: number;
}

export interface LayoutPreset {
  readonly label: string;
  readonly spans: readonly number[];
}

export const LAYOUT_PRESETS: readonly LayoutPreset[] = [
  { label: '1 Col', spans: [12] },
  { label: '2 Equal', spans: [6, 6] },
  { label: 'Sidebar L', spans: [3, 9] },
  { label: 'Sidebar R', spans: [9, 3] },
  { label: '3 Equal', spans: [4, 4, 4] },
  { label: '4 Equal', spans: [3, 3, 3, 3] },
];

export interface VariationSection {
  id: 'product' | 'category' | 'content';
  labelKey: string;
  items: FlatVariation[];
}

export const DEPTH_FORBIDDEN_CATEGORY_BLOCKS = ['MultiGrid', 'BannerCarousel', 'ImageText'] as const;

export const SINGLETON_BLOCKS = ['SortFilter', 'ItemGrid', 'Navigation'] as const;
