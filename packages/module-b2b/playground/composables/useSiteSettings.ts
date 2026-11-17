/**
 * Stand-in for the shop's `useSiteSettings`, which only exists in the shop app.
 * Keeps the settings in memory so the extension can run in this playground.
 */
export const useSiteSettings = (setting?: string) => {
  const staged = useState<Record<string, string>>('playground-site-settings', () => ({}));

  const getSetting = () => (setting ? (staged.value[setting] ?? '') : '');
  const updateSetting = (value: string | number) => {
    if (setting) {
      staged.value = { ...staged.value, [setting]: String(value) };
    }
  };

  return {
    getSetting,
    getBooleanSetting: (fallback = false) => (getSetting() === '' ? fallback : getSetting() === 'true'),
    getNumberSetting: (fallback = 0) => (getSetting() === '' ? fallback : Number(getSetting())),
    getJsonSetting: () => {
      try {
        return JSON.parse(getSetting() || '[]');
      } catch {
        return [];
      }
    },
    updateSetting,
  };
};
