/** Default consent copy (matches westdeutsche.info wording). */
export const googleMapsConsentCopy = {
  message:
    'Auf dieser Seite ist eine Karte von Google Maps eingebunden. Beim Laden der Karte wird eine Verbindung zu Servern von Google hergestellt. Dabei können personenbezogene Daten, insbesondere Ihre IP-Adresse sowie Informationen zu Ihrem Browser und Gerät, an Google übertragen und dort verarbeitet werden.',
  loadButton: 'Karte laden',
};

/**
 * Optional static preview images keyed by a fragment of the embed URL (e.g. Google place id).
 * Upload an exact map screenshot to the CDN and add an entry here when available.
 */
export const googleMapsEmbedPreviews: Record<string, string> = {
  // Komplett Konzept – Dunkerstraße 29, Borken (/Kontakt)
  '0x47b863f6972473f1': '/_nuxt-plenty/images/google-map-kontakt.jpg',
};

export const getGoogleMapsPreviewUrl = (embedUrl: string, dataPreview?: string): string | undefined => {
  if (dataPreview) return dataPreview;

  for (const [key, url] of Object.entries(googleMapsEmbedPreviews)) {
    if (embedUrl.includes(key)) return url;
  }

  return undefined;
};
