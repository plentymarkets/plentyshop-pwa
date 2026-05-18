import type { Block } from '@plentymarkets/shop-api';

export interface QuickAddOption {
  blockName: string;
  label: string;
  category: string;
  variationIndex: number;
}

export type InsertBlockFn = (newBlock: Block) => void;

export interface QuickAddProps {
  options: QuickAddOption[];
  getLastChild: () => Block | undefined;
  customInsert?: InsertBlockFn;
}
