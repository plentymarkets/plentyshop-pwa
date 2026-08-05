import { describe, it, expect } from 'vitest';
import { detectCustomCode } from '../detectCustomCode';

describe('detectCustomCode', () => {
  it('should return empty array for empty content', () => {
    const hints = detectCustomCode('');
    expect(hints).toEqual([]);
  });

  it('should return empty array for content without style or script tags', () => {
    const html = '<div>Hello World</div><p>Test</p>';
    const hints = detectCustomCode(html);
    expect(hints).toEqual([]);
  });

  it('should detect style tag', () => {
    const html = '<style>.test { color: red; }</style><div>Content</div>';
    const hints = detectCustomCode(html);
    expect(hints).toHaveLength(1);
    expect(hints[0]).toEqual({
      type: 'css',
      message: 'customCodeHint.cssDetected',
    });
  });

  it('should detect script tag', () => {
    const html = '<script>console.log("test");</script><div>Content</div>';
    const hints = detectCustomCode(html);
    expect(hints).toHaveLength(1);
    expect(hints[0]).toEqual({
      type: 'js',
      message: 'customCodeHint.jsDetected',
    });
  });

  it('should detect both style and script tags', () => {
    const html = '<style>.test { color: red; }</style><script>console.log("test");</script>';
    const hints = detectCustomCode(html);
    expect(hints).toHaveLength(2);
    expect(hints[0]).toEqual({
      type: 'css',
      message: 'customCodeHint.cssDetected',
    });
    expect(hints[1]).toEqual({
      type: 'js',
      message: 'customCodeHint.jsDetected',
    });
  });

  it('should be case-insensitive', () => {
    const html = '<STYLE>.test { color: red; }</STYLE><SCRIPT>console.log("test");</SCRIPT>';
    const hints = detectCustomCode(html);
    expect(hints).toHaveLength(2);
  });

  it('should detect style tag with attributes', () => {
    const html = '<style type="text/css" media="screen">.test { color: red; }</style>';
    const hints = detectCustomCode(html);
    expect(hints).toHaveLength(1);
    expect(hints[0]?.type).toBe('css');
  });

  it('should detect script tag with attributes', () => {
    const html = '<script type="text/javascript" async>console.log("test");</script>';
    const hints = detectCustomCode(html);
    expect(hints).toHaveLength(1);
    expect(hints[0]?.type).toBe('js');
  });

  it('should not detect style or script in text content', () => {
    const html = '<div>This text mentions style and script tags</div>';
    const hints = detectCustomCode(html);
    expect(hints).toEqual([]);
  });

  it('should handle multiple style and script tags', () => {
    const html = `
      <style>.a { color: red; }</style>
      <style>.b { color: blue; }</style>
      <script>console.log("test1");</script>
      <script>console.log("test2");</script>
    `;
    const hints = detectCustomCode(html);
    expect(hints).toHaveLength(2);
  });

  it('should handle newlines and complex HTML', () => {
    const html = `
      <div>
        <style>
          .test { color: red; }
        </style>
        <p>Some content</p>
        <script>
          console.log("test");
        </script>
      </div>
    `;
    const hints = detectCustomCode(html);
    expect(hints).toHaveLength(2);
  });
});
