import type { Block } from '@plentymarkets/shop-api';
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';

export interface ActiveSlidesIndex {
  [key: string]: number;
}

export interface UseCarouselState {
  data: Block[];
  loading: boolean;
  activeSlidesIndex: ActiveSlidesIndex;
}

export type UpdateBannerItems = (newBannerItems: BannerProps[], blockUuid: string) => void;
export type GetCarouselStructureByBlockUid = (blockUuid: string) => Block | null;
export type SetIndex = (blockUuid: string, slideIndex: number) => void;

export interface UseCarousel {
  data: Readonly<Ref<UseCarouselState['data']>>;
  activeSlidesIndex: Readonly<Ref<UseCarouselState['activeSlidesIndex']>>;
  loading: Readonly<Ref<boolean>>;
  updateBannerItems: UpdateBannerItems;
  getCarouselStructureByBlockUid: GetCarouselStructureByBlockUid;
  setIndex: SetIndex;
}

export type UseCarouselReturn = () => UseCarousel;
