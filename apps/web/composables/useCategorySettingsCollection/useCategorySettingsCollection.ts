import type { useCategorySettingsCollectionReturn, useCategorySettingsCollectionState } from './types';
import type { CategoryEntry } from '@plentymarkets/shop-api';
import { stripChildren } from '~/utils/stripChildren';

export const useCategorySettingsCollection: useCategorySettingsCollectionReturn = () => {
  const state = useState<useCategorySettingsCollectionState>('categorySettingsCollection', () => ({
    data: [],
    initialData: [],
    loading: false,
  }));

  const { send } = useNotification();
  const { $i18n } = useNuxtApp();
  const { movePagesInTree } = useCategoriesSearch();

  const addCategorySettings = async (category: CategoryEntry) => {
    const exists = state.value.data.some(
      (item) => item.id === category.id && item.details[0].lang === category.details[0].lang,
    );
    if (exists) return;

    state.value.data.push(category);
    state.value.initialData.push(JSON.parse(JSON.stringify(category)));
  };

  const hasChanges = computed(() => {
    const dataNoChildren = stripChildren(state.value.data);
    const initialNoChildren = stripChildren(state.value.initialData);
    return JSON.stringify(dataNoChildren) !== JSON.stringify(initialNoChildren);
  });

  const isCategoryDirty = (id: number) => {
    const current = state.value.data.find((item) => item.id === id);
    const initial = state.value.initialData.find((item) => item.id === id);
    if (!current || !initial) return false;
    const currentNoChildren = stripChildren(current);
    const initialNoChildren = stripChildren(initial);
    return JSON.stringify(currentNoChildren) !== JSON.stringify(initialNoChildren);
  };

  const saveCategorySettings = async (): Promise<boolean> => {
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
      await useSdk().plentysystems.setCategorySettings(settings);
      movePagesInTree(dirtyCategories);
      dirtyCategories.forEach((category) => {
        const idx = state.value.initialData.findIndex((item) => item.id === category.id);
        if (idx !== -1) {
          state.value.initialData[idx] = JSON.parse(JSON.stringify(category));
        }
      });
      state.value.loading = false;
      return true;
    } catch (error) {
      const err = error as { message?: string };
      send({
        type: 'negative',
        message: err?.message || String(error) || 'Unknown error',
      });
      state.value.loading = false;
      return false;
    }
  };

  const save = async () => {
    const successMessage = $i18n.t('errorMessages.editor.categories.success');
    const errorMessage = $i18n.t('errorMessages.editor.categories.error');
    const route = useRoute();
    const router = useRouter();
    const initialCategories: CategoryEntry[] = JSON.parse(JSON.stringify(state.value.initialData));
    const currentCategorySlug = extractCategorySlug(route.path);

    const categoryFromRoute = initialCategories.find(
      (category: CategoryEntry) => currentCategorySlug === category.details[0]?.nameUrl,
    );

    const categoryAfterEdit = categoryFromRoute
      ? state.value.data.find((category) => category.id === categoryFromRoute.id)
      : undefined;

    const editedPreviewUrl = categoryAfterEdit?.details[0]?.previewUrl;
    const editedNameUrl = categoryAfterEdit?.details[0]?.nameUrl;
    const newSlug = buildNewSlug(editedPreviewUrl, editedNameUrl);
    const ensureTrailingSlash = (path: string) => (path.endsWith('/') ? path : path + '/');

    const isSaved = await saveCategorySettings();

    if (isSaved) {
      send({
        message: successMessage,
        type: 'positive',
      });

      if (categoryFromRoute && newSlug && ensureTrailingSlash(route.path) !== newSlug) {
        await router.push(newSlug);
      }
    } else {
      send({
        message: errorMessage,
        type: 'negative',
      });
    }
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
