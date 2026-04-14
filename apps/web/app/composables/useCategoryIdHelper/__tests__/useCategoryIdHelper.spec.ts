import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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

  describe('strategy: prefix_except_default (default locale should have no prefix)', () => {
    beforeEach(() => {
      const i18n = getI18n();
      i18n.locale.value = 'en';
      i18n.strategy = 'prefix_except_default';
    });

    afterEach(() => {
      getI18n().strategy = 'prefix_and_default';
    });

    it('omits prefix when at default locale', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b/')).toBe('/b2b/');
    });

    it('omits prefix for path without locale at default locale', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/b2b/')).toBe('/b2b/');
    });

    it('strips stale locale and omits prefix when at default locale', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/de/b2b/')).toBe('/b2b/');
    });

    it('adds prefix when at non-default locale', () => {
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

    it('never adds locale prefix', () => {
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/en/b2b/')).toBe('/b2b/');
    });

    it('strips existing locale even for non-default', () => {
      getI18n().locale.value = 'de';
      expect(useCategoryIdHelper().getCorrectPreviewPathWithLocale('/de/b2b/')).toBe('/b2b/');
    });
  });
});