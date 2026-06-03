export default defineNuxtPlugin({
  name: 'init-initial-data-client',
  parallel: true,
  async setup() {
    const route = useRoute();
    const isCloudfrontEnabled = useFeatureFlag('shopPwaEnableCloudfront', false);

    if (route.meta.cacheControl && isCloudfrontEnabled.value) {
      await useFetchSession().fetchSession();
    }
  },
});
