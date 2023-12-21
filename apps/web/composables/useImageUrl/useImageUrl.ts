import { UseImageUrlReturn } from './types';

export const useImageUrl: UseImageUrlReturn = () => {
    const getWebpUrl = (url: string | undefined) => {
        return url ? `${url}.webp` : '';
    } 

    return {
        getWebpUrl
    }
};