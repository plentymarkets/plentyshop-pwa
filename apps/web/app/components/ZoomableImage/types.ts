import type { ImagesData } from '@plentymarkets/shop-api';

export type ZoomableImageProps = {
  images: ImagesData[];
  image: ImagesData;
  index: number;
  activeIndex: number;
  isFirstImage: boolean;
  disableZoom?: boolean;
};
