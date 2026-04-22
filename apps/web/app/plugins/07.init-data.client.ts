export default defineNuxtPlugin({
  name: 'session-and-category-tree',
  parallel: true,
  setup() {
    const route = useRoute();
    if (route.meta.cacheControl) {
      useInitialSetup().fetchSessionAndCategoryTree(); 
    }
  },
});
