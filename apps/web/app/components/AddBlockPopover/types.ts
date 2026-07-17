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
  readonly id: string;
  readonly label: string;
  readonly columnWidths: readonly number[];
}

export interface VariationSection {
  id: 'product' | 'category' | 'content';
  labelKey: string;
  items: FlatVariation[];
}
