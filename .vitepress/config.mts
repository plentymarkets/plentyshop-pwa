import { defineConfig } from 'vitepress'
import typedocSidebarComposables from '../reference/composables/typedoc-sidebar.json';
import typedocSidebarSdk from '../reference/sdk/typedoc-sidebar.json';
import typedocSidebarApi from '../reference/api/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "plentyShop PWA Docs",
  description: "Documentation for plentyShop PWA, built with VueJS, Nuxt 3 and Vue Storefront.",
  base: "/plentyshop-pwa-docs/",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Guide',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Composables', link: '/reference/composables/' },
          { text: 'SDK', link: '/reference/sdk/' },
          { text: 'API', link: '/reference/api/' }
        ]
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        }
      ],

      '/reference/': [
        {
          text: 'Composables',
          items: typedocSidebarComposables
        },
        {
          text: 'SDK',
          items: typedocSidebarSdk
        },
        {
          text: 'API',
          items: typedocSidebarApi
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/plentymarkets/plentyshop-pwa' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/plentysystems/mycompany/' },
      { icon: 'facebook', link: 'https://www.facebook.com/plentymarkets' },
      { icon: 'instagram', link: 'https://www.instagram.com/plentysystems' },
      { icon: 'youtube', link: 'https://www.youtube.com/channel/UCauJsvmhbPNp6ii7tCGwxMg' },
      { icon: 'twitter', link: 'https://twitter.com/plentymarkets'}
    ]
  }
})
