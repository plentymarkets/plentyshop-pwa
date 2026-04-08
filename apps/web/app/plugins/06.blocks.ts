export default defineNuxtPlugin({
  name: 'blocks',
  parallel: true,
  async setup() {
    const router = useRouter();
    const { fetchBlocks } = useBlocks();

    const fetchForRoute = async () => {
      const { meta } = router.currentRoute.value;
      const hasBlockIdentifier = meta.isBlockified && meta.identifier !== undefined;
      const identifier = (hasBlockIdentifier ? meta.identifier : 'index') as string | number;
      const type = (hasBlockIdentifier && meta.type ? meta.type : 'immutable') as string;

      await fetchBlocks(identifier, type);
    };

    await fetchForRoute();

    router.afterEach(async (to) => {
      // if (to.meta.isBlockified) return;
      await fetchForRoute();
    });
  },
});
