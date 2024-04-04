import type { UseModernImageReturn } from './types';
import type { Product, ImagesData } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-sdk';

const getImageForViewport = (product: Product, context: string, isTablet: Ref<boolean>) => {
  if (context === 'ItemList') return productGetters.getPreviewImage(product);
  if (context === 'Whislist')
    return isTablet ? productGetters.getFullImage(product) : productGetters.getMiddleImage(product);
  if (context === 'CartProductCard')
    return isTablet ? productGetters.getSecondPreviewImage(product) : productGetters.getPreviewImage(product);

  return '';
};
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
  const addModernImageExtensionForGallery = (images: ImagesData[]) => {
    return images.map((image: ImagesData) => ({
      ...image,
      url: addModernImageExtension(image.url),
      urlPreview: addModernImageExtension(image.urlPreview),
      urlMiddle: addModernImageExtension(image.urlMiddle),
      urlSecondPreview: addModernImageExtension(image.urlSecondPreview),
    }));
  };
  return {
    addModernImageExtension,
    addModernImageExtensionForGallery,
    getImageForViewport: (product, context) => {
      const { isTablet } = useBreakpoints();
      return getImageForViewport(product, context, isTablet);
    },
  };
};
