import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useSiteSettings } from '../../useSiteSettings';

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

    const { updateSetting, saveSiteSettings } = useSiteSettings('useAvif');
    updateSetting('true');
    await saveSiteSettings();

    expect(setConfiguration).toHaveBeenCalledWith({ settings: [{ key: 'useAvif', value: 'true' }] });
  });
});
