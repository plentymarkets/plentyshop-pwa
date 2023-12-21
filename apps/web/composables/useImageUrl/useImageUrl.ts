import { AgnosticImage } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';
import { UseImageUrlReturn } from './types';

export const useImageUrl: UseImageUrlReturn = () => {
    const useWebp = useRuntimeConfig().public.useWebp;
    const getWebpUrl = (url: string | undefined) => {

        if(useWebp) {
            return url ? `${url}.webp` : '';
        }
        return url ?? '';
    } 

    const getWebpForAgnosticImages = (images: AgnosticImage[]) => {
        
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
        getWebpUrl,
        getWebpForAgnosticImages
    }
};