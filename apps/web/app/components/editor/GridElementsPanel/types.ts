import type { Block } from '@plentymarkets/shop-api';

export interface GridElementsPanelProps {
  uuid: string;
  modelValue?: boolean;
  minItems?: number;
  customAdd?: boolean;
}

export type GridElementsPanelEmits = {
  'update:modelValue': [value: boolean];
  'edit-element': [block: Block];
  'add-element': [];
};
