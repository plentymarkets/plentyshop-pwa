import { describe, it, expect } from 'vitest';

describe('decodeHtmlEntities', () => {
  it('should return empty string for undefined or empty input', () => {
    expect(decodeHtmlEntities()).toBe('');
    expect(decodeHtmlEntities('')).toBe('');
  });

  it('should return original string when there are no HTML entities', () => {
    const input = 'Plain text without entities';
    expect(decodeHtmlEntities(input)).toBe(input);
  });

  it('should decode individual HTML entities', () => {
    expect(decodeHtmlEntities('&lt;')).toBe('<');
    expect(decodeHtmlEntities('&gt;')).toBe('>');
    expect(decodeHtmlEntities('&amp;')).toBe('&');
    expect(decodeHtmlEntities('&quot;')).toBe('"');
    expect(decodeHtmlEntities('&#039;')).toBe("'");
  });

  it('should decode a string with multiple entities mixed with text', () => {
    const input = '&lt;span style="color:#88aa8a;"&gt;Example of a flexible text element&lt;/span&gt; &amp; more text';
    const output = '<span style="color:#88aa8a;">Example of a flexible text element</span> & more text';

    expect(decodeHtmlEntities(input)).toBe(output);
  });
});
