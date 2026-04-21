export default defineNuxtPlugin({
  name: 'session',
  parallel: true,
  async setup () {
    const { fetchSession } = useFetchSession();
    const route = useRoute();
    if (route.meta.cacheControl) await fetchSession();
  },
});
