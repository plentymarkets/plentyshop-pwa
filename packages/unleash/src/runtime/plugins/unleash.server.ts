import { defineNuxtPlugin, useState, useRuntimeConfig } from '#imports';
import type { UnleashFlagsState } from '../types';

interface UnleashConfig {
  url: string;
  clientKey: string;
  appName: string;
  refreshInterval: number;
  mockFlags: string;
}

const LOG_PREFIX = '[unleash:server]';

export default defineNuxtPlugin({
  name: 'unleash-ssr',
  async setup() {
    const { public: runtimePublic } = useRuntimeConfig();
    const unleash = runtimePublic.unleash as UnleashConfig;

    const flagState = useState<UnleashFlagsState>('unleash-flags', () => ({}));

    if (!unleash.url && unleash.mockFlags) {
      try {
        flagState.value = JSON.parse(unleash.mockFlags) as UnleashFlagsState;
        if (import.meta.dev) {
          console.warn(LOG_PREFIX, 'Using mock flags:', flagState.value);
        }
      } catch {
        console.warn(LOG_PREFIX, 'UNLEASH_MOCK_FLAGS is not valid JSON — ignoring.');
      }
      return;
    }

    if (!unleash.url || !unleash.clientKey) {
      if (import.meta.dev) {
        console.warn(
          LOG_PREFIX,
          'Skipping — UNLEASH_URL / UNLEASH_CLIENT_KEY not set.\n',
          'Set UNLEASH_MOCK_FLAGS in .env to use dummy flags locally.',
        );
      }
      return;
    }

    try {
      if (import.meta.dev) {
        console.warn(LOG_PREFIX, `Fetching flags from ${unleash.url} …`);
      }

      const response = await $fetch<{ toggles: Array<{ name: string; enabled: boolean }> }>(unleash.url, {
        headers: { Authorization: unleash.clientKey },
      });

      flagState.value = Object.fromEntries(response.toggles.map(({ name, enabled }) => [name, enabled]));

      if (import.meta.dev) {
        console.warn(LOG_PREFIX, `Loaded ${response.toggles.length} flag(s):`, flagState.value);
      }
    } catch (error) {
      console.error(LOG_PREFIX, 'Failed to fetch flags, all flags default to disabled.', error);
    }
  },
});
