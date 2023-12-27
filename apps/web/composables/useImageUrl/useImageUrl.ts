import { AgnosticImage } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';
import { SfImage } from '@vue-storefront/unified-data-model';
import { UseImageUrlReturn } from './types';

export const useImageUrl: UseImageUrlReturn = () => {
    const useWebp = useRuntimeConfig().public.useWebp;

    const addWebpExtension = (url: string | undefined) => {

        if(useWebp) {
            return url ? `${url}.webp` : '';
        }
        return url ?? '';
    } 

    const addWebpExtensionForSfImages = (images: SfImage[]) => {
        
        if(useWebp) {
            return images.map((image: AgnosticImage) => {
                return {
                    ...image,
                    url: image.url ? `${image.url}.webp` : ''

                }
            })
        }
        return images;
    }

    return {
        addWebpExtension,
        addWebpExtensionForSfImages
    }
};