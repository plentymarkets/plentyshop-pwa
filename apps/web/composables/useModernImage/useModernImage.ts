import type { AgnosticImage } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';
import type { SfImage } from '@vue-storefront/unified-data-model';
import type { UseModernImageReturn } from './types';
import type { Product, ImagesData } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-sdk';

export const useModernImage: UseModernImageReturn = () => {
  const config = useRuntimeConfig().public;
  const validConversionExtensions = new Set(['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp']);
  const avifExtension = 'avif';
  const webpExtension = 'webp';

  const addModernImageExtension = (url: string | undefined) => {
    let baseUrl = '';
    let baseExtension = '';

    if (url) baseUrl = url;

    const matches = baseUrl?.match(/.?(\.\w+)(?:$|\?)/);

    if (matches) baseExtension = String(matches[1].split('.').pop());

    if (!validConversionExtensions.has(baseExtension) || !/\/item\/images\//.test(baseUrl)) return baseUrl;

    if (config.useAvif) return baseExtension === avifExtension ? baseUrl : `${baseUrl}.${avifExtension}`;

    if (!config.useAvif && config.useWebp)
      return baseExtension === webpExtension ? baseUrl : `${baseUrl}.${webpExtension}`;

    return baseUrl;
  };

  const addModernImageExtensionForSfImages = (images: SfImage[]) => {
    return images.map((image: AgnosticImage) => ({ ...image, url: addModernImageExtension(image.url) }));
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
  // eslint-disable-next-line unicorn/consistent-function-scoping
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
    addModernImageExtension,
    addModernImageExtensionForSfImages,
    getImageForViewport,
    addWebpExtensionForGallerySfImages,
  };
};
