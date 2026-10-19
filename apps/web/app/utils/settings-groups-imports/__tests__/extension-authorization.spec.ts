import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { isExtensionAuthorized } = vi.hoisted(() => {
  return {
    isExtensionAuthorized: vi.fn(),
  };
});

mockNuxtImport('isExtensionAuthorized', () => isExtensionAuthorized);

describe('isSettingsPathAuthorized', () => {
  beforeEach(() => {
    isExtensionAuthorized.mockReset();
  });

  it('should return true without checking authorization when the path is a first-party component', async () => {
    const { isSettingsPathAuthorized } = await import('../extension-authorization');

    const result = isSettingsPathAuthorized('/app/components/Foo/settings/01.Bar.vue');

    expect(result).toBe(true);
    expect(isExtensionAuthorized).not.toHaveBeenCalled();
  });

  it('should return true without checking authorization when the package has no extension.config.ts', async () => {
    const { isSettingsPathAuthorized } = await import('../extension-authorization');

    const result = isSettingsPathAuthorized(
      '/node_modules/@plentymarkets/shop-module-mollie/dist/runtime/components/settings/01.Bar.vue',
    );

    expect(result).toBe(true);
    expect(isExtensionAuthorized).not.toHaveBeenCalled();
  });

  it('should return true without checking authorization for a local module without an extension.config.ts', async () => {
    const { isSettingsPathAuthorized } = await import('../extension-authorization');

    const result = isSettingsPathAuthorized('/modules/agency-custom-module/runtime/components/settings/01.Bar.vue');

    expect(result).toBe(true);
    expect(isExtensionAuthorized).not.toHaveBeenCalled();
  });

  it('should check authorization using the declared extension name for the real four-seasons module', async () => {
    const { isSettingsPathAuthorized } = await import('../extension-authorization');
    isExtensionAuthorized.mockReturnValue(false);

    const fourSeasonsSettingsPaths = import.meta.glob(
      '@workspace/node_modules/{*,@*/*}/{,*/}runtime/components/settings/**/*.vue',
    );
    const fourSeasonsSettingsPath = Object.keys(fourSeasonsSettingsPaths).find((path) => path.includes('four-seasons'));

    expect(fourSeasonsSettingsPath).toBeDefined();

    const result = isSettingsPathAuthorized(fourSeasonsSettingsPath as string);

    expect(isExtensionAuthorized).toHaveBeenCalledWith('@plentymarkets/four-seasons');
    expect(result).toBe(false);
  });
});
