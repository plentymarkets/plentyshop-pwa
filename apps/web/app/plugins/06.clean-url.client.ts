/**
 * @description Removes query params that are not part of the CloudFront cache key from the visible URL.
 * Runs after the app is mounted and after every navigation.
 */
export default defineNuxtPlugin({
  name: 'clean-url',
  setup(nuxtApp) {
    const router = useRouter();
    const { cleanFullPath } = useCleanQuery();

    /**
     * @description Replaces the browser URL with its cleaned version if they differ.
     * Uses `history.replaceState` instead of `router.replace`, so no navigation or data refetch is triggered.
     * The cleaned URL is compared with the real browser URL, because `replaceState` does not update vue-router's route.
     * Failures are swallowed on purpose: cleaning the visible URL is cosmetic and must never break the app.
     */
    const cleanUrl = () => {
      try {
        const target = cleanFullPath(router.currentRoute.value);
        if (new URL(target, window.location.origin).href === window.location.href) {
          return;
        }

        window.history.replaceState(window.history.state, '', target);
      } catch {
        return;
      }
    };

    nuxtApp.hook('app:mounted', cleanUrl);
    router.afterEach(() => {
      nextTick(cleanUrl);
    });
  },
});
