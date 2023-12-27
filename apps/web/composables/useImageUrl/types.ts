import { SfImage } from "@vue-storefront/unified-data-model";


export type AddWebpExtension = (url: string | undefined) => string
export type AddWebpExtensionForSfImages = (images: SfImage[]) => SfImage[]

export interface UseImageUrl {
    addWebpExtension: AddWebpExtension,
    addWebpExtensionForSfImages: AddWebpExtensionForSfImages
}


export type UseImageUrlReturn = () => UseImageUrl;
