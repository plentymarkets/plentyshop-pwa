import { defineConfig } from 'vitepress'
import typedocSidebarComposables from '../reference/composables/typedoc-sidebar.json';

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
      { text: 'Composables', link: '/reference/composables/'}
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Composables',
        items: typedocSidebarComposables
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
