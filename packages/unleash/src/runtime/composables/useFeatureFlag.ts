import { useState, useRuntimeConfig, ref, computed } from '#imports';
import type { Ref } from '#imports';
import { useFlag, useVariant, useFlagsStatus, useUnleashContext } from '@unleash/proxy-client-vue';
import type { IVariant, IMutableContext } from 'unleash-proxy-client';
import type { UnleashFlagsState } from '../types';

export const useFeatureFlag = () => {
  const { flagsReady: _flagsReady, flagsError: _flagsError } = useFlagsStatus();
  const flagsReady: Ref<boolean> = _flagsReady ?? ref(false);
  const flagsError: Ref<boolean> = _flagsError ?? ref(false);
  const _updateContext = useUnleashContext();

  const ssrFlags = useState<UnleashFlagsState>('unleash-flags', () => ({}));

  const isEnabled = (flagName: string): Ref<boolean> => {
    if (import.meta.server) {
      const result = computed(() => ssrFlags.value[flagName] ?? false);
      if (import.meta.dev) {
        console.warn(`[unleash:ssr] isEnabled("${flagName}") →`, result.value);
      }
      return result;
    }

    const { public: runtimePublic } = useRuntimeConfig();
    const isUnleashConfigured = !!(runtimePublic.unleash as { url: string }).url;
    if (isUnleashConfigured) return useFlag(flagName);
    return computed(() => ssrFlags.value[flagName] ?? false);
  };

  const getVariant = (flagName: string): Ref<IVariant | undefined> => {
    if (import.meta.server) return ref(undefined);
    return useVariant(flagName);
  };

  const updateContext = async (context: IMutableContext): Promise<void> => {
    await _updateContext?.(context);
  };

  return { isEnabled, getVariant, flagsReady, flagsError, updateContext };
};
