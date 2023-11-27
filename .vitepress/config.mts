import { defineConfig } from 'vitepress'
import sidebarProduct from '../guide/product/sidebar.json';
import sidebarSetup from '../guide/setup/sidebar.json';
import sidebarHowTo from '../guide/how-to/sidebar.json';
import sidebarConcept from '../guide/concept/sidebar.json';
import typedocSidebarComposables from '../reference/composables/typedoc-sidebar.json';
import typedocSidebarSdk from '../reference/sdk/typedoc-sidebar.json';
import typedocSidebarApi from '../reference/api/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  title: "plentyShop PWA Docs",
  description: "Documentation for plentyShop PWA, built with VueJS, Nuxt 3 and Vue Storefront.",
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: 'Product',
        items: [
          { text: 'Introduction', link: '/guide/product/' },
          { text: 'Changelog', link: 'https://github.com/plentymarkets/plentyshop-pwa/blob/main/docs/changelog/changelog_en.md'}
        ]
      },
      {
        text: 'Guide',
        items: [
          { text: 'Setup', link: '/guide/setup/system' },
          { text: 'How-To', link: '/guide/how-to/' },
          { text: 'Concept', link: '/guide/concept/' }
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
        },
        {
          text: 'How-To',
          items: sidebarHowTo
        },
        {
          text: 'Concept',
          items: sidebarConcept
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
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/plentysystems/' },
      { icon: 'facebook', link: 'https://www.facebook.com/plentymarkets' },
      { icon: 'instagram', link: 'https://www.instagram.com/plentysystems' },
      { icon: 'youtube', link: 'https://www.youtube.com/channel/UCauJsvmhbPNp6ii7tCGwxMg' },
      { icon: 'twitter', link: 'https://twitter.com/plentymarkets'}
    ],

    search: {
      provider: 'local'
    },

    externalLinkIcon: true,
  }
})
