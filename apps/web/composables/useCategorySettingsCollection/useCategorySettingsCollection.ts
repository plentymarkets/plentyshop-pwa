import type { useCategorySettingsCollectionReturn, useCategorySettingsCollectionState } from './types';
import type { CategoryEntry } from '@plentymarkets/shop-api';
import { watchDebounced } from '@vueuse/core';

export const useCategorySettingsCollection: useCategorySettingsCollectionReturn = () => {
  const state = useState<useCategorySettingsCollectionState>('categorySettingsCollection', () => ({
    data: [],
    initialData: [],
    loading: false,
    hasChanges: false,
  }));

  const { send } = useNotification();
  const { $i18n } = useNuxtApp();

  const editableCategoryProperties = [
    'parentCategoryId',
    'sitemap',
    'linklist',
    'isLinkedToWebstore',
    'right',
    'type',
  ];

  const editableCategoryDetailsProperties = [
    'name',
    'nameUrl',
    'metaTitle',
    'metaDescription',
    'metaKeywords',
    'metaRobots',
  ];

  const addCategorySettings = async (category: CategoryEntry) => {
    const exists = state.value.data.some(
      (item) => item.id === category.id && item.details[0].lang === category.details[0].lang,
    );
    if (exists) return;

    state.value.data.push(category);
    state.value.initialData.push(JSON.parse(JSON.stringify(category)));
  };

  watchDebounced(
    () => state.value.data,
    () => {
      state.value.hasChanges = state.value.data.some((category) => isCategoryDirty(category.id));
    },
    { deep: true, debounce: 300 },
  );

  const isCategoryDirty = (id: number) => {
    const current = state.value.data.find((item) => item.id === id);
    const initial = state.value.initialData.find((item) => item.id === id);

    if (!current || !initial) return false;

    let isDirty = false;

    editableCategoryProperties.forEach((property) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentValue = (current as any)[property];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialValue = (initial as any)[property];

      if (currentValue !== initialValue) {
        isDirty = true;
      }
    });

    editableCategoryDetailsProperties.forEach((property) => {
      const currentDetail = current.details[0];
      const initialDetail = initial.details[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentValue = (currentDetail as any)[property];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialValue = (initialDetail as any)[property];

      if (currentValue !== initialValue) {
        isDirty = true;
      }
    });

    return isDirty;
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

      response.data.categories[0].forEach((updatedCategory: CategoryEntry) => {
        const dataIdx = state.value.data.findIndex((item) => item.id === updatedCategory.id);
        const initialIdx = state.value.initialData.findIndex((item) => item.id === updatedCategory.id);
        
        if (dataIdx !== -1) {
          Object.assign(state.value.data[dataIdx], updatedCategory);
        }
        if (initialIdx !== -1) {
          Object.assign(state.value.initialData[initialIdx],JSON.parse(JSON.stringify(updatedCategory)));
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
  };
};
