import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import homepageTemplateDataDe from './homepageTemplateDataDe.json';
import { HomepageData, UseHomepageDataReturn, UseHomepageDataState } from './types';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? homepageTemplateDataDe : homepageTemplateDataEn;

export const useHomepage: UseHomepageDataReturn = () => {
  const state = useState<UseHomepageDataState>('useHomepageState', () => ({
    data: {} as HomepageData,
    loading: false,
    showErrors: false,
  }));

  const { $i18n } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  const currentLocale = ref($i18n.locale.value);
  const fetchPageTemplate = (): void => {
    state.value.loading = true;

    const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
    // if (typeof homepageCategoryId === 'number') {
    //   const { fetchHomepageTemplate } = useFetchHome();
    //   console.log("intra aici");
    //   state.value.data = fetchHomepageTemplate();
    // } else {
    state.value.data = useLocaleSpecificHomepageTemplate(currentLocale.value);
    // }

    state.value.loading = false;
  };
  watch(
    () => state.value.data,
    (updatedData) => {
      state.value.data = updatedData;
    },
    { deep: true },
  );

  return {
    fetchPageTemplate,
    ...toRefs(state.value),
  };
};
