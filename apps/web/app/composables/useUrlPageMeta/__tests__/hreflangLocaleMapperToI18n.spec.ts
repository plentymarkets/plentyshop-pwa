import { describe, expect, it } from 'vitest';
import { hreflangLocaleMapperToI18n } from '../hreflangLocaleMapperToI18n';

describe('hreflangLocaleMapperToI18n', () => {
  it.each([
    ['no', 'nn'],
    ['sv', 'se'],
    ['zh', 'cn'],
    ['cs', 'cz'],
    ['vi', 'vn'],
  ])('should map hreflang locale %s to i18n locale %s', (hreflangLocale, i18nLocale) => {
    expect(hreflangLocaleMapperToI18n(hreflangLocale)).toBe(i18nLocale);
  });

  it('should return the input locale unchanged when no mapping exists', () => {
    expect(hreflangLocaleMapperToI18n('de')).toBe('de');
  });
});
