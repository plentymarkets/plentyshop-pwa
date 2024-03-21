import type { AgnosticImage } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';
import type { SfImage } from '@vue-storefront/unified-data-model';
import type { UseModernImageReturn } from './types';

export const useModernImage: UseModernImageReturn = () => {
  const useAvif = useRuntimeConfig().public.useAvif;
  const useWebp = useRuntimeConfig().public.useWebp;
  const avifExtension = 'avif';
  const webpExtension = 'webp';

  const addModernImageExtension = (url: string | undefined) => {
    let receivedUrl = '';
    let receivedImageExtension = '';

    if (url) receivedUrl = url;

    const matches = receivedUrl?.match(/.?(\.\w+)(?:$|\?)/);
    if (matches) receivedImageExtension = String(matches[1].split('.').pop());

    if (useAvif) {
      return receivedImageExtension === avifExtension ? receivedUrl : `${receivedUrl}.${avifExtension}`;
    }

    if (!useAvif && useWebp) {
      return receivedImageExtension === webpExtension ? receivedUrl : `${receivedUrl}.${webpExtension}`;
    }

    return receivedUrl;
  };

  const addModernImageExtensionForSfImages = (images: SfImage[]) => {
    return images.map((image: AgnosticImage) => ({ ...image, url: addModernImageExtension(image.url) }));
  };

  return {
    addModernImageExtension,
    addModernImageExtensionForSfImages,
  };
};
