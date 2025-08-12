import type {
  UpdateSetting,
  DeleteSetting,
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

  const {placeholderImg} = usePickerHelper();

  const updateSetting: UpdateSetting = async (value) => {
    state.value.data = { ...state.value.data, [setting as string]: value };
  };

const deleteSetting: DeleteSetting = () => {
  state.value.data = { ...state.value.data, [setting as string]: placeholderImg };
};

  const getSetting: GetSetting = () => {
    return (
      (state.value.data?.[setting as string] as string) ?? (useRuntimeConfig().public?.[setting as string] as string)
    );
  };

  const getJsonSetting: () => string[] = () => {
    const runtimeSetting = useRuntimeConfig().public?.[setting as string];

    const defaultSetting = typeof runtimeSetting === 'string' ? runtimeSetting : JSON.stringify(runtimeSetting);

    return JSON.parse((state.value.data?.[setting as string] as string) || defaultSetting);
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
        ...Object.entries(state.value.data.value || {}).map(([key, val]) => ({
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
    deleteSetting,
  };
};
