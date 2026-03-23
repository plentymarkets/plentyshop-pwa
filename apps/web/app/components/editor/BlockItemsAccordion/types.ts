import type { Block } from '@plentymarkets/shop-api';
import type { SlideBlock } from '~/components/blocks/structure/Carousel/types';

export interface BlockItemsAccordionProps {
  items: Block[];
  itemLabels: string[];
  currentActiveIndex?: number;
  minItems?: number;
  modelValue?: boolean;
}

export interface BlockItemsAccordionEmits {
  'edit-item': [index: number];
  'select-item': [index: number];
  'add-item': [];
  'delete-item': [index: number];
  'toggle-item-visibility': [index: number];
  'update:items': [items: SlideBlock[]];
  'update:modelValue': [isOpen: boolean];
}
