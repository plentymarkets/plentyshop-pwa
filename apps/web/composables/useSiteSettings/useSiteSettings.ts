import {
  UpdateSetting,
  UseSiteSettingsReturn,
  UseSiteSettingsState,
  GetSetting,
} from '~/composables/useSiteSettings/types';

/**
 * @description Composable for managing site settings.
 * @returns UseSiteSettingsReturn
 * @example
 * ``` ts
 * const { data, loading, updateSetting, getSetting } = useSiteSettings();
 * ```
 */
export const useSiteSettings: UseSiteSettingsReturn = (setting: string) => {
  const state = useState<UseSiteSettingsState>('siteSettings', () => ({
    data: {},
    loading: false,
  }));

  const updateSetting: UpdateSetting = async (value) => {
    state.value.data = { ...state.value.data, [setting]: value };
  };

  const getSetting: GetSetting = (): string => {
    return (
      (state.value.data?.[setting] as string) || (useRuntimeConfig().public?.[setting] as string)
    );
  };

  return {
    ...toRefs(state.value),
    updateSetting,
    getSetting,
  };
};
