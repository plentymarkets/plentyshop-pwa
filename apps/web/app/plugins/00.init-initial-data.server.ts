export default defineNuxtPlugin({
  name: 'init-initial-data',
  async setup() {
    const route = useRoute();
    const { setInitialDataSSR, fetchSettings, fetchCacheableInitData } = useInitialSetup();
    const promises: Promise<unknown>[] = [fetchSettings()];

    if (route.meta.cacheControl) {
      promises.push(fetchCacheableInitData());
    } else {
      promises.push(setInitialDataSSR());
    }
    await Promise.all(promises);
  },
});
