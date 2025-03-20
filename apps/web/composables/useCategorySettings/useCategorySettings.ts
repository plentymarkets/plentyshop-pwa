import type {
    useCategorySettingsReturn,
    useCategoryConfigurationState,
  } from '~/composables/useCategorySettings/types';
  
  /**
   * @description Composable for managing SEO configuration.
   * @returns useCategorySettingsReturn
   * @example
   * ``` ts
   * const { title, description, keywords, robots, canonical, includeSitemap, saveSeoSettings, seoSettingsIsDirty } = useSeoConfiguration();
   * ```
   */
  export const useCategorySettings: useCategorySettingsReturn = () => {
    const state = useState<useCategoryConfigurationState>('categoryConfiguration', () => ({
      data: [],
      loading: false,
      drawerOpen: false,
      drawerExtraOpen: false,
      title: '',
      description: '',
      keywords: '',
      robots: '',
      canonical: '',
      includeSitemap: false,
      drawerView: null,
      initialData: {
        title: '',
        description: '',
        keywords: '',
        robots: '',
        canonical: '',
        includeSitemap: false,
      },
    }));
  
    const categorySettingsIsDirty = computed(() => {
      return (
        state.value.title !== state.value.initialData.title ||
        state.value.description !== state.value.initialData.description ||
        state.value.keywords !== state.value.initialData.keywords ||
        state.value.robots !== state.value.initialData.robots ||
        state.value.canonical !== state.value.initialData.canonical ||
        state.value.includeSitemap !== state.value.initialData.includeSitemap
      );
    });
  
    // const saveCategorySettings = async (): Promise<boolean> => {
    //   state.value.loading = true;
  
    //   const settings = {
    //     title: state.value.title,
    //     description: state.value.description,
    //     keywords: state.value.keywords,
    //     robots: state.value.robots,
    //     canonical: state.value.canonical,
    //     includeSitemap: state.value.includeSitemap,
    //   };
  
    //   const { error } = await useAsyncData(() => useSdk().plentysystems.setSeoConfiguration({ settings }));
  
    //   if (error.value) {
    //     state.value.loading = false;
    //     return false;
    //   }
  
    //   state.value.initialData = { ...settings };
  
    //   state.value.loading = false;
    //   return true;
    // };
  
    return {
      ...toRefs(state.value),
      categorySettingsIsDirty,
      // saveCategorySettings,
    };
  };