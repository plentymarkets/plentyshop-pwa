import type { Block } from '@plentymarkets/shop-api';

export interface QuickAddOption {
  blockName: string;
  label: string;
  category: string;
  variationIndex: number;
}

export interface QuickAddProps {
  options: QuickAddOption[];
  getLastChild: () => Block | undefined;
}
