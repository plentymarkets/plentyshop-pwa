import { describe, expect, it } from 'vitest';
import { parseGoogleMapsHtml } from '~/utils/parseGoogleMapsHtml';

describe('parseGoogleMapsHtml', () => {
  it('returns a single html segment when no Google Maps iframe is present', () => {
    const html = '<p>Hello world</p>';
    expect(parseGoogleMapsHtml(html)).toEqual([{ type: 'html', content: html }]);
  });

  it('extracts a Google Maps iframe into a map segment', () => {
    const embedUrl = 'https://www.google.com/maps/embed?pb=test';
    const html = `<p>Before</p><iframe src="${embedUrl}" width="100%" height="600"></iframe><p>After</p>`;

    expect(parseGoogleMapsHtml(html)).toEqual([
      { type: 'html', content: '<p>Before</p>' },
      { type: 'map', embedUrl, previewUrl: undefined, width: '100%', height: '600' },
      { type: 'html', content: '<p>After</p>' },
    ]);
  });

  it('reads data-map-preview from iframe attributes', () => {
    const embedUrl = 'https://www.google.com/maps/embed?pb=test';
    const preview = 'https://cdn.example.com/map.jpg';
    const html = `<iframe data-map-preview="${preview}" src="${embedUrl}" height="400"></iframe>`;

    expect(parseGoogleMapsHtml(html)).toEqual([
      { type: 'map', embedUrl, previewUrl: preview, width: undefined, height: '400' },
    ]);
  });
});
