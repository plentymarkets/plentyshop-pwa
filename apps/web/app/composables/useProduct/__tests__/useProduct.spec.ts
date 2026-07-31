import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useProduct } from '../useProduct';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';

const productId = ProductMock.item.id.toString();

const { mockUseHead } = vi.hoisted(() => ({ mockUseHead: vi.fn() }));
mockNuxtImport('useHead', () => mockUseHead);

const siteSettingsValue = ref('');
const { useSiteSettingsMock } = vi.hoisted(() => ({
  useSiteSettingsMock: vi.fn(() => ({
    getSetting: () => siteSettingsValue.value,
  })),
}));
mockNuxtImport('useSiteSettings', () => useSiteSettingsMock);

const runtimeConfigRef = { app: { baseURL: '/' }, public: { ogTitle: '' } };
const { useRuntimeConfigMock } = vi.hoisted(() => ({
  useRuntimeConfigMock: vi.fn(() => runtimeConfigRef),
}));
mockNuxtImport('useRuntimeConfig', () => useRuntimeConfigMock);

describe('useProduct', () => {
  it('should return Product', async () => {
    const { data: product } = useProduct(productId);

    expect(product.value).not.toBeUndefined();
  });
});

describe('useProduct setProductMeta title suffix fallback', () => {
  beforeEach(() => {
    mockUseHead.mockClear();
    siteSettingsValue.value = '';
    runtimeConfigRef.public.ogTitle = '';
  });

  it('should use useSiteSettings ogTitle as first priority', () => {
    siteSettingsValue.value = 'Site Setting Shop Name';
    runtimeConfigRef.public.ogTitle = 'Runtime Config Title';

    const { setProductMeta } = useProduct(productId);
    setProductMeta();

    expect(mockUseHead).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Site Setting Shop Name'),
      }),
    );
  });

  it('should fall back to runtimeConfig.ogTitle when site setting is empty', () => {
    siteSettingsValue.value = '';
    runtimeConfigRef.public.ogTitle = 'Runtime Config Title';

    const { setProductMeta } = useProduct(productId);
    setProductMeta();

    expect(mockUseHead).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Runtime Config Title'),
      }),
    );
  });
});
