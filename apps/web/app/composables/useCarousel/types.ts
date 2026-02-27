import type { Block } from '@plentymarkets/shop-api';
import type { BannerProps } from '~/components/blocks/Banner/types';

export interface ActiveSlideIndex {
  [key: string]: number;
}

export interface UseCarouselState {
  data: Block[];
  loading: boolean;
  activeSlideIndex: ActiveSlideIndex;
}

export type UpdateBannerItems = (newBannerItems: BannerProps[], blockUuid: string) => void;
export type SetIndex = (blockUuid: string, slideIndex: number) => void;
export type CreateSlide = (type: string, index: number) => Promise<BannerProps>;

export interface UseCarousel {
  data: Readonly<Ref<UseCarouselState['data']>>;
  activeSlideIndex: Readonly<Ref<UseCarouselState['activeSlideIndex']>>;
  loading: Readonly<Ref<boolean>>;
  updateBannerItems: UpdateBannerItems;
  setIndex: SetIndex;
  createSlide: CreateSlide;
}

export type UseCarouselReturn = () => UseCarousel;
