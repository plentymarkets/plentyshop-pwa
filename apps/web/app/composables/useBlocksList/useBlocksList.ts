import type { BlocksList, BlocksListContext, BlockListCategory, UseBlocksListReturn } from './types';

const blocksLists = ref<BlocksList>({});
const blocksListContext = ref<BlocksListContext>('');

/**
 * Composable for managing Editor content blocks lists and templates.
 * Fetches, validates, and provides access control for block templates that can be added to pages.
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
   * Fetches the block lists from local assets.
   * @throws Error if fetch fails
   */
  const getBlocksLists = async () => {
    try {
      const response = await fetch('/_nuxt-plenty/editor/blocksLists.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      blocksLists.value = await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch blocksLists: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Retrieves a block template variation by category, index, and language.
   * Auto-fetches lists if needed. Returns a deep clone to prevent mutations.
   * @param category - Block category name (e.g., 'banners', 'textCards')
   * @param variationIndex - Zero-based index of the variation
   * @param lang - Language code ('de' or 'en')
   * @throws Error if category or variation not found
   */
  const getBlockTemplateByLanguage = async (category: string, variationIndex: number, lang: string) => {
    if (!blocksLists.value[category]) {
      await getBlocksLists();
    }
    const variationsInCategory = blocksLists.value[category];
    if (!variationsInCategory) throw new Error(`Category ${category} not found in blocksLists`);
    const variationToAdd = variationsInCategory.variations[variationIndex];
    if (!variationToAdd) throw new Error(`Variation ${variationIndex} not found in category ${category}`);
    const variationTemplate = variationToAdd.template;

    return JSON.parse(JSON.stringify(lang === 'de' ? variationTemplate.de : variationTemplate.en));
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
    setBlocksListContext,
    getBlocksLists,
    getBlockTemplateByLanguage,
    pageHasAccessToCategory,
  };
};
