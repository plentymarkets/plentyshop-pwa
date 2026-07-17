import type { RouteLocationNormalized } from 'vue-router';

export default defineNuxtPlugin({
  name: 'blocks',
  parallel: true,
  async setup() {
    const router = useRouter();
    const { $i18n } = useNuxtApp();
    const { isInEditor } = useEditorState();
    const { fetchProducts, loadFakeGlobalCategoryData, data: productsCatalog } = useProducts();

    const fetchForRoute = async (to: RouteLocationNormalized) => {
      const { meta } = to;

      if (meta.skipBlocksFetch) return;
      const hasBlockIdentifier = meta.isBlockified && meta.identifier !== undefined;
      const type = (hasBlockIdentifier && meta.type ? meta.type : 'immutable') as string;

      if (type === 'category') {
        if (isToGlobalCategoryTemplate(to) && isInEditor.value) {
          loadFakeGlobalCategoryData($i18n.locale.value);
        } else {
          const { getFacetsFromURL, checkFiltersInURL } = useCategoryFilter(to);
          await fetchProducts(getFacetsFromURL()).then(() => checkFiltersInURL());
        }
      }

      const categoryIdentifier =
        productsCatalog.value.category?.type === 'content' ? productsCatalog.value.category?.id : 0;
      const staticIdentifier = hasBlockIdentifier ? meta.identifier : 'index';
      const blockIdentifier = type === 'category' ? categoryIdentifier : staticIdentifier;

      const { fetchBlocks } = useBlocks();
      await fetchBlocks(blockIdentifier as string | number, type);
    };

    await fetchForRoute(router.currentRoute.value);

    if (import.meta.client) {
      router.beforeResolve(async (to) => {
        await fetchForRoute(to);
      });
    }
  },
});
