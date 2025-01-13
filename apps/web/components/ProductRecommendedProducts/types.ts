export type ProductRecommendedProductsProps = {
  categoryId: string;
  cacheKey?: string;
  text?: {
    preTitle?: string;
    title?: string;
    subTitle?: string;
    htmlDescription?: string;
  };
};
