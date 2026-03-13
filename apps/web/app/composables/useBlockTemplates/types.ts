import type { Ref } from 'vue';
import type { CategoryTemplate, Block } from '@plentymarkets/shop-api';
import type { FooterBlock, FooterContent, FooterSwitchDefinition } from '~/components/blocks/Footer/types';
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { HeaderBlock } from '~/components/blocks/Header/types';

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
export type ResetHeaderToSaved = () => Promise<void>;
export type ExtractFooterContentFromBlocks = (content: string) => FooterContent | null;
export type MapFooterData = (data: Block | null) => FooterBlock;
export type IsFooterBlock = (block: Block | null | undefined) => block is FooterBlock;
export type IsHeaderBlock = (block: Block | null | undefined) => block is HeaderBlock;

export type FetchHeaderContainerBlock = (force?: boolean) => Promise<HeaderContainerBlock>;
export type FetchGlobalBlocks = () => Promise<void>;
export type GetHeaderContainerBlock = () => HeaderContainerBlock;
export type CreateHeaderContainerBlock = (
  content: Block[],
  meta?: { uuid?: string; isGlobalTemplate?: boolean },
) => HeaderContainerBlock;
export type CreateDefaultHeaderContainerBlock = () => HeaderContainerBlock;
export type ClearHeaderContainerCache = () => void;
export type UpdateHeaderContainerCache = (block: HeaderContainerBlock) => void;
export type IsHeaderContainerBlock = (block: Block | null | undefined) => block is HeaderContainerBlock;

export interface UseBlockTemplates {
  data: Readonly<Ref<UseBlockTemplatesState['data']>>;
  renderableBlocks: Readonly<Ref<Block[]>>;
  cleanData: Readonly<Ref<UseBlockTemplatesState['cleanData']>>;
  categoryTemplateData: Readonly<Ref<UseBlockTemplatesState['categoryTemplateData']>>;
  loading: Readonly<Ref<boolean>>;
  footerCache: Readonly<Ref<FooterBlock | null>>;
  headerContainerCache: Ref<HeaderContainerBlock | null>;
  fetchCategoryTemplate: FetchCategoryTemplate;
  saveBlocks: SaveBlocks;
  getBlocks: GetBlocks;
  getBlocksServer: GetBlocks;
  updateBlocks: UpdateBlocks;
  setupBlocks: SetupBlocks;
  setDefaultTemplate: SetDefaultTemplate;
  fetchFooterBlock: FetchFooterBlock;
  resetFooterToSaved: ResetFooterToSaved;
  resetHeaderToSaved: ResetHeaderToSaved;
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
  fetchHeaderContainerBlock: FetchHeaderContainerBlock;
  fetchGlobalBlocks: FetchGlobalBlocks;
  getHeaderContainerBlock: GetHeaderContainerBlock;
  createHeaderContainerBlock: CreateHeaderContainerBlock;
  createDefaultHeaderContainerBlock: CreateDefaultHeaderContainerBlock;
  clearHeaderContainerCache: ClearHeaderContainerCache;
  updateHeaderContainerCache: UpdateHeaderContainerCache;
  isHeaderContainerBlock: IsHeaderContainerBlock;
  HEADER_CONTAINER_BLOCK_NAME: 'HeaderContainer';
  isHeaderBlock: IsHeaderBlock;
  HEADER_BLOCK_NAME: 'Header';
}

export type UseBlockTemplatesReturn = (
  identifier?: string,
  type?: string,
  locale?: string,
  blocks?: string,
) => UseBlockTemplates;
