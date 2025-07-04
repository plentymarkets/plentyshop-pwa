import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import type { UseCarouselState } from '~/composables/useCarousel/types';

export const useCarousel: UseCarouselReturn = () => {
  const state = useState<UseCarouselState>('useCarousel', () => ({
    data: [],
    loading: false,
    activeSlideIndex: {} as ActiveSlideIndex,
  }));

  const { findOrDeleteBlockByUuid } = useBlockManager();
  const { data } = useCategoryTemplate();

  const updateBannerItems: UpdateBannerItems = (newBannerItems: BannerProps[], blockUuid: string) => {
    const carouselBlock = findOrDeleteBlockByUuid(data.value, blockUuid);

    if (carouselBlock) {
      carouselBlock.content = [...newBannerItems];
    }
  };

  const setIndex: SetIndex = (blockUuid: string, slideIndex: number) => {
    const current = state.value.activeSlideIndex[blockUuid];
    if (current === slideIndex) return;
    state.value.activeSlideIndex[blockUuid] = slideIndex;
  };

  return {
    updateBannerItems,
    setIndex,
    ...toRefs(state.value),
  };
};
