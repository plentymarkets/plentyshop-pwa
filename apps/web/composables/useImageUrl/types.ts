import { AgnosticImage } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';


export type GetWebpUrl = (url: string | undefined) => string
export type GetWebpForAgnosticImages = (images: AgnosticImage[]) => AgnosticImage[]

export interface UseImageUrl {
    getWebpUrl: GetWebpUrl,
    getWebpForAgnosticImages: GetWebpForAgnosticImages
}


export type UseImageUrlReturn = () => UseImageUrl;
