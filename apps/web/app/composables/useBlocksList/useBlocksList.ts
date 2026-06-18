import type { Block } from '@plentymarkets/shop-api';
import type { BlocksList, BlocksListContext, BlockListCategory, UseBlocksListReturn } from './types';
import { mergeBlocksListsWithModuleContributions } from './mergeBlocksListsWithModuleContributions';
import { blocksListDefaults } from '~/utils/blocks/block-defaults';

/**
 * Block lists are assembled eagerly at module load time from the in-house
 * defaults (`public/_nuxt-plenty/editor/blocks/*.json`) plus all module
 * contributions discovered via Vite globs. No runtime fetch.
 */
const blocksLists = ref<BlocksList>(mergeBlocksListsWithModuleContributions(blocksListDefaults));
const blocksListContext = ref<BlocksListContext>('');

/**
 * Composable for managing Editor content blocks lists and templates.
 * Provides access control and template lookup for blocks that can be added to pages.
 *
 * @example
 * ```ts
 * const { blocksLists, setBlocksListContext, getBlockTemplateByLanguage } = useBlocksList();
 *
 * setBlocksListContext('content');
 * const template = await getBlockTemplateByLanguage('banners', 0, 'en');
 * ```
 */
export const useBlocksList: UseBlocksListReturn = () => {
  /**
   * Sets the page context for block access control.
   * @param context - Page context: 'content' | 'productCategory' | 'product' | ''
   */
  const setBlocksListContext = (context: BlocksListContext) => {
    blocksListContext.value = context;
  };

  /**
   * Retrieves a block template variation by category, index, and language.
   * Returns a deep clone to prevent mutations on the shared template.
   * @param category - Block category name (e.g., 'banners', 'textCards')
   * @param variationIndex - Zero-based index of the variation
   * @param lang - Language code ('de' or 'en')
   * @throws Error if category or variation not found
   */
  const getBlockTemplateByLanguage = async (category: string, variationIndex: number, lang: string) => {
    const variationsInCategory = blocksLists.value[category];
    if (!variationsInCategory) throw new Error(`Category ${category} not found in blocksLists`);
    const variationToAdd = variationsInCategory.variations[variationIndex];
    if (!variationToAdd) throw new Error(`Variation ${variationIndex} not found in category ${category}`);
    const variationTemplate = variationToAdd.template;

    // `BlockTemplate` is a stricter shape than the runtime `Block` (narrowed
    // `type`, optional `visible`) — cast at the API boundary so consumers
    // continue to receive the familiar `Block` type.
    return deepClone(lang === 'de' ? variationTemplate.de : variationTemplate.en) as unknown as Block;
  };

  /**
   * Checks if current page context has access to a block category.
   * Returns false unless access has been explicitly granted.
   * @param category - Block category to check
   */
  const pageHasAccessToCategory = (category: BlockListCategory) => {
    if (blocksListContext.value && category.accessControl) {
      return category.accessControl.includes(blocksListContext.value);
    }

    return false;
  };

  return {
    blocksLists,
    blocksListContext,
    setBlocksListContext,
    getBlockTemplateByLanguage,
    pageHasAccessToCategory,
  };
};
