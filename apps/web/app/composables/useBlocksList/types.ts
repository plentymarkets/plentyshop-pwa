import type { Block } from '@plentymarkets/shop-api';

export type BlocksListContext = 'content' | 'productCategory' | 'product' | '';

/**
 * Non-empty page contexts that can be granted access to a block category.
 */
export type BlockListAccessContext = Exclude<BlocksListContext, ''>;

/**
 * Free-form content payload of a content block. Each block component defines its
 * own concrete shape; module authors typed in their own `blocks-list.ts`.
 */
export type BlockContent = Record<string, unknown>;

/**
 * Strict template structure used in `blocks-list.ts` contributions.
 * Mirrors the runtime Block shape but enforces the known invariants
 * (discriminated `type`, mandatory `meta.uuid`, narrowed `content`).
 *
 * Structurally compatible with `Block` from `@plentymarkets/shop-api`,
 * so values typed as `BlockTemplate` can flow into runtime APIs that
 * expect `Block` without casting.
 */
export interface BlockTemplate {
  name: string;
  type: 'content' | 'structure';
  meta: {
    uuid: string;
    isGlobalTemplate?: boolean;
  };
  configuration?: {
    visible?: boolean;
    [key: string]: unknown;
  };
  parent_slot?: number;
  /**
   * Content blocks: free-form record specific to the block component.
   * Structure blocks (e.g. Carousel): array of nested templates.
   */
  content: BlockContent | BlockTemplate[];
}

export interface BlockTemplateVariation {
  image: string;
  title: string;
  template: {
    en: BlockTemplate;
    de: BlockTemplate;
  };
}

export interface BlockListCategory {
  title: string;
  /** Page contexts in which this category is offered. Empty/missing => not shown. */
  accessControl?: BlockListAccessContext[];
  blockName: string;
  category: string;
  variations: BlockTemplateVariation[];
}

export type BlocksList = {
  [key: string]: BlockListCategory;
};

export type BlocksListContribution = Partial<BlocksList>;

export interface UseBlocksList {
  blocksLists: Ref<BlocksList>;
  blocksListContext: Ref<BlocksListContext>;
  setBlocksListContext: (context: BlocksListContext) => void;
  getBlockTemplateByLanguage: (category: string, variationIndex: number, lang: string) => Promise<Block>;
  pageHasAccessToCategory: (category: BlockListCategory) => boolean;
}

export type UseBlocksListReturn = () => UseBlocksList;
