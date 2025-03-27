import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import type { GetCarouselStructureByBlockUid, UseCarouselState } from '~/composables/useCarousel/types';

export const useCarousel: UseCarouselReturn = () => {
  const state = useState<UseCarouselState>('useCarousel', () => ({
    data: [],
    loading: false,
    activeSlidesIndex: {} as ActiveSlidesIndex,
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
    if (blockUuid) {
      state.value.activeSlidesIndex[blockUuid] = slideIndex;
    }
  };

  const getCarouselStructureByBlockUid: GetCarouselStructureByBlockUid = (blockUuid: string) => {
    return findOrDeleteBlockByUuid(data.value, blockUuid);
  };

  return {
    updateBannerItems,
    getCarouselStructureByBlockUid,
    setIndex,
    ...toRefs(state.value),
  };
};
