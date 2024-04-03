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
  const getImageForViewport = (product: Product, context: string): string => {
    if (!product) return '';

    const { isDesktop, isTablet } = useBreakpoints();
    const isLargeViewport = isDesktop || isTablet;

    switch (context) {
      case 'ItemList': {
        return productGetters.getPreviewImage(product);
      }
      case 'Whislist': {
        return isLargeViewport ? productGetters.getFullImage(product) : productGetters.getMiddleImage(product);
      }
      case 'CartProductCard': {
        return isLargeViewport
          ? productGetters.getSecondPreviewImage(product)
          : productGetters.getPreviewImage(product);
      }
      default: {
        return '';
      }
    }
  };
  const addWebpExtensionForGallerySfImages = (images: ImagesData[]) => {
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
    addWebpExtensionForGallerySfImages,
  };
};
