import type { SfImage } from '@vue-storefront/unified-data-model';
import type { Product } from '@plentymarkets/shop-api';

export type AddWebpExtension = (url: string | undefined) => string;
export type GetImageForViewport = (product: Product, context: string) => string | undefined;
export type AddWebpExtensionForSfImages = (images: SfImage[]) => SfImage[];

export interface UseImageUrl {
  addWebpExtension: AddWebpExtension;
  getImageForViewport: GetImageForViewport;
  addWebpExtensionForSfImages: AddWebpExtensionForSfImages;
}

export type UseImageUrlReturn = () => UseImageUrl;
