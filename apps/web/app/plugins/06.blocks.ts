export default defineNuxtPlugin({
  name: 'blocks',
  parallel: true,
  async setup() {
    const router = useRouter();
    const { getFacetsFromURL, checkFiltersInURL } = useCategoryFilter();
    const { fetchProducts, data: productsCatalog } = useProducts();
    const routeDataReady = useState<Promise<void> | null>('routeDataReady', () => null);

    const fetchForRoute = async () => {
      const { meta } = router.currentRoute.value;
      const hasBlockIdentifier = meta.isBlockified && meta.identifier !== undefined;
      const type = (hasBlockIdentifier && meta.type ? meta.type : 'immutable') as string;

      if (type === 'category') {
        await fetchProducts(getFacetsFromURL()).then(() => checkFiltersInURL());
      }

      const identifier = computed(() => {
        if (type === 'category' && productsCatalog.value) {
          return (
            productsCatalog.value.category?.type === 'content' ? productsCatalog.value.category?.id : 0
          ) as number;
        }

        return (hasBlockIdentifier ? meta.identifier : 'index') as string | number;
      });

      const { fetchBlocks } = useBlocks();
      await fetchBlocks(identifier.value, type);
    };

    await fetchForRoute();

    if (import.meta.client) {
      router.afterEach(() => {
        routeDataReady.value = fetchForRoute();
      });
    }
  },
});
