/**
 * Plugin to initialize footer settings on app startup
 * Ensures footer configuration is loaded early and cached
 */
export default defineNuxtPlugin(async () => {
  // Only fetch footer settings on client-side after hydration
  if (import.meta.client) {
    const { fetchFooterSettings } = useFooterSettings();
    
    // Pre-load footer settings in background
    try {
      await fetchFooterSettings();
    } catch (error) {
      // Silently fail - defaults will be used
      console.warn('Failed to preload footer settings:', error);
    }
  }
});
