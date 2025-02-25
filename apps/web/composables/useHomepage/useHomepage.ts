import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import homepageTemplateDataDe from './homepageTemplateDataDe.json';
import type { UseHomepageDataReturn, UseHomepageDataState, SetIndex, ActiveSlideIndex, UpdateBlocks } from './types';
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? (homepageTemplateDataDe as Block[]) : (homepageTemplateDataEn as Block[]);

export const useHomepage: UseHomepageDataReturn = () => {
  const state = useState<UseHomepageDataState>('useHomepageState', () => ({
    data: [],
    initialBlocks: [],
    dataIsEmpty: false,
    loading: false,
    showErrors: false,
    activeSlideIndex: {} as ActiveSlideIndex,
  }));

  const { $i18n } = useNuxtApp();
  const currentLocale = ref($i18n.locale.value);

  const { data, getBlocks } = useCategoryTemplate();

  const initializeHomepageTemplate = async () => {
    await getBlocks('index', 'immutable');
    state.value.data = data.value;

    if (!state.value.data || state.value.data.length === 0) {
      state.value.data = useLocaleSpecificHomepageTemplate(currentLocale.value);
    }

    state.value.initialBlocks = state.value.data.map((block) => toRaw(block));
  };

  const fetchPageTemplate = async (): Promise<void> => {
    state.value.loading = true;

    await initializeHomepageTemplate();
    state.value.dataIsEmpty = !state.value.data || state.value.data.length === 0;

    state.value.loading = false;
  };

  watch(
    () => currentLocale.value,
    async (newLocale) => {
      currentLocale.value = newLocale;
      await fetchPageTemplate();
    },
  );

  watch(
    () => state.value.data,
    (updatedData) => {
      state.value.dataIsEmpty = !updatedData || updatedData.length === 0;
    },
    { deep: true },
  );

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

  const updateBlocks: UpdateBlocks = (blocks) => {
    state.value.data = blocks;
  };

  return {
    fetchPageTemplate,
    updateBannerItems,
    setIndex,
    updateBlocks,
    ...toRefs(state.value),
  };
};
