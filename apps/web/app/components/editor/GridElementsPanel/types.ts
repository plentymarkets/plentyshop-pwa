import type { Block } from '@plentymarkets/shop-api';
import type { QuickAddOption } from '~/components/editor/QuickAdd/types';

export interface GridElementsPanelProps {
  uuid: string;
  modelValue?: boolean;
  minItems?: number;
  customAdd?: boolean;
  quickAddOptions?: QuickAddOption[];
  sectionLabel?: string;
  addButtonLabel?: string;
}

export type GridElementsPanelEmits = {
  'update:modelValue': [value: boolean];
  'edit-element': [block: Block];
  'add-element': [];
  'insert-before': [block: Block, anchorEl: HTMLElement];
};
