import type { Product, ImagesData } from '@plentymarkets/shop-api';
interface AgnosticImage {
  alt: string | null;
  url: string;
}
export type AddModernImageExtensionForSfImages = (images: AgnosticImage[]) => AgnosticImage[];

export type AddModernImageExtension = (url: string | undefined) => string;
export type AddModernImageExtensionForGallery = (images: ImagesData[]) => ImagesData[];
export type GetImageForViewport = (product: Product, context: string) => string;

export interface UseModernImage {
  addModernImageExtension: AddModernImageExtension;
  addModernImageExtensionForGallery: AddModernImageExtensionForGallery;
  getImageForViewport: GetImageForViewport;
}

export type UseModernImageReturn = () => UseModernImage;
