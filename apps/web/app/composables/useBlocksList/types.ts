import type { Block } from '@plentymarkets/shop-api';

export type BlocksListContext = 'content' | 'productCategory' | 'product' | '';

export interface BlockTemplateVariation {
  image: string;
  title: string;
  template: {
    en: Block;
    de: Block;
  };
}

export interface BlockListCategory {
  title: string;
  accessControl?: BlocksListContext;
  blockName: string;
  category: string;
  variations: BlockTemplateVariation[];
}

export type BlocksList = {
  [key: string]: BlockListCategory;
};

export interface UseBlocksList {
  blocksLists: Ref<BlocksList>;
  setBlocksListContext: (context: BlocksListContext) => void;
  getBlocksLists: () => Promise<void>;
  getBlockTemplateByLanguage: (category: string, variationIndex: number, lang: string) => Promise<Block>;
  pageHasAccessToCategory: (category: BlockListCategory) => boolean;
}

export type UseBlocksListReturn = () => UseBlocksList;
