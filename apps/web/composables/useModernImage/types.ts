import type { SfImage } from '@vue-storefront/unified-data-model';
import type { Product, ImagesData } from '@plentymarkets/shop-api';

export type AddModernImageExtension = (url: string | undefined) => string;
export type AddModernImageExtensionForSfImages = (images: SfImage[]) => SfImage[];
export type GetImageForViewport = (product: Product, context: string) => string | undefined;
export type AddWebpExtensionForGallerySfImages = (images: ImagesData[]) => ImagesData[];

export interface UseModernImage {
  addModernImageExtension: AddModernImageExtension;
  addModernImageExtensionForSfImages: AddModernImageExtensionForSfImages;
  getImageForViewport: GetImageForViewport;
  addWebpExtensionForGallerySfImages: AddWebpExtensionForGallerySfImages;
}

export type UseModernImageReturn = () => UseModernImage;
