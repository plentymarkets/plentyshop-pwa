/** Default consent copy (matches westdeutsche.info wording). */
export const googleMapsConsentCopy = {
  message:
    'Auf dieser Seite ist eine Karte von Google Maps eingebunden. Beim Laden der Karte wird eine Verbindung zu Servern von Google hergestellt. Dabei können personenbezogene Daten, insbesondere Ihre IP-Adresse sowie Informationen zu Ihrem Browser und Gerät, an Google übertragen und dort verarbeitet werden.',
  loadButton: 'Karte laden',
};

/**
 * Komplett Konzept Verwertungs GmbH – Google Business place (not the street-address pin).
 * https://www.google.com/maps/place/Komplett+Konzept+Verwertungs+GmbH/@51.9065934,6.7897926,17z
 */
export const googleMapsKontaktEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2461.4997136410116!2d6.7897926!3d51.9065934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8605480427df1%3A0x7d584a202efb24c6!2sKomplett%20Konzept%20Verwertungs%20GmbH!5e1!3m2!1sde!2sde!4v1767780998230!5m2!1sde!2sde';

/** CMS embed still points at Dunkerstraße 29 (address geocode on the neighbour building). */
const googleMapsKontaktEmbedOverrideKeys = [
  '0x47b863f6972473f1',
  '0x39987599c938c8cf',
  'Dunkerstra',
];

/**
 * Optional static preview images keyed by a fragment of the embed URL (e.g. Google place id).
 * Upload an exact map screenshot to the CDN and add an entry here when available.
 */
export const googleMapsEmbedPreviews: Record<string, string> = {
  // Komplett Konzept – /Kontakt (business place + legacy CMS address embed)
  '0x47b8605480427df1': '/_nuxt-plenty/images/google-map-kontakt.jpg',
  '0x47b863f6972473f1': '/_nuxt-plenty/images/google-map-kontakt.jpg',
};

export const resolveGoogleMapsEmbedUrl = (embedUrl: string): string => {
  if (googleMapsKontaktEmbedOverrideKeys.some((key) => embedUrl.includes(key))) {
    return googleMapsKontaktEmbedUrl;
  }

  return embedUrl;
};

export const getGoogleMapsPreviewUrl = (embedUrl: string, dataPreview?: string): string | undefined => {
  if (dataPreview) return dataPreview;

  const resolvedEmbedUrl = resolveGoogleMapsEmbedUrl(embedUrl);

  for (const [key, url] of Object.entries(googleMapsEmbedPreviews)) {
    if (resolvedEmbedUrl.includes(key) || embedUrl.includes(key)) return url;
  }

  return undefined;
};
