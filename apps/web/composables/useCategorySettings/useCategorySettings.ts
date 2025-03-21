import type { useCategorySettingsReturn, useCategoryConfigurationState } from '~/composables/useCategorySettings/types';

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
    id: 1,
    parentCategoryId: 2,
    sitemap: '',
    linkList: '',
    name: '',
    canonicalLink: '',
    position: 1,
    title: '',
    description: '',
    keywords: '',
    robots: '',
    canonical: '',
    includeSitemap: false,
    drawerView: null,
    initialData: {
      id: 1,
      parentCategoryId: 2,
      sitemap: '',
      linkList: '',
      name: '',
      canonicalLink: '',
      position: 1,
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
      state.value.id !== state.value.initialData.id ||
      state.value.parentCategoryId !== state.value.initialData.parentCategoryId ||
      state.value.sitemap !== state.value.initialData.sitemap ||
      state.value.linkList !== state.value.initialData.linkList ||
      state.value.name !== state.value.initialData.name ||
      state.value.canonicalLink !== state.value.initialData.canonicalLink ||
      state.value.position !== state.value.initialData.position ||
      state.value.title !== state.value.initialData.title ||
      state.value.description !== state.value.initialData.description ||
      state.value.keywords !== state.value.initialData.keywords ||
      state.value.robots !== state.value.initialData.robots ||
      state.value.canonical !== state.value.initialData.canonical ||
      state.value.includeSitemap !== state.value.initialData.includeSitemap
    );
  });

  const saveCategorySettings: SaveSettings = async (): Promise<boolean> => {
    state.value.loading = true;

    // const settings = {
    //   id: state.value.id,
    //   parentCategoryId: state.value.parentCategoryId,
    //   sitemap: state.value.sitemap,
    //   linklist: state.value.linkList,
    //   name: state.value.name,
    //   canonicalLink: state.value.canonicalLink,
    //   position: state.value.position,
    //   title: state.value.title,
    //   description: state.value.description,
    //   keywords: state.value.keywords,
    //   robots: state.value.robots,
    //   canonical: state.value.canonical,
    //   includeSitemap: state.value.includeSitemap,
    // };

        const settings = {
          id: 23423432432,
          parentCategoryId: 16,
          linkList: 'N',
          name: 'MEGA NEW',
          canonicalLink: 'MEGA NEW',
          position: 3,
          metaTitle: 'MEGA NEW',
          metaDescription: 'MEGA NEW',
          metaKeywords: 'MEGA NEW',
          metaRobots: '',
          sitemap: 'N',
    };


    

    const { error } = await useAsyncData(() => useSdk().plentysystems.setCategorySettings(settings));
    if (error.value) {
      state.value.loading = false;
      return false;
    }

    // state.value.initialData = {
    //   id: state.value.id,
    //   parentCategoryId: state.value.parentCategoryId,
    //   sitemap: state.value.sitemap,
    //   linkList: state.value.linkList,
    //   name: state.value.name,
    //   canonicalLink: state.value.canonicalLink,
    //   position: state.value.position,
    //   title: state.value.title,
    //   description: state.value.description,
    //   keywords: state.value.keywords,
    //   robots: state.value.robots,
    //   canonical: state.value.canonical,
    //   includeSitemap: state.value.includeSitemap,
    // };

    

    state.value.loading = false;
    return true;
  };

  return {
    ...toRefs(state.value),
    categorySettingsIsDirty,
    saveCategorySettings,
  };
};
