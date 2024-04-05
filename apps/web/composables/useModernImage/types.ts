import type { SfImage } from '@vue-storefront/unified-data-model';
import type { AgnosticImage } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';


export type AddModernImageExtensionForSfImages = (images: AgnosticImage[]) => AgnosticImage[];
import type { Product, ImagesData } from '@plentymarkets/shop-api';

export type AddModernImageExtension = (url: string | undefined) => string;
export type AddModernImageExtensionForGallery = (images: ImagesData[]) => ImagesData[];
export type GetImageForViewport = (product: Product, context: string) => string;

export interface UseModernImage {
  addModernImageExtension: AddModernImageExtension;
  addModernImageExtensionForGallery: AddModernImageExtensionForGallery;
  getImageForViewport: GetImageForViewport;
}

export type UseModernImageReturn = () => UseModernImage;
