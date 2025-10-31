export const metaDefaults = {
  title: process.env.NUXT_PUBLIC_META_TITLE || process.env.METATITLE || 'PlentyONE Shop',
  description: process.env.NUXT_PUBLIC_META_DESCRIPTION || process.env.METADESC || 'Demo shop for PlentyONE Shop',
  keywords: process.env.NUXT_PUBLIC_META_KEYWORDS || process.env.METAKEYWORDS || 'PlentyONE, plentyshop, pwa',
  robots: process.env.NUXT_PUBLIC_ROBOTS || 'all',
  themeColor: process.env.NUXT_PUBLIC_PRIMARY_COLOR || '#062633',
};

export const openGraph = {
  title: process.env.NUXT_PUBLIC_OG_TITLE || process.env.OG_TITLE || 'PlentyONE Shop',
  image:
    process.env.NUXT_PUBLIC_OG_IMG ||
    process.env.OG_IMG ||
    'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/Logo/logo.png',
  type: process.env.NUXT_PUBLIC_OG_TYPE || process.env.OG_TYPE || 'website',
};

export const favicon = {
  appleTouchIcon: process.env.NUXT_PUBLIC_FAVICON || process.env.FAVICON || '/_nuxt-plenty/favicon.ico',
};

export const appConfiguration = {
  head: {
    viewport: 'minimum-scale=1, initial-scale=1, width=device-width',
    htmlAttrs: {
      lang: process.env.DEFAULTLANGUAGE ?? 'en',
    },
    meta: [
      { property: 'og:type', content: openGraph.type },
      { property: 'og:image', content: openGraph.image },
      { property: 'og:title', content: openGraph.title },
      { property: 'og:url', content: process.env.API_ENDPOINT },
    ],
  },
};
