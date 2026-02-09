import type { Block } from '@plentymarkets/shop-api';

export interface UseHeader {
  headerCache: Ref<Block[] | null>;
  fetchHeaderBlocks: () => Promise<Block[]>;
  getHeaderBlocks: () => Block[];
  clearHeaderCache: () => void;
  updateHeaderCache: (headerBlocks: Block[]) => void;
}
