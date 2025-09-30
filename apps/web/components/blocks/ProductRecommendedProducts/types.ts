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
  layout: {
    marginTop: string;
    marginBottom: string;
    marginLeft: string;
    marginRight: string;
  }
};
