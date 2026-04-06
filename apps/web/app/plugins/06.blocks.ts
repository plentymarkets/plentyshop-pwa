export default defineNuxtPlugin({
  name: 'blocks',
  parallel: true,
  async setup() {
    const router = useRouter();
    const nuxtApp = useNuxtApp();
    const { fetchBlocks } = useBlocks();

    const fetchForRoute = async () => {
      const { meta } = router.currentRoute.value;
      const identifier = (meta.isBlockified && meta.identifier ? meta.identifier : 'index') as string | number;
      const type = (meta.isBlockified && meta.type ? meta.type : 'immutable') as string;

      await fetchBlocks(identifier, type);
    };

    await fetchForRoute();

    router.afterEach(fetchForRoute);

    watch(
      () => nuxtApp.$i18n.locale.value,
      () => fetchForRoute(),
    );
  },
});
