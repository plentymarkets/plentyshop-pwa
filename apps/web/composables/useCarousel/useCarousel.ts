import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import {UseCarouselState} from "~/composables/useCarousel/types";

export const useCarousel: UseCarouselReturn = () => {
  const state = useState<UseCarouselState>('useCarousel', () => ({
    data: [],
    loading: false,
    activeSlideIndex: {} as ActiveSlideIndex,
  }));


  const updateBannerItems: UpdateBannerItems = (newBannerItems: BannerProps[], blockUuid: string) => {
    const { findBlockByUuid } = useBlockManager();
    const carouselBlock = findBlockByUuid(state.value.data, blockUuid);

    if (carouselBlock) {
      carouselBlock.content = { ...(carouselBlock.content as BannerProps[]), ...newBannerItems };
    }
  };

  const setIndex: SetIndex = (blockUuid: string, slideIndex: number) => {
    state.value.activeSlideIndex[blockUuid] = slideIndex;
  };

  return {
    updateBannerItems,
    setIndex,
    ...toRefs(state.value),
  };
};
