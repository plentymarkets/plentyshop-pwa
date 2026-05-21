import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';

export type OldContent = {
  index?: number;
  cacheKey?: string;
  categoryId: string;
  text: object;
};

const defaultLayout: ProductRecommendedProductsContent['layout'] = {
  fullWidth: false,
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
};

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
    return {
      ...content,
      layout: {
        ...defaultLayout,
        ...(content.layout || {}),
      },
    };
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
    layout: defaultLayout,
  };
}
