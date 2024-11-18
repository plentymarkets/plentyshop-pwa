import { UseHomepageDataReturn, UseHomepageDataState, HomeData } from './types';
import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import homepageTemplateDataDe from './homepageTemplateDataDe.json';
import { HeroContentProps } from '~/components/ui/HeroCarousel/types';
import { MediaItemProps } from '~/components/ui/MediaCard/types';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? homepageTemplateDataDe : homepageTemplateDataEn;

const isEmptyObject = (object: any) => Object.keys(object).length === 0;

export const useHomePageState: UseHomepageDataReturn = () => {
  const state = useState<UseHomepageDataState>('useHomepageState', () => ({
    data: [] as HomeData[],
    loading: false,
    showErrors: false,
  }));

  const { $i18n } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  // const { isEditingDisabled } = useEditor();

  const currentLocale = ref($i18n.locale.value);
  const homepageTemplateData = ref(useLocaleSpecificHomepageTemplate(currentLocale.value));

  const recommendedProductsCategories = ref(homepageTemplateData.value.featured || []);
  const hero = ref<HeroContentProps[]>([]);
  const valueProposition = ref<MediaItemProps[]>([]);

  const fetchHomepageTemplate = async (homepageCategoryId: number) => {
    const { fetchCategoryTemplate } = useCategoryTemplate();
    const { data } = await fetchCategoryTemplate(homepageCategoryId);
    const parsedData = JSON.parse(data || '{}');

    homepageTemplateData.value =
      parsedData && !isEmptyObject(parsedData)
        ? {
            hero: parsedData.hero || [],
            valueProposition: parsedData.valueProposition,
            featured: parsedData.featured,
          }
        : useLocaleSpecificHomepageTemplate(currentLocale.value);

    recommendedProductsCategories.value = homepageTemplateData.value.featured || [];
  };

  const formatHeroItems = () =>
    homepageTemplateData.value.hero.map((item) => ({
      image: item.image,
      tagline: item.tagline || '',
      heading: item.heading || '',
      description: item.description || '',
      callToAction: item.callToAction || '',
      link: item.link || '',
    }));

  const formatMediaData = () =>
    homepageTemplateData.value.valueProposition.map((media) => ({
      image: media.image,
      text: media.text,
      alignment: media.alignment,
      alt: media.alt,
    }));

  const fetchData = async (): Promise<void> => {
    state.value.loading = true;
    const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
    if (typeof homepageCategoryId === 'number') {
      await fetchHomepageTemplate(homepageCategoryId);
    } // else {
    //   isEditingDisabled.value = true;
    // }

    const mediaData = formatMediaData();
    const formattedHeroItems = formatHeroItems();

    const homeData: HomeData = {
      hero: formattedHeroItems,
      valueProposition: mediaData,
    };

    state.value.data = [homeData];
    state.value.loading = false;

    if (state.value.data.length > 0) {
      const firstItem = state.value.data[0];
      hero.value = firstItem.hero;
      valueProposition.value = firstItem.valueProposition;
    }
  };

  const saveData = async (): Promise<void> => {
    const { setCategoryTemplate } = useCategoryTemplate();
    const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
    state.value.loading = true;
    try {
      await setCategoryTemplate(homepageCategoryId, JSON.stringify(state.value.data));
    } finally {
      state.value.loading = false;
    }
  };

  const setFormattedHeroItems = (item: HomeData[]) => {
    state.value.data = item;
  };

  watch(
    () => $i18n.locale.value,
    async (changedLocale) => {
      currentLocale.value = changedLocale;
      homepageTemplateData.value = useLocaleSpecificHomepageTemplate(changedLocale);
      await fetchData();
    },
    { immediate: true },
  );

  watch(
    () => state.value.data,
    (updatedData) => {
      if (updatedData.length > 0) {
        const firstItem = updatedData[0];
        hero.value = firstItem.hero;
        valueProposition.value = firstItem.valueProposition;
      } else {
        hero.value = [];
        valueProposition.value = [];
      }
    },
    { deep: true },
  );

  return {
    fetchData,
    saveData,
    ...toRefs(state.value),
    setFormattedHeroItems,
    hero,
    valueProposition,
    recommendedProductsCategories,
  };
};
