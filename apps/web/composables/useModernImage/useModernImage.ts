import type { AgnosticImage } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';
import type { SfImage } from '@vue-storefront/unified-data-model';
import type { UseModernImageReturn, UseModernImageState } from './types';

export const useModernImage: UseModernImageReturn = () => {
  const useAvif: boolean = useRuntimeConfig().public.useAvif;
  const useWebp: boolean = useRuntimeConfig().public.useWebp;

  const avifExtension = 'avif';
  const webpExtension = 'webp';

  const state = useState<UseModernImageState>('receivedImageExtension', () => ({
    receivedUrl: '',
    receivedImageExtension: '',
  }));

  const addModernImageExtension = (url: string | undefined) => {
    if (url) state.value.receivedUrl = url;

    const matches = state.value.receivedUrl?.match(/.?(\.\w+)(?:$|\?)/);
    if (matches) state.value.receivedImageExtension = String(matches[1].split('.').pop());

    if (useAvif) {
      return state.value.receivedImageExtension === avifExtension
        ? state.value.receivedUrl
        : `${state.value.receivedUrl}.${avifExtension}`;
    }

    if (!useAvif && useWebp) {
      return state.value.receivedImageExtension === webpExtension
        ? state.value.receivedUrl
        : `${state.value.receivedUrl}.${webpExtension}`;
    }

    return state.value.receivedUrl;
  };

  const addModernImageExtensionForSfImages = (images: SfImage[]) => {
    return images.map((image: AgnosticImage) => ({ ...image, url: addModernImageExtension(image.url) }));
  };

  return {
    addModernImageExtension,
    addModernImageExtensionForSfImages,
  };
};
