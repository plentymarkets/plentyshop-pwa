import type { Block } from '@plentymarkets/shop-api';
import { hasGoogleMapsEmbed } from '~/utils/parseGoogleMapsHtml';

/**
 * Block names that should not have container constraints (max-width, centering)
 */
const CONTAINER_EXCLUDED_BLOCKS = new Set(['Footer']);
/**
 * Block names that should not have full width
 */
const FULLWIDTH_EXCLUDED_BLOCKS = new Set([
  'MultiGrid',
  'NewsletterSubscribe',
  'TextCard',
  'CategoryData',
  'CategorySorting',
  'BlockSort',
  'ProductRecommendedProducts',
  'ProductGrid',
  'Image',
  'ItemGrid',
  'ItemPage',
  'PriceCard',
  'ItemText',
  'TechnicalData',
  'CustomerReview',
  'ProductLegalInformation',
  'PerPageFilter',
  'Sort',
  'SortFilter',
]);
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
  'CategorySorting',
  'BlockSort',
  'ProductRecommendedProducts',
  'ProductGrid',
  'Image',
  'ItemGrid',
  'ItemPage',
  'PriceCard',
  'ItemText',
  'TechnicalData',
  'CustomerReview',
  'ProductLegalInformation',
  'PerPageFilter',
  'Sort',
  'SortFilter',
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
 * Supports two possible locations:
 * - block.content.layout.fullWidth (Banner, etc.) - defaults to false
 * - block.configuration.layout.fullWidth (TextCard, Image, etc.) - defaults to true
 *
 * @param block - The block to check
 * @returns True if fullWidth is enabled
 */
/**
 * Type guard to check if an object has a specific property
 */
const hasProperty = <K extends string>(obj: object, key: K): obj is Record<K, unknown> => {
  return key in obj;
};

/**
 * Safely extracts a nested value of a specific type from an object structure
 *
 * @param obj - The object to check (e.g., block.content or block.configuration)
 * @param path - Array of property names forming the path to the value (e.g., ['layout', 'fullWidth'])
 * @param expectedType - The expected JavaScript type ('boolean', 'string', 'number', etc.)
 * @returns The typed value if found and matches the expected type, undefined otherwise
 *
 * @example
 * ```ts
 * getNestedValue(block.content, ['layout', 'fullWidth'], 'boolean') // returns boolean | undefined
 * getNestedValue(block.configuration, ['controls', 'color'], 'string') // returns string | undefined
 * getNestedValue(block.content, ['layout', 'paddingTop'], 'number') // returns number | undefined
 * ```
 */
const getNestedValue = <T>(obj: unknown, path: string[], expectedType: string): T | undefined => {
  if (!obj || typeof obj !== 'object') return undefined;

  let current: unknown = obj;

  for (const key of path) {
    if (!current || typeof current !== 'object') return undefined;
    if (!hasProperty(current, key)) return undefined;
    current = current[key];
  }

  return typeof current === expectedType ? (current as T) : undefined;
};

/**
 * Safely extracts the fullWidth boolean from a nested object structure
 *
 * @param obj - The object to check (e.g., block.content or block.configuration)
 * @returns The fullWidth value if found, undefined otherwise
 */
const getFullWidthFromObject = (obj: unknown): boolean | undefined => {
  return getNestedValue<boolean>(obj, ['layout', 'fullWidth'], 'boolean');
};

/**
 * Checks if a block has fullWidth enabled
 *
 * Content blocks check content.layout.fullWidth
 * Structure blocks check configuration.layout.fullWidth
 *
 * @param block - The block to check
 * @returns True if fullWidth is enabled
 */
const blockContainsGoogleMaps = (block: Block): boolean => {
  if (block.name === 'TextCard') {
    const text = (block.content as { text?: { htmlDescription?: string } })?.text?.htmlDescription;
    return hasGoogleMapsEmbed(text);
  }

  if (block.name === 'MultiGrid' && Array.isArray(block.content)) {
    return block.content.some((child) => {
      if (child.name !== 'TextCard') return false;
      const text = (child.content as { text?: { htmlDescription?: string } })?.text?.htmlDescription;
      return hasGoogleMapsEmbed(text);
    });
  }

  return false;
};

const hasFullWidth = (block: Block): boolean => {
  // Content blocks have layout in content, structure blocks have it in configuration
  const fullWidth =
    block.type === 'content' ? getFullWidthFromObject(block.content) : getFullWidthFromObject(block.configuration);

  if (fullWidth !== undefined) {
    return fullWidth;
  }

  if (isExcluded(block.name, FULLWIDTH_EXCLUDED_BLOCKS)) {
    return false;
  }

  return true;
};
/**
 * Generates CSS classes for a block based on its properties and configuration
 *
 * @param block - The block to generate classes for
 * @returns Computed ref with CSS class object
 *
 * @example
 * ```ts
 * <PageBlock :class="getBlockClass(block).value">
 * ```
 */
export const getBlockClass = (block: Block): ComputedRef<Record<string, boolean>> => {
  return computed(() => {
    const fullWidth = hasFullWidth(block);
    const isContainerExcluded = isExcluded(block.name, CONTAINER_EXCLUDED_BLOCKS);
    const isPaddingExcluded = isExcluded(block.name, PADDING_EXCLUDED_BLOCKS);
    const hasMapEmbed = blockContainsGoogleMaps(block);

    return {
      'max-w-screen-3xl': !fullWidth && !isContainerExcluded && !hasMapEmbed,
      'mx-auto': !isContainerExcluded && !hasMapEmbed,
      'px-4 md:px-6': !isPaddingExcluded && !hasMapEmbed,
      'max-lg:w-full': hasMapEmbed,
      'max-lg:max-w-none': hasMapEmbed,
      'max-lg:!mx-0': hasMapEmbed,
      'max-lg:!px-0': hasMapEmbed,
    };
  });
};
