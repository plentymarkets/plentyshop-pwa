export const metaDefaults = {
  title: process.env.METATITLE || process.env.NUXT_PUBLIC_META_TITLE || 'PlentyONE Shop',
  description: process.env.METADESC || process.env.NUXT_PUBLIC_META_DESCRIPTION || 'Demo shop for PlentyONE Shop',
  keywords: process.env.METAKEYWORDS || process.env.NUXT_PUBLIC_META_KEYWORDS || 'PlentyONE, plentyshop, pwa',
  robots: process.env.NUXT_PUBLIC_ROBOTS || 'all',
};

export const openGraph = {
  title: process.env.OG_TITLE || process.env.NUXT_PUBLIC_OG_TITLE || 'PlentyONE Shop',
  image: process.env.OG_IMG || process.env.NUXT_PUBLIC_OG_IMG || '/_nuxt-plenty/images/logo.svg',
  type: process.env.OG_TYPE || process.env.NUXT_PUBLIC_OG_TYPE || 'website',
};

export const favicon = {
  icon: process.env.FAVICON || process.env.NUXT_PUBLIC_FAVICON || '/_nuxt-plenty/favicon.ico',
  appleTouchIcon: process.env.FAVICON || process.env.NUXT_PUBLIC_FAVICON || '/_nuxt-plenty/favicon.ico',
};

export const appConfiguration = {
  head: {
    viewport: 'minimum-scale=1, initial-scale=1, width=device-width',
    htmlAttrs: {
      lang: process.env.DEFAULTLANGUAGE ?? 'en',
    },
    meta: [
      { name: 'description', content: metaDefaults.description },
      { name: 'keywords', content: metaDefaults.keywords },
      { name: 'robots', content: metaDefaults.robots },
      { name: 'theme-color', content: '#0C7992' },
      { property: 'og:title', content: openGraph.title },
      { property: 'og:type', content: openGraph.type },
      { property: 'og:image', content: openGraph.image },
      { property: 'og:url', content: process.env.API_ENDPOINT },
    ],
    link: [
      { rel: 'icon', href: favicon.icon },
      { rel: 'apple-touch-icon', href: favicon.appleTouchIcon },
    ],
    title: metaDefaults.title,
  },
};
