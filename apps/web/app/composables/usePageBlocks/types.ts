import type { Block } from '@plentymarkets/shop-api';

export interface UsePageBlocksState {
  header: Block[];
  main: Block[];
  footer: Block[];
  defaultTemplateData: Block[];
  loading: boolean;
  isCachePopulated: boolean;
}

export type FetchPageBlocks = (identifier: number | string, type: string) => Promise<void>;
export type SavePageBlocks = (identifier: string | number, type: string) => Promise<boolean>;
export type SetPageBlocksDefaultTemplate = (blocks: Block[]) => void;
export type UpdateHeader = (blocks: Block[]) => void;
export type UpdateMain = (blocks: Block[]) => void;
export type UpdateFooter = (blocks: Block[]) => void;

export interface UsePageBlocks {
  header: Readonly<Ref<Block[]>>;
  main: Readonly<Ref<Block[]>>;
  footer: Readonly<Ref<Block[]>>;
  loading: Readonly<Ref<boolean>>;
  fetchPageBlocks: FetchPageBlocks;
  setDefaultTemplate: SetPageBlocksDefaultTemplate;
  savePageBlocks: SavePageBlocks;
  updateHeader: UpdateHeader;
  updateMain: UpdateMain;
  updateFooter: UpdateFooter;
}

export type UsePageBlocksReturn = (identifier?: string, type?: string, locale?: string) => UsePageBlocks;
