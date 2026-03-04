import type { Block } from '@plentymarkets/shop-api';
import type { SlideBlock } from '~/components/blocks/structure/Carousel/types';

export interface ActiveSlideIndex {
  [key: string]: number;
}

export interface UseCarouselState {
  data: Block[];
  loading: boolean;
  activeSlideIndex: ActiveSlideIndex;
}

export type UpdateCarouselItems = (newCarouselItems: SlideBlock[], blockUuid: string) => void;
export type SetIndex = (blockUuid: string, slideIndex: number) => void;
export type CreateSlide = (type: string, index: number) => Promise<SlideBlock>;
export type GetSlideLabel = (slide: SlideBlock, index: number) => Promise<string>;

export interface UseCarousel {
  data: Readonly<Ref<UseCarouselState['data']>>;
  activeSlideIndex: Readonly<Ref<UseCarouselState['activeSlideIndex']>>;
  loading: Readonly<Ref<boolean>>;
  updateCarouselItems: UpdateCarouselItems;
  setIndex: SetIndex;
  createSlide: CreateSlide;
  getSlideLabel: GetSlideLabel;
}

export type UseCarouselReturn = () => UseCarousel;
