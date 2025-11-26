import { productGetters } from '@plentymarkets/shop-api';
import type { Block, Product } from '@plentymarkets/shop-api';

/**
 * UUID identifying the default "Recommended Products" content block.
 *
 * This UUID is used to detect and modify the recommended products block injected by the CMS or backend.
 * Its value must match the UUID assigned to the recommended products block in the CMS configuration.
 * If the UUID changes in the backend, this constant must be updated accordingly.
 *
 * Origin: This value is hardcoded to match the UUID assigned by the PlentyONE CMS for the recommended products block.
 */

const DEFAULT_PRODUCT_RECOMMENDED_PRODUCTS_UUID = 'g7a6b5c4-d3e2-4f1a-9b8c-7d6e5f4a3b2c';

interface BlockContentWithSource {
  source: Record<string, unknown>;
  [key: string]: unknown;
}

export const hasSource = (content: unknown): content is BlockContentWithSource => {
  return (
    typeof content === 'object' &&
    content !== null &&
    'source' in content &&
    typeof (content as { source?: unknown }).source === 'object' &&
    (content as { source?: unknown }).source !== null
  );
};

/**
 * Injects the product's primary category ID into the recommended products block when using the default template.
 *
 * If the provided block is a content block with the default recommended products UUID,
 * and the product is valid, this function adds the product's primary category ID to the block's content source.
 *
 * @param block - The CMS block to potentially augment with the category ID.
 * @param product - The product whose primary category ID will be injected.
 * @returns The updated block with the category ID injected if applicable, or the original block otherwise.
 */

export const withRecommendedCategoryId = (block: Block, product: Product): Block => {
  if (
    block.type === 'content' &&
    block.meta?.uuid === DEFAULT_PRODUCT_RECOMMENDED_PRODUCTS_UUID &&
    product &&
    hasSource(block.content)
  ) {
    const categoryId = productGetters.getCategoryIds(product)[0] ?? '';
    return {
      ...block,
      content: {
        ...block.content,
        source: {
          ...block.content.source,
          categoryId,
        },
      },
    };
  }
  return block;
};
