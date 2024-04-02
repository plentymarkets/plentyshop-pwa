import type { AgnosticImage } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';
import type { SfImage } from '@vue-storefront/unified-data-model';
import type { UseImageUrlReturn } from './types';
import type { Product } from '@plentymarkets/shop-api';
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
    if (context === 'Item-View') {
      return productGetters.getFullImage(product);
    }
    if (context === 'Item-View-Preview') {
      return productGetters.getPreviewImage(product);
    }
    const { isDesktop, isTablet } = useBreakpoints();

    if (context === 'Basket' || context === 'Checkout') {
      return isDesktop && isTablet
        ? productGetters.getSecondPreviewImage(product)
        : productGetters.getPreviewImage(product);
    }

    if (context === 'Whislist') {
      return isDesktop && isTablet ? productGetters.getFullImage(product) : productGetters.getMiddleImage(product);
    }

    return '';
  };

  const addWebpExtensionForSfImages = (images: SfImage[]) => {
    if (useWebp) {
      return images.map((image: AgnosticImage) => {
        return {
          ...image,
          url: image.url ? `${image.url}.webp` : '',
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
