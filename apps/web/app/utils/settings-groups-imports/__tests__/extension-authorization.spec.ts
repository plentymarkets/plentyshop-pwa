import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { isExtensionAuthorized } = vi.hoisted(() => {
  return {
    isExtensionAuthorized: vi.fn(),
  };
});

mockNuxtImport('isExtensionAuthorized', () => isExtensionAuthorized);

describe('extractRuntimeRoot', () => {
  it('should return the prefix up to and including runtime/ when the path contains it', async () => {
    const { extractRuntimeRoot } = await import('../extension-authorization');

    const result = extractRuntimeRoot('/node_modules/@scope/pkg/dist/runtime/components/settings/01.Bar.vue');

    expect(result).toBe('/node_modules/@scope/pkg/dist/runtime/');
  });

  it('should return null when the path does not contain a runtime/ segment', async () => {
    const { extractRuntimeRoot } = await import('../extension-authorization');

    const result = extractRuntimeRoot('/app/components/Foo/settings/01.Bar.vue');

    expect(result).toBeNull();
  });
});

describe('buildExtensionNameByRuntimeRoot', () => {
  it('should map the runtime root to the declared extension name', async () => {
    const { buildExtensionNameByRuntimeRoot } = await import('../extension-authorization');

    const result = buildExtensionNameByRuntimeRoot({
      '/node_modules/@scope/pkg/dist/runtime/extension.config.ts': { default: { name: '@scope/pkg' } },
    });

    expect(result).toEqual({ '/node_modules/@scope/pkg/dist/runtime/': '@scope/pkg' });
  });

  it('should skip configs without a declared name', async () => {
    const { buildExtensionNameByRuntimeRoot } = await import('../extension-authorization');

    const result = buildExtensionNameByRuntimeRoot({
      '/node_modules/@scope/pkg/dist/runtime/extension.config.ts': { default: {} },
      '/node_modules/@scope/other/dist/runtime/extension.config.ts': {},
    });

    expect(result).toEqual({});
  });

  it('should skip configs whose path has no extractable runtime root', async () => {
    const { buildExtensionNameByRuntimeRoot } = await import('../extension-authorization');

    const result = buildExtensionNameByRuntimeRoot({
      '/app/components/Foo/extension.config.ts': { default: { name: '@scope/pkg' } },
    });

    expect(result).toEqual({});
  });
});

describe('isSettingsPathAuthorized', () => {
  beforeEach(() => {
    isExtensionAuthorized.mockReset();
  });

  it('should return true without checking authorization when the path has no runtime root', async () => {
    const { isSettingsPathAuthorized } = await import('../extension-authorization');

    const result = isSettingsPathAuthorized('/app/components/Foo/settings/01.Bar.vue', {});

    expect(result).toBe(true);
    expect(isExtensionAuthorized).not.toHaveBeenCalled();
  });

  it('should return true without checking authorization when the runtime root has no declared extension', async () => {
    const { isSettingsPathAuthorized } = await import('../extension-authorization');

    const result = isSettingsPathAuthorized(
      '/node_modules/@plentymarkets/shop-module-mollie/dist/runtime/components/settings/01.Bar.vue',
      {},
    );

    expect(result).toBe(true);
    expect(isExtensionAuthorized).not.toHaveBeenCalled();
  });

  it('should check authorization using the declared extension name when the runtime root matches', async () => {
    const { isSettingsPathAuthorized } = await import('../extension-authorization');
    isExtensionAuthorized.mockReturnValue(true);

    const result = isSettingsPathAuthorized(
      '/node_modules/@plentymarkets/four-seasons/dist/runtime/components/settings/01.Bar.vue',
      { '/node_modules/@plentymarkets/four-seasons/dist/runtime/': '@plentymarkets/four-seasons' },
    );

    expect(isExtensionAuthorized).toHaveBeenCalledWith('@plentymarkets/four-seasons');
    expect(result).toBe(true);
  });

  it('should return false when the matched extension is not authorized', async () => {
    const { isSettingsPathAuthorized } = await import('../extension-authorization');
    isExtensionAuthorized.mockReturnValue(false);

    const result = isSettingsPathAuthorized(
      '/node_modules/@plentymarkets/four-seasons/dist/runtime/components/settings/01.Bar.vue',
      { '/node_modules/@plentymarkets/four-seasons/dist/runtime/': '@plentymarkets/four-seasons' },
    );

    expect(result).toBe(false);
  });
});
