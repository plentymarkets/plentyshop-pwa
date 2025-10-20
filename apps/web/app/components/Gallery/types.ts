import type { ImagesData } from '@plentymarkets/shop-api';

export type ImageGalleryContent = {
  index?: number;
  thumbnails: {
    showThumbnails?: boolean;
    thumbnailType?: string;
    enableHoverZoom?: boolean;
  };
};

export type GalleryProps = {
  configuration?: ImageGalleryContent;
  images: ImagesData[];
};
