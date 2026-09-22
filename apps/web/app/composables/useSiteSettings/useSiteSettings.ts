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

  return createSiteSettingsLogic(setting, state, {
    sdk: useSdk(),
    runtimeConfigPublic: useRuntimeConfig().public,
  });
};
