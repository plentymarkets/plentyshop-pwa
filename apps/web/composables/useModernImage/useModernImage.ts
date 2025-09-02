import type { UseModernImageReturn } from './types';
import type { Product, ImagesData } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';

const getImageForViewport = (product: Product, context: string, isTablet: boolean) => {
  if (context === 'ItemList') return productGetters.getPreviewImage(product);
  if (context === 'Wishlist')
    return isTablet ? productGetters.getFullImage(product) : productGetters.getMiddleImage(product);
  if (context === 'CartProductCard')
    return isTablet ? productGetters.getSecondPreviewImage(product) : productGetters.getPreviewImage(product);

  return '';
};

export const useModernImage: UseModernImageReturn = () => {
  const { getSetting: useAvif } = useSiteSettings('useAvif');
  const { getSetting: useWebp } = useSiteSettings('useWebp');

  const validConversionExtensions = new Set(['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp']);
  const avifExtension = 'avif';
  const webpExtension = 'webp';

  const addModernImageExtension = (url: string | undefined): string => {
    if (!url) return '';

    const matches = url.match(/.?(\.\w+)(?:$|\?)/);
    if (!matches) return url;

    const baseExtension = String(matches[1].split('.').pop());

    if (!validConversionExtensions.has(baseExtension) || !/\/item\/images\//.test(url)) return url;
    if (useAvif() && baseExtension !== avifExtension) return `${url}.${avifExtension}`;
    if (useWebp() && baseExtension !== webpExtension) return `${url}.${webpExtension}`;

    return url;
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
      const viewport = useViewport();
      return getImageForViewport(product, context, viewport.isGreaterOrEquals('md'));
    },
  };
};
