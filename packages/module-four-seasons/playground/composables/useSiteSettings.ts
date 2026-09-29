/**
 * Stub for apps/web's `useSiteSettings` composable, so this playground can exercise the
 * module's real runtime code (including live reactivity) without the full PWA app.
 * Mirrors just the subset of the real contract the module actually uses.
 */
interface PlaygroundSiteSettingsState {
  data: Record<string, string>;
}

export const useSiteSettings = (setting?: string) => {
  const state = useState<PlaygroundSiteSettingsState>('playground-site-settings', () => ({ data: {} }));

  const getSetting = () => (setting ? state.value.data[setting] ?? '' : '');

  const getBooleanSetting = (fallback = false) => {
    const value = getSetting();
    return value === '' ? fallback : value === 'true';
  };

  const getNumberSetting = (fallback = 0) => {
    const value = getSetting();
    if (value === '') {
      return fallback;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const updateSetting = (value: unknown) => {
    if (setting) {
      state.value.data = { ...state.value.data, [setting]: String(value) };
    }
  };

  return { getSetting, getBooleanSetting, getNumberSetting, updateSetting };
};
