import type { SfImage } from '@vue-storefront/unified-data-model';
import type { AgnosticImage } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';

export type AddModernImageExtension = (url: string | undefined) => string;
export type AddModernImageExtensionForSfImages = (images: AgnosticImage[]) => AgnosticImage[];

export interface UseModernImage {
  addModernImageExtension: AddModernImageExtension;
  addModernImageExtensionForSfImages: AddModernImageExtensionForSfImages;
}

export type UseModernImageReturn = () => UseModernImage;
