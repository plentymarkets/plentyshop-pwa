import type { ImageGalleryContent } from '~/components/blocks/ImageGallery/types';
import type { ImagesData } from '@plentymarkets/shop-api';

export type GalleryProps = {
  configuration?: ImageGalleryContent;
  images: ImagesData[];
};
