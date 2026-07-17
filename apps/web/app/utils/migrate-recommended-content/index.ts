import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';
import type { OldContent } from './types';

function isNewContent(
  content: OldContent | ProductRecommendedProductsContent,
): content is ProductRecommendedProductsContent {
  const c = content as ProductRecommendedProductsContent;
  return typeof c?.source?.type === 'string';
}

export function migrateRecommendedContent(
  content: OldContent | ProductRecommendedProductsContent,
): ProductRecommendedProductsContent {
  if (isNewContent(content)) {
    return content;
  }

  const old = content as OldContent;

  return {
    index: old.index,
    cacheKey: old.cacheKey,
    source: {
      type: 'category',
      categoryId: String(old.categoryId),
      itemId: '',
      crossSellingRelation: 'Similar',
    },
    text: (old.text || {}) as ProductRecommendedProductsContent['text'],
  };
}
