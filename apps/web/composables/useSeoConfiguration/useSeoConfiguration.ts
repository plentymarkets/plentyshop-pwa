import type {
  UseSeoConfigurationReturn,
  UseSeoConfigurationState,
} from '~/composables/useSeoConfiguration/types';

/**
 * @description Composable for managing SEO configuration.
 * @returns UseSeoConfigurationReturn
 * @example
 * ``` ts
 * const { title, description, keywords, robots, canonical, includeSitemap, saveSeoSettings, seoSettingsIsDirty } = useSeoConfiguration();
 * ```
 */
export const useSeoConfiguration: UseSeoConfigurationReturn = () => {
  const state = useState<UseSeoConfigurationState>('seoConfiguration', () => ({
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
      title: 'Seo Title',
      description: 'Meta description',
      keywords: 'Meta keywords',
      robots: '',
      canonical: 'Canonical URL',
      includeSitemap: false,
    },
  }));

  const seoSettingsIsDirty = computed(() => {
    return (
      state.value.title !== state.value.initialData.title ||
      state.value.description !== state.value.initialData.description ||
      state.value.keywords !== state.value.initialData.keywords ||
      state.value.robots !== state.value.initialData.robots ||
      state.value.canonical !== state.value.initialData.canonical ||
      state.value.includeSitemap !== state.value.initialData.includeSitemap
    );
  });

//   const saveSeoSettings = async (): Promise<boolean> => {
//     state.value.loading = true;

//     const settings = {
//       title: state.value.title,
//       description: state.value.description,
//       keywords: state.value.keywords,
//       robots: state.value.robots,
//       canonical: state.value.canonical,
//       includeSitemap: state.value.includeSitemap,
//     };

//     const { error } = await useAsyncData(() => useSdk().plentysystems.setSeoConfiguration({ settings }));

//     if (error.value) {
//       state.value.loading = false;
//       return false;
//     }

//     state.value.initialData = { ...settings };

//     state.value.loading = false;
//     return true;
//   };

  return {
    ...toRefs(state.value),
    seoSettingsIsDirty,
  //  saveSeoSettings,
  };
};