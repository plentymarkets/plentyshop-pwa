import { describe, it, expect, beforeEach } from 'vitest';
import '../useCategoryIdHelper';

describe('getCorrectPreviewPathWithLocale', () => {
  const getI18n = () => useNuxtApp().$i18n;

  beforeEach(() => {
    getI18n().locale.value = 'en';
  });

  it('handles absolute URL', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('https://host.tld/en/b2b/')).toBe('/en/b2b/');
  });

  it('handles protocol-relative URL', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('//host.tld/en/b2b/')).toBe('/en/b2b/');
  });

  it('handles relative path', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b/')).toBe('/en/b2b/');
  });

  it('adds locale when missing', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/b2b/')).toBe('/en/b2b/');
  });

  it('swaps stale locale with current one', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/de/b2b/')).toBe('/en/b2b/');
  });

  it('preserves query and hash', () => {
    expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b/?foo=bar#x')).toBe('/en/b2b/?foo=bar#x');
  });

  describe('when locale is switched to de', () => {
    beforeEach(() => {
      getI18n().locale.value = 'de';
    });

    it('replaces en prefix with de', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b/')).toBe('/de/b2b/');
    });

    it('keeps de prefix as-is', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/de/b2b/')).toBe('/de/b2b/');
    });

    it('adds de prefix when no locale in path', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/b2b/')).toBe('/de/b2b/');
    });

    it('handles absolute URL with de locale', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('https://host.tld/en/b2b/')).toBe('/de/b2b/');
    });
  });
});