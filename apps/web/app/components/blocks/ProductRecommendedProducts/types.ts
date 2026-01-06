export type CrossSellingRelationType = 'Accessory' | 'ReplacementPart' | 'Similar' | 'Bundle';

export type ProductRecommendedProductsProps = {
  name: string;
  type: string;
  content: ProductRecommendedProductsContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
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
    textAlignment?: 'left' | 'center' | 'right';
  };
};
