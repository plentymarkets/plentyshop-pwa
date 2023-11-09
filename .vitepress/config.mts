import { defineConfig } from 'vitepress'
import typedocSidebarComposables from '../reference/composables/typedoc-sidebar.json';
import typedocSidebarSdk from '../reference/sdk/typedoc-sidebar.json';
import typedocSidebarApi from '../reference/api/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "plentyShop PWA Docs",
  description: "A VitePress Site",
  base: "/plentyshop-pwa-docs/",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'Composables', link: '/reference/composables/'},
      { text: 'SDK', link: '/reference/sdk/'},
      { text: 'API', link: '/reference/api/'}
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
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
