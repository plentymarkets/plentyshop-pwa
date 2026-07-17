import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { useSiteSettingsMock } = vi.hoisted(() => ({
  useSiteSettingsMock: vi.fn(),
}));

mockNuxtImport('useSiteSettings', () => useSiteSettingsMock);

describe('useUrlTrailingSlash', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('resolvePathTrailingSlash - NEVER mode', () => {
    beforeEach(() => {
      useSiteSettingsMock.mockReturnValue({
        getSetting: () => 1,
      });
    });

    it('should remove trailing slash from paths', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { resolvePathTrailingSlash } = useUrlTrailingSlash();

      expect(resolvePathTrailingSlash('/foo/')).toBe('/foo');
      expect(resolvePathTrailingSlash('/foo/bar/')).toBe('/foo/bar');
    });

    it('should preserve paths without trailing slash', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { resolvePathTrailingSlash } = useUrlTrailingSlash();

      expect(resolvePathTrailingSlash('/foo')).toBe('/foo');
      expect(resolvePathTrailingSlash('/foo/bar')).toBe('/foo/bar');
    });

    it('should preserve root slash', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { resolvePathTrailingSlash } = useUrlTrailingSlash();

      expect(resolvePathTrailingSlash('/')).toBe('/');
    });

    it('should preserve query strings and hashes', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { resolvePathTrailingSlash } = useUrlTrailingSlash();

      expect(resolvePathTrailingSlash('/foo?x=1')).toBe('/foo?x=1');
      expect(resolvePathTrailingSlash('/foo?x=1#h')).toBe('/foo?x=1#h');
      expect(resolvePathTrailingSlash('/foo/#h')).toBe('/foo#h');
    });

    it('should handle empty path', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { resolvePathTrailingSlash } = useUrlTrailingSlash();

      expect(resolvePathTrailingSlash('')).toBe('');
    });
  });

  describe('resolvePathTrailingSlash - ALWAYS mode', () => {
    beforeEach(() => {
      useSiteSettingsMock.mockReturnValue({
        getSetting: () => 2,
      });
    });

    it('should add trailing slash to paths', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { resolvePathTrailingSlash } = useUrlTrailingSlash();

      expect(resolvePathTrailingSlash('/foo')).toBe('/foo/');
      expect(resolvePathTrailingSlash('/foo/bar')).toBe('/foo/bar/');
    });

    it('should preserve paths with trailing slash', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { resolvePathTrailingSlash } = useUrlTrailingSlash();

      expect(resolvePathTrailingSlash('/foo/')).toBe('/foo/');
      expect(resolvePathTrailingSlash('/foo/bar/')).toBe('/foo/bar/');
    });

    it('should preserve root slash', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { resolvePathTrailingSlash } = useUrlTrailingSlash();

      expect(resolvePathTrailingSlash('/')).toBe('/');
    });

    it('should add trailing slash before query strings and hashes', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { resolvePathTrailingSlash } = useUrlTrailingSlash();

      expect(resolvePathTrailingSlash('/foo?x=1')).toBe('/foo/?x=1');
      expect(resolvePathTrailingSlash('/foo?x=1#h')).toBe('/foo/?x=1#h');
      expect(resolvePathTrailingSlash('/foo#h')).toBe('/foo/#h');
    });

    it('should handle empty path', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { resolvePathTrailingSlash } = useUrlTrailingSlash();

      expect(resolvePathTrailingSlash('')).toBe('');
    });
  });

  describe('resolvePathTrailingSlash - NO_CHANGE mode', () => {
    beforeEach(() => {
      useSiteSettingsMock.mockReturnValue({
        getSetting: () => 0,
      });
    });

    it('should preserve paths as-is', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { resolvePathTrailingSlash } = useUrlTrailingSlash();

      expect(resolvePathTrailingSlash('/foo')).toBe('/foo');
      expect(resolvePathTrailingSlash('/foo/')).toBe('/foo/');
    });
  });

  describe('applyToUrl - NEVER mode', () => {
    beforeEach(() => {
      useSiteSettingsMock.mockReturnValue({
        getSetting: () => 1,
      });
    });

    it('should remove trailing slash from absolute URLs', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { applyToUrl } = useUrlTrailingSlash();

      expect(applyToUrl('https://example.com/foo/')).toBe('https://example.com/foo');
      expect(applyToUrl('https://example.com/foo/bar/')).toBe('https://example.com/foo/bar');
    });

    it('should preserve absolute URLs without trailing slash', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { applyToUrl } = useUrlTrailingSlash();

      expect(applyToUrl('https://example.com/foo')).toBe('https://example.com/foo');
      expect(applyToUrl('https://example.com/foo/bar')).toBe('https://example.com/foo/bar');
    });

    it('should preserve root slash in absolute URLs', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { applyToUrl } = useUrlTrailingSlash();

      expect(applyToUrl('https://example.com/')).toBe('https://example.com/');
    });

    it('should handle fallback for malformed URLs', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { applyToUrl } = useUrlTrailingSlash();

      expect(applyToUrl('/foo/')).toBe('/foo');
    });
  });

  describe('applyToUrl - ALWAYS mode', () => {
    beforeEach(() => {
      useSiteSettingsMock.mockReturnValue({
        getSetting: () => 2,
      });
    });

    it('should add trailing slash to absolute URLs', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { applyToUrl } = useUrlTrailingSlash();

      expect(applyToUrl('https://example.com/foo')).toBe('https://example.com/foo/');
      expect(applyToUrl('https://example.com/foo/bar')).toBe('https://example.com/foo/bar/');
    });

    it('should preserve absolute URLs with trailing slash', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { applyToUrl } = useUrlTrailingSlash();

      expect(applyToUrl('https://example.com/foo/')).toBe('https://example.com/foo/');
      expect(applyToUrl('https://example.com/foo/bar/')).toBe('https://example.com/foo/bar/');
    });

    it('should preserve root slash in absolute URLs', async () => {
      const { useUrlTrailingSlash } = await import('../useUrlTrailingSlash');
      const { applyToUrl } = useUrlTrailingSlash();

      expect(applyToUrl('https://example.com/')).toBe('https://example.com/');
    });
  });
});
