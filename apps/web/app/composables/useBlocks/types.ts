import type { Block } from '@plentymarkets/shop-api';

export type BlocksPageResponse = {
  blocks: Block[];
  HeaderContainer: Block | null;
  Footer: Block | null;
  [key: string]: Block | Block[] | null;
};

export interface UseBlocksState {
  data: BlocksPageResponse | null;
  loading: boolean;
}

export interface UseBlocks {
  blocks: Readonly<Ref<Block[]>>;
  headerContainer: Readonly<Ref<Block | null>>;
  footer: Readonly<Ref<Block | null>>;
  loading: Readonly<Ref<boolean>>;
  fetchBlocks: (identifier: string | number, type: string) => Promise<void>;
}

export type UseBlocksReturn = () => UseBlocks;
