/**
 * Middleware to handle PWA workbox service worker updates on navigation
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { $pwa } = useNuxtApp();

  if (!$pwa?.needRefresh) return;

  // update only on routes that do not risk interrupting user flows
  const safePageTypes = ['category', 'product'];
  const pageType = to.meta?.type as string | undefined;

  if (pageType && safePageTypes.includes(pageType)) {
    try {
      await $pwa?.updateServiceWorker();
    } catch {
      // silently fail
    }
  }
});
