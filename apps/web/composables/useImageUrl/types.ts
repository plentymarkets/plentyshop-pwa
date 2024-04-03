import type { Product, ImagesData } from '@plentymarkets/shop-api';

export type AddWebpExtension = (url: string | undefined) => string;
export type GetImageForViewport = (product: Product, context: string) => string | undefined;
export type AddWebpExtensionForGallerySfImages = (images: ImagesData[]) => ImagesData[];

export interface UseImageUrl {
  addWebpExtension: AddWebpExtension;
  getImageForViewport: GetImageForViewport;
  addWebpExtensionForGallerySfImages: AddWebpExtensionForGallerySfImages;
}

export type UseImageUrlReturn = () => UseImageUrl;
