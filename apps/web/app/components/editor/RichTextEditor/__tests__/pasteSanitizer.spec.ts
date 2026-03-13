import { describe, it, expect } from 'vitest';

describe('stripInlineFontSizesFromHtml', () => {
  it('should remove inline font-size styles', () => {
    const input = '<p style="font-size: 20px;">Hello</p>';

    const result = stripInlineFontSizesFromHtml(input);

    expect(result).toBe('<p>Hello</p>');
  });

  it('should preserve other inline styles while removing font-size', () => {
    const input = '<p style="font-size: 20px; color: red; line-height: 1.5;">Hello</p>';

    const result = stripInlineFontSizesFromHtml(input);

    expect(result).toBe('<p style="color: red; line-height: 1.5">Hello</p>');
  });

  it('should remove legacy font size attribute from font tags', () => {
    const input = '<p>Hello <font size="7">world</font></p>';

    const result = stripInlineFontSizesFromHtml(input);

    expect(result).toBe('<p>Hello <font>world</font></p>');
  });

  it('should keep semantic tags intact', () => {
    const input = `
      <h2 style="font-size: 48px;">Title</h2>
      <p style="font-size: 18px;">Paragraph <strong>bold</strong></p>
      <ul>
        <li><span style="font-size: 22px;">Item</span></li>
      </ul>
    `;

    const result = stripInlineFontSizesFromHtml(input);

    expect(result).toContain('<h2>Title</h2>');
    expect(result).toContain('<p>Paragraph <strong>bold</strong></p>');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li><span>Item</span></li>');
  });

  it('should remove style attribute entirely if only font-size was present', () => {
    const input = '<span style="font-size: 26px;">Text</span>';

    const result = stripInlineFontSizesFromHtml(input);

    expect(result).toBe('<span>Text</span>');
  });
});
