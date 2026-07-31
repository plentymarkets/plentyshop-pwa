import { validateUrl, isCategoryHref, isStaticPageHref } from '../url.helper';

describe('validateUrl', () => {
  it.each([
    ['https://example.com', true],
    ['http://example.com', true],
    ['https://localhost', true],
    ['https://example.com/path?q=1', true],
    ['  https://example.com  ', true],
    ['example.com', false],
    ['ftp://example.com', false],
    ['', false],
    ['/some/path', false],
    ['javascript:void(0)', false],
    ['not-a-url', false],
  ])('should return %s for "%s"', (url, expected) => {
    expect(validateUrl(url)).toBe(expected);
  });
});

describe('isCategoryHref', () => {
  it.each([
    ['/c/123', true],
    ['/c/shoes/boots', true],
    ['/category/shoes', true],
    ['/en/category/accessories', true],
    ['/imprint', false],
    ['/contact', false],
    ['https://example.com/shop', false],
    ['', false],
  ])('should return %s for "%s"', (href, expected) => {
    expect(isCategoryHref(href)).toBe(expected);
  });
});

describe('isStaticPageHref', () => {
  it.each([
    ['/imprint', true],
    ['/contact', true],
    ['/en/about', true],
    ['/c/123', false],
    ['/category/shoes', false],
    ['https://example.com', false],
    ['example.com', false],
    ['', false],
  ])('should return %s for "%s"', (href, expected) => {
    expect(isStaticPageHref(href)).toBe(expected);
  });
});
