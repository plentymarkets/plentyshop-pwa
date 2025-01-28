import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import homepageTemplateDataDe from './homepageTemplateDataDe.json';
import type { HomepageData, UseHomepageDataReturn, UseHomepageDataState } from './types';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? homepageTemplateDataDe : homepageTemplateDataEn;

export const useHomepage: UseHomepageDataReturn = () => {
  const state = useState<UseHomepageDataState>('useHomepageState', () => ({
    data: { blocks: [], meta: { isDefault: null } } as HomepageData,
    initialBlocks: [],
    dataIsEmpty: false,
    loading: false,
    showErrors: false,
  }));

  const { $i18n } = useNuxtApp();
  const currentLocale = ref($i18n.locale.value);

  const runtimeConfig = useRuntimeConfig();
  const homepageCategoryId = runtimeConfig.public.homepageCategoryId;

  const { fetchCategoryTemplate } = useCategoryTemplate();
  const { fetchHomepageTemplate } = useFetchHome();

  const fetchRecommendedProducts = async () => {
    state.value.data.blocks.forEach((block) => {
      if (block.name === 'ProductRecommendedProducts') {
        const options = block.options as ProductRecommendedProductsOptions;
        const id = options.categoryId;

        if (tryUseNuxtApp()) {
          const { fetchProductRecommended } = useProductRecommended(id);
          fetchProductRecommended(id);
        }
      }
    });
  };

  const initializeHomepageTemplate = async () => {
    if (typeof homepageCategoryId === 'number') {
      await fetchCategoryTemplate(homepageCategoryId);
      state.value.data = fetchHomepageTemplate();
      if (
        (!state.value.data.blocks || state.value.data.blocks.length === 0) &&
        state.value.data.meta?.isDefault === null
      ) {
        state.value.data = useLocaleSpecificHomepageTemplate(currentLocale.value);
      }
    } else {
      state.value.data = useLocaleSpecificHomepageTemplate(currentLocale.value);
    }

    state.value.initialBlocks = state.value.data.blocks.map((block) => toRaw(block));

    await fetchRecommendedProducts();
  };

  const fetchPageTemplate = async (): Promise<void> => {
    state.value.loading = true;

    await initializeHomepageTemplate();
    state.value.dataIsEmpty = !state.value.data.blocks || state.value.data.blocks.length === 0;

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
      if (updatedData.meta?.isDefault === null) {
        updatedData.meta.isDefault = false;
      }
      state.value.data = updatedData;
      state.value.dataIsEmpty = !updatedData.blocks || updatedData.blocks.length === 0;
    },
    { deep: true },
  );

  return {
    fetchPageTemplate,
    ...toRefs(state.value),
  };
};
