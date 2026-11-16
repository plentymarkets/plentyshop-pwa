import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { useSiteSettingsMock } = vi.hoisted(() => ({
  useSiteSettingsMock: vi.fn((): { getJsonSetting: () => unknown } => ({ getJsonSetting: () => [] })),
}));

mockNuxtImport('useSiteSettings', () => useSiteSettingsMock);

describe('useCleanQuery', () => {
  const withWhitelist = (list: unknown) => useSiteSettingsMock.mockReturnValue({ getJsonSetting: () => list });

  beforeEach(() => {
    withWhitelist([]);
  });

  it('removes params that are not part of the cache key', async () => {
    withWhitelist(['page', 'lb.page']);
    const { useCleanQuery } = await import('../useCleanQuery');
    const { cleanQuery } = useCleanQuery();

    expect(cleanQuery({ page: '2', utm_source: 'x', 'lb.page': '1', fbclid: 'y' })).toEqual({
      page: '2',
      'lb.page': '1',
    });
  });

  it('is case sensitive', async () => {
    withWhitelist(['Currency']);
    const { useCleanQuery } = await import('../useCleanQuery');

    expect(useCleanQuery().cleanQuery({ Currency: 'EUR', currency: 'EUR' })).toEqual({ Currency: 'EUR' });
  });

  it('keeps everything when the whitelist is missing', async () => {
    withWhitelist([]);
    const { useCleanQuery } = await import('../useCleanQuery');

    expect(useCleanQuery().cleanQuery({ utm_source: 'x' })).toEqual({ utm_source: 'x' });
  });

  it('builds a clean full path including repeated params and hash', async () => {
    withWhitelist(['tagIds', 'page']);
    const { useCleanQuery } = await import('../useCleanQuery');
    const { cleanFullPath } = useCleanQuery();

    expect(
      cleanFullPath({ path: '/shoes', query: { tagIds: ['1', '2'], utm_source: 'x', page: '3' }, hash: '#top' }),
    ).toBe('/shoes?tagIds=1&tagIds=2&page=3#top');
    expect(cleanFullPath({ path: '/shoes', query: { utm_source: 'x' }, hash: '' })).toBe('/shoes');
  });

  it('keeps whitelisted bare params', async () => {
    withWhitelist(['page']);
    const { useCleanQuery } = await import('../useCleanQuery');

    expect(useCleanQuery().cleanFullPath({ path: '/shoes', query: { page: null, utm_source: null }, hash: '' })).toBe(
      '/shoes?page',
    );
  });

  it('keeps bare params when the whitelist is missing', async () => {
    withWhitelist([]);
    const { useCleanQuery } = await import('../useCleanQuery');

    expect(useCleanQuery().cleanFullPath({ path: '/shoes', query: { page: null }, hash: '' })).toBe('/shoes?page');
  });
});
