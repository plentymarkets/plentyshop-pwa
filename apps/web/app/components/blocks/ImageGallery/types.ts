import type { Product } from '@plentymarkets/shop-api';

export type ThumbnailType = 'left-vertical' | 'right-vertical' | 'bottom';

export const THUMBNAIL_TYPES: ThumbnailType[] = ['left-vertical', 'right-vertical', 'bottom'];

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

export type ImageGalleryContent = {
  index?: number;
  thumbnails: {
    showThumbnails?: boolean;
    thumbnailType?: string;
    enableHoverZoom?: boolean;
  };
};

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageFormProps {
  uuid?: string;
}
