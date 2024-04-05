import type { AgnosticImage } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';
import type { SfImage } from '@vue-storefront/unified-data-model';
import type { UseModernImageReturn } from './types';

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

  const addModernImageExtensionForSfImages = (images: AgnosticImage[]) => {
    return images.map((image: AgnosticImage) => ({
      ...image,
      url: addModernImageExtension(image.url),
      width: image.width ?? null,
      height: image.height ?? null,
    }));
  };
  

  return {
    addModernImageExtension,
    addModernImageExtensionForSfImages,
  };
};
