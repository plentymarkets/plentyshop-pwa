import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../useCategoryIdHelper';

describe('getCorrectPreviewPathWithLocale', () => {
  const getI18n = () => useNuxtApp().$i18n;

  beforeEach(() => {
    getI18n().locale.value = 'en';
  });

  it('should handle absolute URL', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('https://host.tld/en/b2b/')).toBe('/en/b2b/');
  });

  it('should handle protocol-relative URL', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('//host.tld/en/b2b/')).toBe('/en/b2b/');
  });

  it('should handle relative path', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b/')).toBe('/en/b2b/');
  });

  it('should add locale when missing', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/b2b/')).toBe('/en/b2b/');
  });

  it('should swap stale locale with current one', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/de/b2b/')).toBe('/en/b2b/');
  });

  it('should preserve query and hash', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b/?foo=bar#x')).toBe('/en/b2b/?foo=bar#x');
  });

  it('should preserve path without trailing slash', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b')).toBe('/en/b2b');
  });

  describe('when locale is switched to de', () => {
    beforeEach(() => {
      getI18n().locale.value = 'de';
    });

    it('should replace en prefix with de', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b/')).toBe('/de/b2b/');
    });

    it('should keep de prefix as-is', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/de/b2b/')).toBe('/de/b2b/');
    });

    it('should add de prefix when no locale in path', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/b2b/')).toBe('/de/b2b/');
    });

    it('should handle absolute URL with de locale', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('https://host.tld/en/b2b/')).toBe('/de/b2b/');
    });
  });

  describe('strategy: prefix_except_default (default locale should have no prefix)', () => {
    beforeEach(() => {
      const i18n = getI18n();
      i18n.locale.value = 'en';
      i18n.strategy = 'prefix_except_default';
    });

    afterEach(() => {
      getI18n().strategy = 'prefix_and_default';
    });

    it('should omit prefix when at default locale', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b/')).toBe('/b2b/');
    });

    it('should omit prefix for path without locale at default locale', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/b2b/')).toBe('/b2b/');
    });

    it('should strip stale locale and omit prefix when at default locale', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/de/b2b/')).toBe('/b2b/');
    });

    it('should add prefix when at non-default locale', () => {
      getI18n().locale.value = 'de';
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b/')).toBe('/de/b2b/');
    });
  });

  describe('strategy: no_prefix', () => {
    beforeEach(() => {
      getI18n().strategy = 'no_prefix';
    });

    afterEach(() => {
      getI18n().strategy = 'prefix_and_default';
    });

    it('should never add locale prefix', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b/')).toBe('/b2b/');
    });

    it('should strip existing locale even for non-default', () => {
      getI18n().locale.value = 'de';
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/de/b2b/')).toBe('/b2b/');
    });
  });
});
