import type { Block } from '@plentymarkets/shop-api';
import type { BlockProps } from '~/types/blocks';

interface CarouselConfiguration {
  controls: {
    color: string;
    displayArrows: boolean;
  };
  layout?: {
    fullWidth?: boolean;
  };
}

/**
 * Carousel structure block that contains an array of child blocks.
 * Uses BlockProps with Block[] as content type for recursive nesting.
 */
export type CarouselStructureProps = BlockProps<Block[], CarouselConfiguration>;
