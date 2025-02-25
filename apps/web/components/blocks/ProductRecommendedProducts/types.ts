import { ImageTextContent } from '~/components/blocks/Image/types';

export type ProductRecommendedProductsProps = {
  name: string;
  type: string;
  content: ProductRecommendedProductsContent;
  configuration?: {
    controls: {
      color: string;
      displayArrows: boolean;
    };
  };
  index?: number;
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
};
