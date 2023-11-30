import { defineConfig } from 'vitepress';
import typedocSidebar from '../reference/composables/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'plentyShop PWA Docs',
  description: 'Documentation of plentyShop PWA',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Composables', link: '/reference/composables/' },
    ],

    sidebar: [
      {
        text: 'Composables',
        items: typedocSidebar,
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
});
