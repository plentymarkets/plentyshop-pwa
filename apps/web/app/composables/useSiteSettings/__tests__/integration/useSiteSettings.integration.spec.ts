import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useSiteSettings } from '../../useSiteSettings';
import settingsConfig from '../../../../configuration/settings.config';

const { useRuntimeConfig } = vi.hoisted(() => ({
  useRuntimeConfig: vi.fn().mockReturnValue({ app: { baseURL: '/' }, public: { useAvif: false } }),
}));

mockNuxtImport('useRuntimeConfig', () => useRuntimeConfig);

describe('useSiteSettings integration', () => {
  beforeEach(() => {
    clearNuxtState();
  });

  it('seeds initialData from useRuntimeConfig().public', () => {
    const { getBooleanSetting } = useSiteSettings('useAvif');

    expect(getBooleanSetting()).toBe(false);
  });

  it('shares state across separate useSiteSettings() calls', () => {
    const { updateSetting } = useSiteSettings('useAvif');
    updateSetting('true');

    const { getBooleanSetting } = useSiteSettings('useAvif');

    expect(getBooleanSetting()).toBe(true);
  });

  it('calls the real SDK via useSdk() when saving', async () => {
    const setConfiguration = useSdk().plentysystems.setConfiguration as ReturnType<typeof vi.fn>;

    const { updateSetting, saveSiteSettings, setInitialData } = useSiteSettings('useAvif');
    const alreadyPersistedKeys = Object.keys(settingsConfig).filter((key) => key !== 'useAvif');
    setInitialData(alreadyPersistedKeys.map((key) => ({ key, originalKey: key, value: 'true' })));

    updateSetting('true');
    await saveSiteSettings();

    expect(setConfiguration).toHaveBeenCalledWith({ settings: [{ key: 'useAvif', value: 'true' }] });
  });

  it('also persists settings that only have a non-empty frontend default and were never saved to the backend', async () => {
    useRuntimeConfig.mockReturnValue({ app: { baseURL: '/' }, public: { ...settingsConfig, useAvif: false } });
    const setConfiguration = useSdk().plentysystems.setConfiguration as ReturnType<typeof vi.fn>;

    const { updateSetting, saveSiteSettings, setInitialData } = useSiteSettings('useAvif');
    setInitialData([]);

    updateSetting('true');
    await saveSiteSettings();

    const call = setConfiguration.mock.calls[0];
    expect(call).toBeDefined();
    const savedKeys = (call?.[0] as { settings: { key: string }[] }).settings.map(({ key }) => key);

    const configValues = settingsConfig as Record<string, unknown>;
    const expectedKeys = Object.keys(settingsConfig).filter(
      (key) => configValues[key] !== '' && configValues[key] !== null && configValues[key] !== undefined,
    );

    expect(savedKeys.sort()).toEqual(expectedKeys.sort());
  });
});
