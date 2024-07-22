// app.config.ts
export const appConfiguration = {
  head: {
    viewport: 'minimum-scale=1, initial-scale=1, width=device-width',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { name: 'description', content: 'plentyshop PWA' },
      { name: 'theme-color', content: '#0C7992' },
    ],
    link: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/favicon.ico' },
    ],
  },
};
