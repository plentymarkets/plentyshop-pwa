import type { Product } from '@plentymarkets/shop-api';
import type { ImageGalleryContent } from '~/components/Gallery/types';

export type ThumbnailType = 'left-vertical' | 'right-vertical' | 'bottom';

type ThumbnailCard = { type: ThumbnailType; cdn: string; label: string };
export type Thumbnails = ThumbnailCard[];

export type ImageGalleryProps = {
  name: string;
  type: string;
  content: ImageGalleryContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
  product?: Product;
};

export interface ImageGalleryFormProps {
  uuid?: string;
}
