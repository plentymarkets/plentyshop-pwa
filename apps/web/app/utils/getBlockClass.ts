import type { Block } from '@plentymarkets/shop-api';
import { useSiteSettings } from '~/composables/useSiteSettings/useSiteSettings';

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

const isExcluded = (blockName: string, excludedSet: Set<string>): boolean => {
  return excludedSet.has(blockName);
};

const hasFullWidth = (block: Block): boolean => {
  return block.content?.layout?.fullWidth ?? block.configuration?.layout?.fullWidth ?? false;
};

/**
 * Maps horizontal spacing setting to Tailwind max-width class
 */
const horizontalSpacingClassMap: Record<string, string> = {
  s: 'max-w-xl',
  m: 'max-w-2xl',
  l: 'max-w-3xl',
  xl: 'max-w-4xl',
};

/**
 * Generates CSS classes for a block based on its properties and configuration,
 * including horizontal spacing setting.
 *
 * @param block - The block to generate classes for
 * @returns Computed ref with CSS class object
 */
export const getBlockClass = (block: Block): ComputedRef<Record<string, boolean>> => {
  const { getSetting } = useSiteSettings('horizontalBlockSize');
  return computed(() => {
    const fullWidth = hasFullWidth(block);
    const isContainerExcluded = isExcluded(block.name, CONTAINER_EXCLUDED_BLOCKS);
    const isPaddingExcluded = isExcluded(block.name, PADDING_EXCLUDED_BLOCKS);

    const horizontalSpacing = getSetting();
    const horizontalClass =
      !fullWidth && !isContainerExcluded && horizontalSpacingClassMap[horizontalSpacing]
        ? horizontalSpacingClassMap[horizontalSpacing]
        : 'max-w-screen-3xl';

    return {
      [horizontalClass]: !fullWidth && !isContainerExcluded,
      'mx-auto mt-3': !isContainerExcluded,
      'px-4 md:px-6': !isPaddingExcluded,
    };
  });
};
