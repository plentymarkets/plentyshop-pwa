import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import homepageTemplateDataDe from './homepageTemplateDataDe.json';
import { HomepageData, UseHomepageDataReturn, UseHomepageDataState } from './types';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? homepageTemplateDataDe : homepageTemplateDataEn;

export const useHomepage: UseHomepageDataReturn = (lang) => {
  const state = useState<UseHomepageDataState>(`useHomepageState-${lang}`, () => ({
    data: { blocks: [] } as HomepageData,
    loading: false,
    showErrors: false,
  }));

  const { $i18n } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  const currentLocale = ref(lang || $i18n.locale.value);

  const fetchPageTemplate = (): void => {
    state.value.loading = true;

    const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
    if (typeof homepageCategoryId === 'number') {
      const { fetchHomepageTemplate } = useFetchHome();
      state.value.data = fetchHomepageTemplate();
    } else {
      state.value.data = useLocaleSpecificHomepageTemplate(currentLocale.value);
    }

    state.value.loading = false;
  };

  watch(
    () => $i18n.locale.value,
    (changedLocale) => {
      currentLocale.value = changedLocale;
      const langState = useState<UseHomepageDataState>(`useHomepageState-${changedLocale}`, () => ({
        data: useLocaleSpecificHomepageTemplate(changedLocale),
        loading: false,
        showErrors: false,
      }));
      state.value = langState.value;
    },
    { immediate: true },
  );

  return {
    fetchPageTemplate,
    ...toRefs(state.value),
  };
};
