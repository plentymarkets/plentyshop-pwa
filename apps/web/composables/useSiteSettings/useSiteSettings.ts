import type {
  UpdateSetting,
  UseSiteSettingsReturn,
  UseSiteSettingsState,
  GetSetting,
  SaveSiteSettings,
  SetSettingsInitialData,
  SettingValue,
} from '~/composables/useSiteSettings/types';
import type { Setting } from '@plentymarkets/shop-api';

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

  const getSetting: GetSetting = () => {
    return (
      (state.value.data?.[setting as string] as string) ?? (state.value.initialData?.[setting as string] as string)
    );
  };

  const getJsonSetting: () => string[] = () => {
    const runtimeSetting = state.value.initialData?.[setting as string];

    const defaultSetting = typeof runtimeSetting === 'string' ? runtimeSetting : JSON.stringify(runtimeSetting);

    return JSON.parse((state.value.data?.[setting as string] as string) || defaultSetting);
  };

  const setInitialData: SetSettingsInitialData = (settings: Setting[]) => {
    const result = settings.reduce((acc: Record<string, SettingValue>, { originalKey, value }) => {
      let parsedValue = value;
      if (typeof value === 'string') {
        try {
          parsedValue = JSON.parse(value);
        } catch {
          parsedValue = value;
        }
      }

      acc[originalKey] = parsedValue;

      return acc;
    }, {});

    state.value.initialData = { ...useRuntimeConfig().public, ...result };
  };

  const settingsIsDirty = computed(() => {
    const config = state.value.initialData;
    const currentData = state.value.data;

    return Object.keys(currentData).some((key) => key in config && currentData[key] !== config[key]);
  });

  const saveSiteSettings: SaveSiteSettings = async () => {
    try {
      state.value.loading = true;

      const settings = [
        ...Object.entries(state.value.data || {}).map(([key, val]) => ({
          key,
          value: String(val || ''),
        })),
      ];

      await useSdk().plentysystems.setConfiguration({ settings });

      state.value.initialData = { ...state.value.initialData, ...state.value.data };
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      state.value.loading = false;
    }
    return true;
  };

  return {
    ...toRefs(state.value),
    updateSetting,
    getSetting,
    getJsonSetting,
    settingsIsDirty,
    saveSiteSettings,
    setInitialData,
  };
};
