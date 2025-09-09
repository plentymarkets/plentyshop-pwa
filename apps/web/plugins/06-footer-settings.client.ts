/**
 * Plugin to initialize and cache footer settings on app startup
 */
export default defineNuxtPlugin(async () => {
  const { fetchFooterSettings } = useFooter();

  try {
    await fetchFooterSettings();
  } catch (error) {
    console.warn('Failed to preload footer settings:', error);
  }
});
