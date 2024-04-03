import type { UseImageUrlReturn } from './types';
import type { Product, ImagesData } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-sdk';

export const useImageUrl: UseImageUrlReturn = () => {
  const useWebp = useRuntimeConfig().public.useWebp;

  const addWebpExtension = (url: string | undefined) => {
    if (useWebp) {
      return url ? `${url}.webp` : '';
    }
    return url ?? '';
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const getImageForViewport = (product: Product, context: string) => {
    if (context === 'Item-List') {
      return productGetters.getPreviewImage(product);
    }
    const { isDesktop, isTablet } = useBreakpoints();

    if (context === 'Whislist') {
      return isDesktop || isTablet ? productGetters.getFullImage(product) : productGetters.getMiddleImage(product);
    }
    if (context === 'ProductCard') {
      if (isDesktop || isTablet) {
        return product ? productGetters.getSecondPreviewImage(product) : '';
      } else {
        return product ? productGetters.getPreviewImage(product) : '';
      }
    }

    return '';
  };

  const addWebpExtensionForSfImages = (images: ImagesData[]) => {
    if (useWebp) {
      return images.map((image: ImagesData) => {
        return {
          ...image,
          url: image.url ? `${image.url}.webp` : '',
          urlPreview: image.urlPreview ? `${image.urlPreview}.webp` : '',
          urlMiddle: image.urlMiddle ? `${image.urlMiddle}.webp` : '',
          urlSecondPreview: image.urlSecondPreview ? `${image.urlSecondPreview}.webp` : '',
        };
      });
    }
    return images;
  };

  return {
    addWebpExtension,
    getImageForViewport,
    addWebpExtensionForSfImages,
  };
};
