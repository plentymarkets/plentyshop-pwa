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
  readonly columnWidths: readonly number[];
}

export const LAYOUT_PRESETS: readonly LayoutPreset[] = [
  { label: '1 Col', columnWidths: [12] },
  { label: '2 Equal', columnWidths: [6, 6] },
  { label: 'Sidebar L', columnWidths: [3, 9] },
  { label: 'Sidebar R', columnWidths: [9, 3] },
  { label: '3 Equal', columnWidths: [4, 4, 4] },
  { label: '4 Equal', columnWidths: [3, 3, 3, 3] },
];

export interface VariationSection {
  id: 'product' | 'category' | 'content';
  labelKey: string;
  items: FlatVariation[];
}

export const DEPTH_FORBIDDEN_CATEGORY_BLOCKS = ['MultiGrid', 'BannerCarousel', 'ImageText'] as const;

export const SINGLETON_BLOCKS = ['SortFilter', 'ItemGrid', 'Navigation'] as const;
