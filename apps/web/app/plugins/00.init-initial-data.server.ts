export default defineNuxtPlugin({
  name: 'init-initial-data',
  async setup() {
    const route = useRoute();
    const { setInitialDataSSR, fetchSettings, fetchCachableInitData } = useInitialSetup();
    const promisses: Promise<unknown>[] = [fetchSettings()];

    if (route.meta.cacheControl) {
      promisses.push(fetchCachableInitData());
    } else {
      promisses.push(setInitialDataSSR());
    }

    await callOnce(async () => {
      await Promise.all(promisses);
    });
  },
});
