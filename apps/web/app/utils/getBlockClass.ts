import type { Block } from '@plentymarkets/shop-api';

/**
 * Block names that should not have container constraints (max-width, centering)
 */
const CONTAINER_EXCLUDED_BLOCKS = new Set(['Footer']);

/**
 * Block names that should not have padding applied
 */
const PADDING_EXCLUDED_BLOCKS = new Set([
  'NewsletterSubscribe',
  'MultiGrid',
  'TextCard',
  'Footer',
  'Carousel',
  'CategoryData',
  'SortFilter',
  'ProductRecommendedProducts',
  'ProductGrid',
  'Image',
  'ItemGrid',
  'ItemPage',
  'PriceCard',
  'ItemText',
  'TechnicalData',
  'CustomerReview',
  'ProductLegalInformation'
]);

/**
 * Checks if a block name is in the excluded set
 *
 * @param blockName - The name of the block to check
 * @param excludedSet - Set of excluded block names
 * @returns True if the block is excluded
 */
const isExcluded = (blockName: string, excludedSet: Set<string>): boolean => {
  return excludedSet.has(blockName);
};

/**
 * Checks if a block has fullWidth enabled in any of its layout locations
 *
 * Supports three possible locations:
 * - block.content.layout.fullWidth (Banner, etc.)
 * - block.layout.fullWidth (standard blocks)
 * - block.configuration.layout.fullWidth (MultiGrid, etc.)
 *
 * @param block - The block to check
 * @returns True if fullWidth is enabled
 */
const hasFullWidth = (block: Block): boolean => {
  return block.content?.layout?.fullWidth ?? block.configuration?.layout?.fullWidth ?? false;
};

/**
 * Generates CSS classes for a block based on its properties and configuration
 *
 * @param block - The block to generate classes for
 * @returns Computed ref with CSS class object
 *
 * @example
 * ```ts
 * const blockClasses = getBlockClass(block);
 * <div :class="blockClasses.value">...</div>
 * ```
 */
export const getBlockClass = (block: Block): ComputedRef<Record<string, boolean>> => {
  return computed(() => {
    const fullWidth = hasFullWidth(block);
    const isContainerExcluded = isExcluded(block.name, CONTAINER_EXCLUDED_BLOCKS);
    const isPaddingExcluded = isExcluded(block.name, PADDING_EXCLUDED_BLOCKS);

    return {
      'max-w-screen-3xl': !fullWidth && !isContainerExcluded,
      'mx-auto mt-3': !isContainerExcluded,
      'px-4 md:px-6': !isPaddingExcluded,
    };
  });
};
