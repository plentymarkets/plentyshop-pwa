import type {
  UpdateSetting,
  GetSetting,
  GetBooleanSetting,
  GetNumberSetting,
  GetJsonSetting,
  SaveSiteSettings,
  SetSettingsInitialData,
  SettingValue,
  UseSiteSettingsState,
  UseSiteSettingsDeps,
} from './types';
import type { Setting } from '@plentymarkets/shop-api';
import type { Ref } from 'vue';

export const createSiteSettingsLogic = (
  setting: string | undefined,
  state: Ref<UseSiteSettingsState>,
  deps: UseSiteSettingsDeps,
) => {
  const { sdk, runtimeConfigPublic } = deps;
  const { send } = useNotification();

  const updateSetting: UpdateSetting = (value) => {
    if (setting) {
      state.value.data = { ...state.value.data, [setting]: value };
    }
  };

  const getSetting: GetSetting = () => {
    if (!setting) return '';
    const value = state.value.data?.[setting] ?? state.value.initialData?.[setting];
    return value === undefined || value === null ? '' : String(value);
  };

  const getBooleanSetting: GetBooleanSetting = (fallback = false) => {
    const value = getSetting();
    return value === '' ? fallback : value === 'true';
  };

  const getNumberSetting: GetNumberSetting = (fallback = 0) => {
    const value = getSetting();
    if (value === '') return fallback;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const getJsonSetting: GetJsonSetting = () => {
    if (!setting) return [];
    const runtimeSetting = state.value.initialData?.[setting];

    const defaultSetting = typeof runtimeSetting === 'string' ? runtimeSetting : JSON.stringify(runtimeSetting);

    return JSON.parse((state.value.data?.[setting] as string) ?? defaultSetting);
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

    state.value.initialData = { ...runtimeConfigPublic, ...result };
  };

  const changedFields = computed(() => {
    const config = state.value?.initialData ?? {};
    const currentData = state.value?.data ?? {};

    if (!currentData || Object.keys(currentData).length === 0) {
      return { entries: [] as Array<[string, unknown]>, keys: [] as string[] };
    }

    const entries = Object.entries(currentData).filter(([key, value]) => !(key in config) || config[key] !== value);

    return {
      entries,
      keys: entries.map(([key]) => key),
    };
  });

  const dirtyKeys = computed(() => changedFields.value.keys);
  const settingsIsDirty = computed(() => changedFields.value.keys.length > 0);

  const saveSiteSettings: SaveSiteSettings = async () => {
    try {
      state.value.loading = true;

      const settings = [
        ...Object.entries(state.value.data || {}).map(([key, val]) => ({
          key,
          value: typeof val === 'string' ? val : JSON.stringify(val ?? ''),
        })),
      ];
      await sdk.plentysystems.setConfiguration({ settings });

      state.value.initialData = { ...state.value.initialData, ...state.value.data };
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : typeof error === 'string' ? error : 'Failed to save settings';
      send({
        message,
        type: 'negative',
      });
      console.error('Error saving settings:', error);
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  return {
    ...toRefs(state.value),
    updateSetting,
    getSetting,
    getBooleanSetting,
    getNumberSetting,
    getJsonSetting,
    settingsIsDirty,
    dirtyKeys,
    saveSiteSettings,
    setInitialData,
  };
};
