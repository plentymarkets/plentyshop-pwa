import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import type { UseCarouselState } from '~/composables/useCarousel/types';

export const useCarousel: UseCarouselReturn = () => {
  const state = useState<UseCarouselState>('useCarousel', () => ({
    data: [],
    loading: false,
    activeSlideIndex: {} as ActiveSlideIndex,
  }));

  const { findOrDeleteBlockByUuid } = useBlockManager();
  const route = useRoute();
  const { data } = useCategoryTemplate(route?.meta?.identifier as string, route.meta.type as string);

  const updateBannerItems: UpdateBannerItems = (newBannerItems: BannerProps[], blockUuid: string) => {
    const carouselBlock = findOrDeleteBlockByUuid(data.value, blockUuid);

    if (carouselBlock) {
      carouselBlock.content = [...newBannerItems];
    }
  };

  const setIndex: SetIndex = (blockUuid: string, slideIndex: number) => {
    const currentIndex = state.value.activeSlideIndex[blockUuid];
    if (currentIndex === slideIndex) return;
    state.value.activeSlideIndex[blockUuid] = slideIndex;
  };
  onMounted(() => {
    const onBlockMoved = (e: CustomEvent<{ uuid: string; name: string }>) => {
      if (e.detail.name !== 'Carousel') return;
      const uuid = e.detail.uuid;

      if (state.value.activeSlideIndex[uuid] !== 0) {
        setIndex(uuid, 0);
      }
    };

    window.addEventListener('block-moved', onBlockMoved as EventListener);

    onBeforeUnmount(() => window.removeEventListener('block-moved', onBlockMoved as EventListener));
  });
  return {
    updateBannerItems,
    setIndex,
    ...toRefs(state.value),
  };
};
