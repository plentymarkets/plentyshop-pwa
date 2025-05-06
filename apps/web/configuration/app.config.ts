export const metaDefaults = {
  title: process.env.NUXT_PUBLIC_META_TITLE || 'PlentyONE Shop',
  description: process.env.NUXT_PUBLIC_META_DESCRIPTION || process.env.METADESC || 'Demo shop for PlentyONE Shop',
  keywords: process.env.NUXT_PUBLIC_META_KEYWORDS || process.env.METAKEYWORDS || 'PlentyONE, plentyshop, pwa',
  robots: process.env.NUXT_PUBLIC_ROBOTS || 'all',
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
      { property: 'og:title', content: process.env.NUXT_PUBLIC_OG_TITLE || 'PlentyONE Shop' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: process.env.NUXT_PUBLIC_OG_IMG || '/_nuxt-plenty/images/logo.svg' },
      { property: 'og:url', content: process.env.API_ENDPOINT },
    ],
    link: [
      { rel: 'icon', href: process.env.NUXT_PUBLIC_FAVICON || '/_nuxt-plenty/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/_nuxt-plenty/favicon.ico' },
    ],
    title: metaDefaults.title,
  },
};
