import { plugin as unleashPlugin } from '@unleash/proxy-client-vue';

const LOG_PREFIX = '[unleash:client]';

/**
 * Client-side plugin to initialize the Unleash feature flag SDK.
 * Only runs in the browser, skipped when the Unleash URL or client key is not configured.
 */
export default defineNuxtPlugin({
  name: 'unleash',
  parallel: true,
  setup(nuxtApp) {
    const { public: runtimeConfig } = useRuntimeConfig();
    const { url, clientKey, appName, refreshInterval } = runtimeConfig.unleash;

    if (!url || !clientKey) {
      if (import.meta.dev) {
        console.warn(LOG_PREFIX, 'Skipping SDK - no UNLEASH_URL configured (SSR mock flags are still active).');
      }
      return;
    }

    if (import.meta.dev) {
      console.warn(LOG_PREFIX, `Starting SDK - ${url} (app: ${appName}, refresh: ${refreshInterval}s)`);
    }

    nuxtApp.vueApp.use(unleashPlugin, {
      config: {
        url,
        clientKey,
        appName,
        refreshInterval,
      },
    });
  },
});
