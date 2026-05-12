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
