export type UnleashFlagsState = Record<string, boolean>;

interface UnleashConfig {
  url: string;
  clientKey: string;
  appName: string;
  refreshInterval: number;
  mockFlags: string;
}

const LOG_PREFIX = '[unleash:server]';

/**
 * Server-side plugin that fetches evaluated feature flags from the Unleash Frontend API
 * and stores them in shared useState so they are available during SSR and hydrated to
 * the client without an extra round-trip.
 *
 * When UNLEASH_URL is not set but UNLEASH_MOCK_FLAGS is provided, mock flags are used
 * instead, useful for local development without a real Unleash instance.
 *
 * The client plugin (07.unleash.client.ts) picks up from here and keeps the values
 * reactive via the SDK's polling interval.
 */
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

    // Fetch real flags from Unleash
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
      // Unleash unreachable during SSR — flags fall back to disabled (safe default)
      console.error(LOG_PREFIX, 'Failed to fetch flags, all flags default to disabled.', error);
    }
  },
});
