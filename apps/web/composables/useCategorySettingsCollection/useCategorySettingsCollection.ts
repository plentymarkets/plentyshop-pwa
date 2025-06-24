import type { useCategorySettingsCollectionReturn, useCategorySettingsCollectionState } from './types';
import type { CategoryEntry } from '@plentymarkets/shop-api';

export const useCategorySettingsCollection: useCategorySettingsCollectionReturn = () => {
  const state = useState<useCategorySettingsCollectionState>('categorySettingsCollection', () => ({
    data: [],
    initialData: [],
    loading: false,
  }));

  const { send } = useNotification();
  const { $i18n } = useNuxtApp();

  const addCategorySettings = async (category: CategoryEntry) => {
    const exists = state.value.data.some(
      (item) => item.id === category.id && item.details[0].lang === category.details[0].lang,
    );
    if (exists) return;

    state.value.data.push(category);
    state.value.initialData.push(JSON.parse(JSON.stringify(category)));
  };

  const hasChanges = computed(() => {
    return JSON.stringify(state.value.data) !== JSON.stringify(state.value.initialData);
  });

  const isCategoryDirty = (id: number) => {
    const current = state.value.data.find((item) => item.id === id);
    const initial = state.value.initialData.find((item) => item.id === id);
    if (!current || !initial) return false;

    return JSON.stringify(current) !== JSON.stringify(initial);
  };

  const saveCategorySettings: SaveSettings = async (): Promise<boolean> => {
    state.value.loading = true;
    try {
      const dirtyCategories = state.value.data.filter((category) => {
        const initial = state.value.initialData.find((item) => item.id === category.id);
        if (!initial) return false;
        return JSON.stringify(category) !== JSON.stringify(initial);
      });
      if (dirtyCategories.length === 0) {
        state.value.loading = false;
        return true;
      }
      const settings = JSON.parse(
        JSON.stringify(
          dirtyCategories
            .filter((category) => category.details && category.details.length > 0)
            .map((category) => {
              const detail = category.details[0];
              return {
                id: category.id,
                parentCategoryId: category.parentCategoryId,
                sitemap: category.sitemap,
                linklist: category.linklist,
                linkCategoryToWebstore: category.isLinkedToWebstore,
                right: category.right,
                categoryId: detail.categoryId,
                lang: detail.lang,
                name: detail.name,
                nameUrl: detail.nameUrl,
                type: category.type,
                position: detail.position,
                metaTitle: detail.metaTitle,
                metaDescription: detail.metaDescription,
                metaKeywords: detail.metaKeywords,
                metaRobots: detail.metaRobots,
                canonicalLink: detail.canonicalLink,
                pageView: detail.pageView,
                itemListView: detail.itemListView,
                singleItemView: detail.singleItemView,
                clients: category.clients.map((client) => ({
                  categoryId: client.categoryId,
                  plentyId: client.plentyId,
                })),
              };
            }),
        ),
      );
      const response = await useSdk().plentysystems.setCategorySettings(settings);
      console.log('Response from setCategorySettings:', response);

      // Flatten the response data
      const updatedCategories = Array.isArray(response?.data)
        ? response.data.flat()
        : [];
      console.log('Updated categories:', updatedCategories);

      // Update state.value.data and state.value.initialData
      updatedCategories.forEach((updatedCategory: CategoryEntry) => {
        const dataIdx = state.value.data.findIndex((item) => item.id === updatedCategory.id);
        if (dataIdx !== -1) {
          console.log('Updating data for category:', updatedCategory.id);
          state.value.data[dataIdx] = JSON.parse(JSON.stringify(updatedCategory));
        }
        const initialIdx = state.value.initialData.findIndex((item) => item.id === updatedCategory.id);
        if (initialIdx !== -1) {
          console.log('Updating initial data for category:', updatedCategory.id);
          state.value.initialData[initialIdx] = JSON.parse(JSON.stringify(updatedCategory));
        }
      });

      state.value.loading = false;
    } catch (e) {
      console.error('Error saving category settings:', e);
    } finally {
      state.value.loading = false;
    }

    return true;
  };

  const save = async () => {
    const successMessage = $i18n.t('errorMessages.editor.categories.success');
    const errorMessage = $i18n.t('errorMessages.editor.categories.error');
    const route = useRoute();
    const router = useRouter();

    const initialCategories: CategoryEntry[] = JSON.parse(JSON.stringify(state.value.initialData));

    const categoryFromRoute = initialCategories.find(
      (category: CategoryEntry) =>
        extractPathFromPreviewUrl(category.details[0]?.previewUrl) === route.path
    );

    const categoryAfterEdit = categoryFromRoute
      ? state.value.data.find((category) => category.id === categoryFromRoute.id)
      : undefined;

    const editedPreviewUrl = categoryAfterEdit?.details[0]?.previewUrl;
    const editedNameUrl = categoryAfterEdit?.details[0]?.nameUrl;
    const newSlug = buildNewSlug(editedPreviewUrl, editedNameUrl);

    console.log(initialCategories, categoryFromRoute, categoryAfterEdit, newSlug);

    const isSaved = await saveCategorySettings();

    if (isSaved) {
      send({
        message: successMessage,
        type: 'positive',
      });

      if (categoryFromRoute && newSlug && route.path !== newSlug) {
        await router.push(newSlug);
      }
    } else {
      send({
        message: errorMessage,
        type: 'negative',
      });
    }
  };

  const extractPathFromPreviewUrl = (previewUrl?: string): string => {
    if (!previewUrl) return '/';
    const firstSlashIndex = previewUrl.indexOf('/', 8);
    return firstSlashIndex !== -1 ? previewUrl.slice(firstSlashIndex) || '/' : '/';
  };

  const extractCategorySlug = (path: string): string | undefined => {
    const segments = path.split('/').filter(Boolean);
    return segments.length ? segments[segments.length - 1] : undefined;
  };

  const buildNewSlug = (previewUrl: string | undefined, nameUrl: string | undefined): string => {
    if (!previewUrl || !nameUrl) return '/';
    try {
      const url = new URL(previewUrl);
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length === 0) return `/${nameUrl}/`;
      segments[segments.length - 1] = nameUrl;
      return '/' + segments.join('/') + '/';
    } catch {
      return `/${nameUrl}/`;
    }
  };

  return {
    ...toRefs(state.value),
    addCategorySettings,
    isCategoryDirty,
    saveCategorySettings,
    save,
    hasChanges,
  };
};
