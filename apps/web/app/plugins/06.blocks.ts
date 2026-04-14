export default defineNuxtPlugin({
  name: 'blocks',
  parallel: true,
  async setup() {
    const router = useRouter();
    const { $i18n } = useNuxtApp();

    const fetchForRoute = async () => {
      const { meta } = router.currentRoute.value;
      const hasBlockIdentifier = meta.isBlockified && meta.identifier !== undefined;
      const identifier = (hasBlockIdentifier ? meta.identifier : 'index') as string | number;
      const type = (hasBlockIdentifier && meta.type ? meta.type : 'immutable') as string;

      const { fetchBlocks } = useBlocks();
      await fetchBlocks(identifier, type);
    };

    await fetchForRoute();

    if (import.meta.client) {
      router.afterEach(async (to) => {
        const { $i18n } = useNuxtApp();

        await fetchForRoute();
      });
    }
  },
});
