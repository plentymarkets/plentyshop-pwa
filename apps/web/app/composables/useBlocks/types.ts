import type { Block, GetBlocksResponse } from '@plentymarkets/shop-api';

export interface UseBlocksState {
  data: GetBlocksResponse;
  cleanData: GetBlocksResponse;
  defaultTemplateData: Block[];
  loading: boolean;
  isSettling: boolean;
}

export interface UseBlocks {
  data: Ref<GetBlocksResponse>;
  cleanData: Readonly<Ref<GetBlocksResponse>>;
  pageBlocks: Readonly<Ref<Block[]>>;
  /** @deprecated Use `pageBlocks` instead */
  blocks: Readonly<Ref<Block[]>>;
  allBlocks: Readonly<Ref<Block[]>>;
  headerContainer: Readonly<Ref<Block | undefined>>;
  footer: Readonly<Ref<Block | undefined>>;
  loading: Readonly<Ref<boolean>>;
  defaultTemplateData: Readonly<Ref<Block[]>>;
  fetchBlocks: (identifier: string | number, type: string) => Promise<void>;
  saveBlocks: (identifier: string | number, type: string, content: string) => Promise<boolean>;
  setupFakeBlocks: (rawBlocks: Block[], type?: string) => void;
  updateBlocks: (blocks: Block[]) => void;
  discardChanges: () => void;
  setDefaultTemplate: (blocks: Block[]) => void;
  isSettling: Ref<boolean>;
}

export type UseBlocksReturn = (localeOverride?: string) => UseBlocks;
