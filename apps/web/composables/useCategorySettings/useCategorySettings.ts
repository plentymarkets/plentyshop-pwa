import type { useCategorySettingsReturn, useCategoryConfigurationState } from '~/composables/useCategorySettings/types';
import { categoryGetters } from '@plentymarkets/shop-api';

/**
 * @description Composable for managing SEO configuration.
 * @returns useCategorySettingsReturn
 * @example
 * ``` ts
 * const { title, description, keywords, robots, canonical, includeSitemap, saveSeoSettings, seoSettingsIsDirty } = useSeoConfiguration();
 * ```
 */
export const useCategorySettings: useCategorySettingsReturn = (category, id) => {
  const state = useState<useCategoryConfigurationState>(`categoryConfiguration-${id}`, () => ({
    data: [],
    loading: false,
    drawerOpen: false,
    drawerExtraOpen: false,
    id: categoryGetters.getId(category),
    parentCategoryId: categoryGetters.getParentId(category),
    sitemap: category.sitemap == "Y" ? true : false,
    linkList: category.linklist == "Y" ? true : false,
    right: categoryGetters.getCategoryRight(category),
    name: categoryGetters.getCategoryName(category),
    path: categoryGetters.getCategoryDetails(category)?.nameUrl || '',
    canonicalLink: categoryGetters.getCategoryDetails(category)?.canonicalLink || '',
    title: categoryGetters.getMetaTitle(category),
    description: categoryGetters.getMetaDescription(category),
    keywords: categoryGetters.getMetaKeywords(category),
    robots: categoryGetters.getCategoryRobots(category),
    drawerView: null,
    initialData: {
      id: categoryGetters.getId(category),
      parentCategoryId: categoryGetters.getParentId(category),
      sitemap: category.sitemap == "Y" ? true : false,
      linkList: category.linklist == "Y" ? true : false,
      right: categoryGetters.getCategoryRight(category),
      name: categoryGetters.getCategoryName(category),
      path: categoryGetters.getCategoryDetails(category)?.nameUrl || '',
      canonicalLink: categoryGetters.getCategoryDetails(category)?.canonicalLink || '',
      title: categoryGetters.getMetaTitle(category),
      description: categoryGetters.getMetaDescription(category),
      keywords: categoryGetters.getMetaKeywords(category),
      robots: categoryGetters.getCategoryRobots(category),
    },
  }));
  const getPageId = computed(() => state.value.id);
  const getParentCategoryId = computed(() => state.value.parentCategoryId);



  const categorySettingsIsDirty = computed(() => {
    return (
      state.value.name !== state.value.initialData.name ||
      state.value.canonicalLink !== state.value.initialData.canonicalLink ||
      state.value.title !== state.value.initialData.title ||
      state.value.description !== state.value.initialData.description ||
      state.value.keywords !== state.value.initialData.keywords ||
      state.value.robots !== state.value.initialData.robots
    );
  });

  const setPageId = (id: number, parentCategoryId?: number) => {
    state.value.id = id;
    if (parentCategoryId !== undefined) {
      state.value.parentCategoryId = parentCategoryId;
    }
  };

  const saveCategorySettings: SaveSettings = async (): Promise<boolean> => {
    state.value.loading = true;

    const settings = [
      {
        key: 'id',
        value: state.value.id.toString(),
      },
      {
        key: 'parentCategoryId',
        value: state.value.parentCategoryId?.toString() || '',
      },
      {
        key: 'sitemap',
        value: state.value.sitemap.toString(),
      },

      {
        key: 'linkList',
        value: state.value.linkList.toString(),
      },
      {
        key: 'name',
        value: state.value.name,
      },
      {
        key: 'canonicalLink',
        value: state.value.canonicalLink,
      },
      {
        key: 'title',
        value: state.value.title,
      },
      {
        key: 'description',
        value: state.value.description,
      },
      {
        key: 'keywords',
        value: state.value.keywords,
      },
      {
        key: 'robots',
        value: state.value.robots,
      }
    ];
    const { error } = await useAsyncData(() => useSdk().plentysystems.setConfiguration({ settings }));

    if (error.value) {
      state.value.loading = false;
      return false;
    }

  //   state.value.initialData = {
  //     id: 16,
  //     parentCategoryId: 17,
  //     sitemap: state.value.sitemap,
  //     linkList: state.value.linkList,
  //     name: state.value.name,
  //     canonicalLink: state.value.canonicalLink,
  //     position: state.value.position,
  //     title: state.value.title,
  //     description: state.value.description,
  //     keywords: state.value.keywords,
  //     robots: state.value.robots,
  //  //   canonical: state.value.canonical,
  //     includeSitemap: state.value.includeSitemap,
  //   };

    state.value.loading = false;
    return true;
  };

  return {
    ...toRefs(state.value),
    categorySettingsIsDirty,
    saveCategorySettings,
    setPageId,
    getPageId,
    getParentCategoryId,
  };
};
