import type { Ref } from 'vue';
import type { CategoryTemplate, Block } from '@plentymarkets/shop-api';
import type { FooterBlock } from '~/components/blocks/Footer/types';
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
export type ReplaceBlock = (predicate: (block: Block) => boolean, newBlock: Block) => void;
export type IsFooterBlock = (block: Block | null | undefined) => block is FooterBlock;
export type IsHeaderBlock = (block: Block | null | undefined) => block is HeaderBlock;
export type IsHeaderContainerBlock = (block: Block | null | undefined) => block is HeaderContainerBlock;

export interface UseBlockTemplates {
  data: Readonly<Ref<UseBlockTemplatesState['data']>>;
  renderableBlocks: Readonly<Ref<Block[]>>;
  cleanData: Readonly<Ref<UseBlockTemplatesState['cleanData']>>;
  categoryTemplateData: Readonly<Ref<UseBlockTemplatesState['categoryTemplateData']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCategoryTemplate: FetchCategoryTemplate;
  saveBlocks: SaveBlocks;
  getBlocks: GetBlocks;
  getBlocksServer: GetBlocks;
  updateBlocks: UpdateBlocks;
  setupBlocks: SetupBlocks;
  setDefaultTemplate: SetDefaultTemplate;
  /** Replaces the first block matching predicate in state data */
  replaceBlock: ReplaceBlock;
  isFooterBlock: IsFooterBlock;
  isHeaderContainerBlock: IsHeaderContainerBlock;
  isHeaderBlock: IsHeaderBlock;
  isGlobalBlock: (block: Block | null | undefined) => boolean;
  FOOTER_BLOCK_NAME: 'Footer';
  HEADER_CONTAINER_BLOCK_NAME: 'HeaderContainer';
  HEADER_BLOCK_NAME: 'Header';
}

export type UseBlockTemplatesReturn = (
  identifier?: string,
  type?: string,
  locale?: string,
  blocks?: string,
) => UseBlockTemplates;
