/**
 * Plugin to initialize footer settings on app startup
 * Ensures footer configuration is loaded early and cached
 */
export default defineNuxtPlugin(async () => {
    const { fetchFooterSettings } = useFooterSettings();
    
    try {
      await fetchFooterSettings();
    } catch (error) {
      console.warn('Failed to preload footer settings:', error);
    }
  }
);
