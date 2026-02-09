import type { Block } from '@plentymarkets/shop-api';

export interface UseGlobalBlocks {
  fetchGlobalBlocks: () => Promise<void>;
  clearGlobalBlocksCache: () => void;
  globalBlocksCache: Readonly<Ref<Block[] | null>>;
}
