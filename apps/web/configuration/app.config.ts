export const appConfiguration = {
  head: {
    viewport: 'minimum-scale=1, initial-scale=1, width=device-width',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { name: 'shop-name', content: 'plentyShop PWA Demo' },
      { name: 'description', content: process.env.METADESC || 'Demo shop for plentyShop PWA' },
      { name: 'keywords', content: process.env.METAKEYWORDS || 'plentysystems, plentyshop, pwa' },
      { name: 'theme-color', content: '#0C7992' },
      { property: 'og:title', content: process.env.OGTITLE || '' },
      { property: 'og:image', content: process.env.OGIMAGE || '' },
      { property: 'og:type', content: process.env.OGTYPE || 'website' },
      { property: 'og:url', content: process.env.OGURL || 'plentyshop.plentymarkets.com' },
      { property: 'og:site_name', content: process.env.OGSITENAME || 'plentyShop PWA Demo' },
      { property: 'og:description', content: process.env.OGDESCRIPTION || 'Demo shop for plentyShop PWA' },
    ],
    link: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/favicon.ico' },
    ],
    script: [{ src: 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js' }],
  },
};
