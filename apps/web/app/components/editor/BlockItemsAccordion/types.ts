import type { Block } from '@plentymarkets/shop-api';
import type { SlideBlock } from '~/components/blocks/structure/Carousel/types';
import type { QuickAddOption } from '~/components/editor/QuickAdd/types';

export interface BlockItemsAccordionProps {
  items: Block[];
  itemLabels: string[];
  currentActiveIndex?: number;
  minItems?: number;
  modelValue?: boolean;
  quickAddOptions?: QuickAddOption[];
  getLastChild?: () => Block | undefined;
}

export interface BlockItemsAccordionEmits {
  'edit-item': [index: number];
  'select-item': [index: number];
  'add-item': [event?: MouseEvent];
  'delete-item': [index: number];
  'toggle-item-visibility': [index: number];
  'update:items': [items: SlideBlock[]];
  'update:modelValue': [isOpen: boolean];
}
