export default defineNuxtPlugin({
  name: 'session-and-category-tree',
  parallel: true,
  async setup() {
    const route = useRoute();
    if (route.meta.cacheControl) {
       await useInitialSetup().fetchSessionAndCategoryTree(); 
    }
  },
});
