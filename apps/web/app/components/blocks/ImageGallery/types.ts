import type { Product } from '@plentymarkets/shop-api';
import type { ImageGalleryContent } from '~/components/Gallery/types';
import type { BlockProps } from '~/types/blocks';

export type ThumbnailType = 'left-vertical' | 'right-vertical' | 'bottom';

type ThumbnailCard = { type: ThumbnailType; cdn: string; label: string };
export type Thumbnails = ThumbnailCard[];

/**
 * ImageGallery block with runtime-injected properties.
 * Uses intersection pattern to extend BlockProps with product runtime property.
 */
export type ImageGalleryProps = BlockProps<ImageGalleryContent> & {
  product?: Product;
};

export interface ImageGalleryFormProps {
  uuid?: string;
}
