import { useFlag, useVariant, useFlagsStatus, useUnleashContext } from '@unleash/proxy-client-vue';
import type { IVariant, IMutableContext } from 'unleash-proxy-client';
import type { UnleashFlagsState } from '~/plugins/06.unleash.server';

/**
 * @description Composable for evaluating Unleash feature flags and variants.
 *
 * During SSR the flags fetched by the server plugin (06.unleash.server.ts) are available
 * immediately via shared useState — no fallback to `false`. On the client the reactive
 * SDK composables take over and keep values up-to-date across polling intervals.
 *
 * Contextual properties used by the org's Unleash strategies (plentyId, contract, serverId,
 * cluster) would be set via `updateContext` once the values are known, e.g. after session
 * initialisation.
 *
 * @example
 * ``` ts
 * const { isEnabled, getVariant, flagsReady, updateContext } = useFeatureFlag();
 *
 * const showNewFeature = isEnabled('new-feature-enabled');
 * const pricingVariant = getVariant('pricing-experiment');
 *
 * // Set org-specific context after the session loads
 * await updateContext({ properties: { plentyId: '12345', contract: 'enterprise' } });
 * ```
 */
export const useFeatureFlag = () => {
  const { flagsReady: _flagsReady, flagsError: _flagsError } = useFlagsStatus();
  const flagsReady: Ref<boolean> = _flagsReady ?? ref(false);
  const flagsError: Ref<boolean> = _flagsError ?? ref(false);
  const _updateContext = useUnleashContext();

  /** Flags fetched server-side and hydrated to the client; used as the SSR source of truth. */
  const ssrFlags = useState<UnleashFlagsState>('unleash-flags', () => ({}));

  /**
   * Returns a reactive ref that is `true` when the flag is enabled, `false` otherwise.
   *
   * - **SSR**: reads from flags fetched by the server plugin.
   * - **Client**: delegates to the Unleash SDK (reactive, updates on each polling interval).
   *
   * @param flagName - Exact flag name as defined in Unleash.
   */
  const isEnabled = (flagName: string): Ref<boolean> => {
    if (import.meta.server) {
      const result = computed(() => ssrFlags.value[flagName] ?? false);
      if (import.meta.dev) {
        console.warn(`[unleash:ssr] isEnabled("${flagName}") →`, result.value);
      }
      return result;
    }

    // Only call the SDK composable (which uses inject/lifecycle hooks) when the
    // plugin is actually registered. Otherwise fall back to the SSR-hydrated state.
    const { public: runtimePublic } = useRuntimeConfig();
    const isUnleashConfigured = !!(runtimePublic.unleash as { url: string }).url;
    if (isUnleashConfigured) return useFlag(flagName);
    return computed(() => ssrFlags.value[flagName] ?? false);
  };

  /**
   * Returns a reactive ref containing the resolved variant for the flag.
   * Returns `undefined` during SSR (variant resolution requires the client SDK).
   *
   * @param flagName - Exact flag name as defined in Unleash.
   */
  const getVariant = (flagName: string): Ref<IVariant | undefined> => {
    if (import.meta.server) return ref(undefined);
    return useVariant(flagName);
  };

  /**
   * Sends an updated context to Unleash so that activation strategies are re-evaluated.
   * Pass org-specific properties (plentyId, contract, serverId, cluster) via the
   * `properties` key. Has no effect during SSR or when Unleash is not configured.
   *
   * @param context - Unleash context object to merge.
   *
   * @example
   * ``` ts
   * await updateContext({ properties: { plentyId: '57895', contract: 'pro', serverId: '114' } });
   * ```
   */
  const updateContext = async (context: IMutableContext): Promise<void> => {
    await _updateContext?.(context);
  };

  return { isEnabled, getVariant, flagsReady, flagsError, updateContext };
};
