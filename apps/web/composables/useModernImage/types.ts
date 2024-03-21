import type { SfImage } from '@vue-storefront/unified-data-model';

export type AddModernImageExtension = (url: string | undefined) => string;
export type AddModernImageExtensionForSfImages = (images: SfImage[]) => SfImage[];

export interface UseModernImage {
  addModernImageExtension: AddModernImageExtension;
  addModernImageExtensionForSfImages: AddModernImageExtensionForSfImages;
}

export type UseModernImageReturn = () => UseModernImage;
