export default defineNuxtPlugin({
  name: 'init-initial-data-server',
  async setup() {
    const route = useRoute();
    const { setInitialDataSSR, fetchSettings, fetchCacheableInitData } = useInitialSetup();
    const promises: Promise<unknown>[] = [fetchSettings()];
    const isCloudfrontEnabled = useFeatureFlag('shopPwaEnableCloudfront', false);

    if (route.meta.cacheControl && isCloudfrontEnabled.value) {
      promises.push(fetchCacheableInitData());
    } else {
      promises.push(setInitialDataSSR());
    }
    await Promise.all(promises);
  },
});
