import { describe, it, expect } from 'vitest';

describe('safeSerializeJsonLd', () => {
  it('should serialize a plain object to JSON', () => {
    expect(safeSerializeJsonLd({ '@type': 'Product', name: 'Test' })).toBe(
      JSON.stringify({ '@type': 'Product', name: 'Test' }),
    );
  });

  it('should escape unsafe characters so the output cannot break out of a script tag', () => {
    const result = safeSerializeJsonLd({ name: '</script><img src=x onerror=alert(1)>' });

    expect(result).not.toContain('</script>');
  });

  it('should forward the space parameter for indentation', () => {
    const result = safeSerializeJsonLd({ a: 1 }, 2);

    expect(result).toBe(JSON.stringify({ a: 1 }, null, 2));
  });

  it('should return an empty string instead of throwing when JSON.stringify yields undefined', () => {
    expect(safeSerializeJsonLd(undefined)).toBe('');
    expect(
      safeSerializeJsonLd(() => {
        /* function values also serialize to undefined */
      }),
    ).toBe('');
  });
});
