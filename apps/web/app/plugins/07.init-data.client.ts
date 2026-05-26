export default defineNuxtPlugin({
  name: 'init-data-client',
  parallel: true,
  setup() {
    const route = useRoute();
    if (route.meta.cacheControl) {
      useFetchSession().fetchSession();
    }
  },
});
