/**
 * Middleware to handle PWA workbox service worker updates on navigation
 */

const SAFE_PAGE_TYPES = new Set(['category', 'product']);

export default defineNuxtRouteMiddleware(async (to) => {
  const { $pwa } = useNuxtApp();

  if (!$pwa?.needRefresh) return;

  // update only on routes that do not risk interrupting user flows
  const pageType = to.meta?.type as string | undefined;

  if (pageType && SAFE_PAGE_TYPES.has(pageType)) {
    try {
      await $pwa.updateServiceWorker();
    } catch {
      // silently fail
    }
  }
});
