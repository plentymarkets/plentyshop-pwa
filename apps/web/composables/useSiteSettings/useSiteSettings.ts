import type {
  UpdateSetting,
  UseSiteSettingsReturn,
  UseSiteSettingsState,
  GetSetting,
  SaveSiteSettings,
} from '~/composables/useSiteSettings/types';

/**
 * @description Composable for managing site settings.
 * @returns UseSiteSettingsReturn
 * @example
 * ``` ts
 * const { data, loading, updateSetting, getSetting } = useSiteSettings();
 * ```
 */
export const useSiteSettings: UseSiteSettingsReturn = (setting?: string) => {
  const state = useState<UseSiteSettingsState>('siteSettings', () => ({
    data: {},
    loading: false,
    initialData: useRuntimeConfig().public || {},
  }));

  const updateSetting: UpdateSetting = async (value) => {
    state.value.data = { ...state.value.data, [setting as string]: value };
  };

  const getSetting: GetSetting = (): string => {
    return (
      (state.value.data?.[setting as string] as string) || (useRuntimeConfig().public?.[setting as string] as string)
    );
  };

  const isDirty = computed(() => {
    const config = state.value.initialData;
    const currentData = state.value.data;

    return Object.keys(currentData).some((key) => key in config && currentData[key] !== config[key]);
  });

  const saveSiteSettings: SaveSiteSettings = () => {
    state.value.initialData = { ...state.value.initialData, ...state.value.data };
  };

  return {
    ...toRefs(state.value),
    updateSetting,
    getSetting,
    isDirty,
    saveSiteSettings,
  };
};
