import type { Block } from '@plentymarkets/shop-api';

export interface FlatBlock {
  uuid: string;
  label: string;
  depth: number;
  block: Block;
}
