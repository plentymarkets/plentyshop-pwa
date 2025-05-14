export const metaDefaults = {
  title: process.env.NUXT_PUBLIC_META_TITLE || 'PlentyONE Shop',
  description: process.env.NUXT_PUBLIC_META_DESCRIPTION || process.env.METADESC || 'Demo shop for PlentyONE Shop',
  keywords: process.env.NUXT_PUBLIC_META_KEYWORDS || process.env.METAKEYWORDS || 'PlentyONE, plentyshop, pwa',
  robots: process.env.NUXT_PUBLIC_ROBOTS || 'all',
};

export const openGraph = {
  title: process.env.NUXT_PUBLIC_OG_TITLE || process.env.OG_TITLE || 'PlentyONE Shop',
  image: process.env.NUXT_PUBLIC_OG_IMG || process.env.OG_IMG || '/_nuxt-plenty/images/logo.svg',
  type: process.env.NUXT_PUBLIC_OG_TYPE || process.env.OG_TYPE || 'website',
};

export const favicon = {
  icon: process.env.NUXT_PUBLIC_FAVICON || process.env.FAVICON || '/_nuxt-plenty/favicon.ico',
  appleTouchIcon: process.env.NUXT_PUBLIC_FAVICON || process.env.FAVICON || '/_nuxt-plenty/favicon.ico',
};

export const appConfiguration = {
  head: {
    viewport: 'minimum-scale=1, initial-scale=1, width=device-width',
    htmlAttrs: {
      lang: process.env.DEFAULTLANGUAGE ?? 'en',
    },
    meta: [
      { name: 'shop-name', content: process.env.STORENAME || 'PlentyONE GmbH' },
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
      { rel: 'preconnect', href: process.env.CDN_URL || '' },
      { rel: 'preconnect', href: process.env.API_ENDPOINT || '' },
    ],
    title: metaDefaults.title,
  },
};
