import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import type { UseCarouselState } from '~/composables/useCarousel/types';
import slideTemplates from './slideTemplates.json';
import { v4 as uuid } from 'uuid';

export const useCarousel: UseCarouselReturn = () => {
  const state = useState<UseCarouselState>('useCarousel', () => ({
    data: [],
    loading: false,
    activeSlideIndex: {} as ActiveSlideIndex,
  }));

  const { findOrDeleteBlockByUuid } = useBlockManager();
  const route = useRoute();
  const { data } = useCategoryTemplate(
    route?.meta?.identifier as string,
    route.meta.type as string,
    useNuxtApp().$i18n.locale.value,
  );

  const createSlide = (type: string, index: number): BannerProps => {
    const template = slideTemplates[type as keyof typeof slideTemplates];
    if (!template) throw new Error(`No template found for slide type: ${type}`);

    return {
      ...template,
      meta: { uuid: uuid() },
      index,
    } as BannerProps;
  };

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
    createSlide,
    updateBannerItems,
    setIndex,
    ...toRefs(state.value),
  };
};
