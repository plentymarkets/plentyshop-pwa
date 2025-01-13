export type ProductRecommendedProductsProps = {
  categoryId: string;
  cacheKey?: string;
  text?: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
  };
};
