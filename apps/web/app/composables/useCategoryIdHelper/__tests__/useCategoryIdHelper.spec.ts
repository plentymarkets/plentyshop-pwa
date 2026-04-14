import { describe, it, expect } from 'vitest';
import '../useCategoryIdHelper';

describe('getCorrectPreviewPathWithLocale', () => {
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
});