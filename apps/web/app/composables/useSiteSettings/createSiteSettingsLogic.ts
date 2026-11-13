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
  const { sdk, runtimeConfigPublic, settingsConfigKeys } = deps;
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
    try {
      return JSON.parse((state.value.data?.[setting] as string) ?? defaultSetting);
    } catch {
      return [];
    }
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
    state.value.backendKeys = Object.keys(result);
    state.value.data = { ...unpersistedDefaults.value, ...state.value.data };
  };

  const unpersistedDefaults = computed(() => {
    const backendKeys = state.value?.backendKeys ?? [];
    const currentData = state.value?.data ?? {};

    const hasDefaultValue = (value: unknown) => value !== undefined && value !== null && value !== '';

    return settingsConfigKeys
      .filter(
        (key) => !backendKeys.includes(key) && !(key in currentData) && hasDefaultValue(state.value.initialData[key]),
      )
      .reduce((acc: Record<string, SettingValue>, key) => {
        acc[key] = state.value.initialData[key] as SettingValue;
        return acc;
      }, {});
  });

  const changedFields = computed(() => {
    const config = state.value?.initialData ?? {};
    const currentData = state.value?.data ?? {};
    const backendKeys = state.value?.backendKeys ?? [];

    if (!currentData || Object.keys(currentData).length === 0) {
      return { entries: [] as Array<[string, unknown]>, keys: [] as string[] };
    }

    // A key counts as changed if its value differs from the backend-confirmed value, or if the
    // backend has no confirmed value for it at all yet (e.g. a frontend-only default merged in by
    // unpersistedDefaults) — even though it happens to match initialData's own default value.
    const entries = Object.entries(currentData).filter(
      ([key, value]) => !(key in config) || config[key] !== value || !backendKeys.includes(key),
    );

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
      state.value.data = { ...unpersistedDefaults.value, ...state.value.data };

      const submittedEntries = changedFields.value.entries;
      const settings = submittedEntries.map(([key, val]) => ({
        key,
        value: typeof val === 'string' ? val : JSON.stringify(val ?? ''),
      }));

      await sdk.plentysystems.setConfiguration({ settings });

      const submittedData = Object.fromEntries(submittedEntries) as Record<string, SettingValue>;
      state.value.initialData = { ...state.value.initialData, ...submittedData };
      state.value.backendKeys = [...new Set([...state.value.backendKeys, ...submittedEntries.map(([key]) => key)])];
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
