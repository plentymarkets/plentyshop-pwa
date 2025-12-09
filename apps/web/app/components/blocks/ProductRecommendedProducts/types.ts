import type { BlockProps, TextAlignment } from '~/types/blocks';

export type CrossSellingRelationType = 'Accessory' | 'ReplacementPart' | 'Similar' | 'Bundle';

/**
 * ProductRecommendedProducts block with runtime-injected properties.
 * Uses intersection pattern to extend BlockProps with shouldLoad runtime property.
 */
export type ProductRecommendedProductsProps = BlockProps<ProductRecommendedProductsContent> & {
  shouldLoad?: boolean;
};

export type ProductRecommendedProductsContent = {
  index?: number;
  cacheKey?: string;
  source: {
    type: 'category' | 'cross_selling';
    categoryId: string;
    itemId: string;
    crossSellingRelation: CrossSellingRelationType;
  };
  text: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    color?: string;
    textAlignment?: TextAlignment;
  };
  layout?: {
    fullWidth?: boolean;
  };
};
