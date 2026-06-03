export default defineNuxtPlugin({
  name: 'init-initial-data-client',
  parallel: true,
  setup() {
    const route = useRoute();
    const isCloudfrontEnabled = useFeatureFlag('shopPwaEnableCloudfront', false);

    if (route.meta.cacheControl && isCloudfrontEnabled.value) {
      useFetchSession().fetchSession();
    }
  },
});
