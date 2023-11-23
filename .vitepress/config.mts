import { defineConfig } from 'vitepress'
import sidebarProduct from '../guide/product/sidebar.json';
import sidebarSetup from '../guide/setup/sidebar.json';
import typedocSidebarComposables from '../reference/composables/typedoc-sidebar.json';
import typedocSidebarSdk from '../reference/sdk/typedoc-sidebar.json';
import typedocSidebarApi from '../reference/api/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [['link', { rel: 'icon', href: '/plentyshop-pwa-docs/favicon.png' }]],
  title: "plentyShop PWA Docs",
  description: "Documentation for plentyShop PWA, built with VueJS, Nuxt 3 and Vue Storefront.",
  base: "/plentyshop-pwa-docs/",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: 'Guide',
        items: [
          { text: 'Setup', link: '/guide/setup/system' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Composables', link: '/reference/composables/' },
          { text: 'SDK', link: '/reference/sdk/' },
          { text: 'API Client', link: '/reference/api/' }
        ]
      },
      {
        text: 'Product',
        items: [
          { text: 'Introduction', link: '/guide/setup/' },
          { text: 'Changelog', link: 'https://github.com/plentymarkets/plentyshop-pwa/blob/main/docs/changelog/changelog_en.md'}
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Product',
          items: sidebarProduct
        },
        {
          text: 'Setup',
          items: sidebarSetup
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
    ],

    search: {
      provider: 'local'
    }
  }
})
