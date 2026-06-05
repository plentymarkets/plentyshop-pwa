import { describe, expect, it } from 'vitest';
import {
  googleMapsKontaktEmbedUrl,
  resolveGoogleMapsEmbedUrl,
} from '~/configuration/googleMapsConsent.config';

describe('resolveGoogleMapsEmbedUrl', () => {
  const cmsEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2230.7163613511575!2d6.787646976347442!3d51.90695087190692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b863f6972473f1%3A0x39987599c938c8cf!2sDunkerstra%C3%9Fe%2029%2C%2046325%20Borken%2C%20Germany!5e1!3m2!1sen!2sin!4v1767780998230!5m2!1sen!2sin';

  it('replaces the Kontakt CMS address embed with the business place embed', () => {
    expect(resolveGoogleMapsEmbedUrl(cmsEmbedUrl)).toBe(googleMapsKontaktEmbedUrl);
    expect(googleMapsKontaktEmbedUrl).toContain('5e1');
  });

  it('leaves unrelated embed URLs unchanged', () => {
    const otherEmbed = 'https://www.google.com/maps/embed?pb=other-place';
    expect(resolveGoogleMapsEmbedUrl(otherEmbed)).toBe(otherEmbed);
  });
});
