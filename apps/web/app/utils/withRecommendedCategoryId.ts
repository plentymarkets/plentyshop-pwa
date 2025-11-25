import { productGetters } from '@plentymarkets/shop-api';
import type { Block, Product } from '@plentymarkets/shop-api';

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
