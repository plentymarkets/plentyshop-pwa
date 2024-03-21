import type { AgnosticImage } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';
import type { SfImage } from '@vue-storefront/unified-data-model';
import type { UseModernImageReturn } from './types';

export const useModernImage: UseModernImageReturn = () => {
  const useAvif = useRuntimeConfig().public.useAvif;
  const useWebp = useRuntimeConfig().public.useWebp;
  const avifExtension = 'avif';
  const webpExtension = 'webp';

  const addModernImageExtension = (url: string | undefined) => {
    let baseUrl = '';
    let baseExtension = '';

    if (url) baseUrl = url;

    const matches = baseUrl?.match(/.?(\.\w+)(?:$|\?)/);

    if (matches) baseExtension = String(matches[1].split('.').pop());

    if (useAvif) return baseExtension === avifExtension ? baseUrl : `${baseUrl}.${avifExtension}`;

    if (!useAvif && useWebp) return baseExtension === webpExtension ? baseUrl : `${baseUrl}.${webpExtension}`;

    return baseUrl;
  };

  const addModernImageExtensionForSfImages = (images: SfImage[]) => {
    return images.map((image: AgnosticImage) => ({ ...image, url: addModernImageExtension(image.url) }));
  };

  return {
    addModernImageExtension,
    addModernImageExtensionForSfImages,
  };
};
