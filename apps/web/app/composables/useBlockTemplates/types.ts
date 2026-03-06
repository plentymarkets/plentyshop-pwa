import type { Ref } from 'vue';
import type { CategoryTemplate, Block } from '@plentymarkets/shop-api';
import type { FooterBlock, FooterContent, FooterSwitchDefinition } from '~/components/blocks/Footer/types';

export interface UseBlockTemplatesState {
  data: Block[];
  cleanData: Block[];
  categoryTemplateData: CategoryTemplate | null;
  defaultTemplateData: Block[];
  loading: boolean;
}

export type FetchCategoryTemplate = (categoryId: number) => Promise<void>;
export type SaveBlocks = (identifier: string | number, type: string, content: string) => Promise<boolean>;
export type GetBlocks = (identifier: number | string, type: string, block?: string) => Promise<void>;
export type UpdateBlocks = (blocks: Block[]) => void;
export type SetupBlocks = (blocks: Block[]) => void;
export type SetDefaultTemplate = (blocks: Block[]) => void;
export type FetchFooterBlock = () => Promise<FooterBlock>;
export type GetFooterBlock = () => FooterBlock;
export type CreateFooterBlock = (
  content: FooterContent,
  meta?: { uuid?: string; isGlobalTemplate?: boolean },
) => FooterBlock;
export type CreateDefaultFooterBlock = () => FooterBlock;
export type ClearFooterCache = () => void;
export type UpdateFooterCache = (newFooterBlock: FooterBlock) => void;
export type ResetFooterToSaved = () => Promise<void>;
export type ExtractFooterContentFromBlocks = (content: string) => FooterContent | null;
export type MapFooterData = (data: Block | null) => FooterBlock;
export type IsFooterBlock = (block: Block | null | undefined) => block is FooterBlock;

export interface UseBlockTemplates {
  data: Readonly<Ref<UseBlockTemplatesState['data']>>;
  cleanData: Readonly<Ref<UseBlockTemplatesState['cleanData']>>;
  categoryTemplateData: Readonly<Ref<UseBlockTemplatesState['categoryTemplateData']>>;
  loading: Readonly<Ref<boolean>>;
  footerCache: Readonly<Ref<FooterBlock | null>>;
  fetchCategoryTemplate: FetchCategoryTemplate;
  saveBlocks: SaveBlocks;
  getBlocks: GetBlocks;
  getBlocksServer: GetBlocks;
  updateBlocks: UpdateBlocks;
  setupBlocks: SetupBlocks;
  setDefaultTemplate: SetDefaultTemplate;
  fetchFooterBlock: FetchFooterBlock;
  resetFooterToSaved: ResetFooterToSaved;
  getFooterBlock: GetFooterBlock;
  createDefaultFooterBlock: CreateDefaultFooterBlock;
  createFooterBlock: CreateFooterBlock;
  clearFooterCache: ClearFooterCache;
  updateFooterCache: UpdateFooterCache;
  extractFooterContentFromBlocks: ExtractFooterContentFromBlocks;
  mapFooterData: MapFooterData;
  isFooterBlock: IsFooterBlock;
  FOOTER_BLOCK_NAME: 'Footer';
  FOOTER_SWITCH_DEFINITIONS: FooterSwitchDefinition[];
}

export type UseBlockTemplatesReturn = (
  identifier?: string,
  type?: string,
  locale?: string,
  blocks?: string,
) => UseBlockTemplates;
