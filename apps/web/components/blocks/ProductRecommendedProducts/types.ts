export type ProductRecommendedProductsProps = {
  index?: number;
  categoryId: string;
  cacheKey?: string;
  text: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    color?: string;
    textAlignment?: 'left' | 'center' | 'right';
  };
};
