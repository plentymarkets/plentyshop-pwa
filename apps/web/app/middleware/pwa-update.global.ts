export default defineNuxtRouteMiddleware(async (to) => {
  const { $pwa } = useNuxtApp();

  if (!$pwa?.needRefresh) return;

  // Only update on safe page types (category, product)
  const safePageTypes = ['category', 'product'];
  const pageType = to.meta?.type as string | undefined;

  if (pageType && safePageTypes.includes(pageType)) {
    await $pwa?.updateServiceWorker();
  }
});
