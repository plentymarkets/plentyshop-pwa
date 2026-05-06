import { withMermaid } from "vitepress-plugin-mermaid";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import sidebarIntroduction from "../guide/introduction/sidebar.json";
import sidebarThemes from "../guide/themes/sidebar.json";
import sidebarEditorCMS from "../guide/editor/sidebar.json";
import sidebarModules from "../guide/modules/sidebar.json";
import typedocSidebarComposables from "../reference/composables/typedoc-sidebar.json";
import typedocSidebarApi from "../reference/api/typedoc-sidebar.json";

// https://vitepress.dev/reference/site-config
export default withMermaid({
  head: [["link", { rel: "icon", href: "/favicon.png" }]],
  title: "PlentyONE Shop Docs",
  description:
    "Documentation for PlentyONE Shop, built with VueJS, Nuxt 3 and Alokai.",
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  srcExclude: [
    '**/README.md',
    'api-examples.md',
    'markdown-examples.md',
    '_**/*.md',
    '**/_*.md',
  ],
  vite: {
    optimizeDeps: {
      include: ["debug"],
    },
  },
  markdown: {
    theme: {
      light: "github-light-high-contrast",
      dark: "github-dark-high-contrast",
    },
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },
  mermaid: {},
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "Product",
        items: [
          { text: "Introduction", link: "/guide/product/" },
          {
            text: "Changelog",
            link: "https://github.com/plentymarkets/plentyshop-pwa/releases",
          },
        ],
      },
      {
        text: "Guide",
        items: [
          { text: "Quickstart", link: "/guide/introduction/quickstart" },
          { text: "Themes", link: "/guide/themes/" },
          { text: "Editor CMS", link: "/guide/editor/" },
          { text: "Modules", link: "/guide/modules/" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Composables", link: "/reference/composables/" },
          { text: "API Client", link: "/reference/api/" },
        ],
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: sidebarIntroduction,
        },
        {
          text: "Themes",
          items: sidebarThemes
        },
        {
          text: "Editor CMS",
          items: sidebarEditorCMS
        },
        {
          text: "Modules",
          items: sidebarModules,
        },
        {
          text: "References",
          items: [
            { text: "Composables", link: "/reference/composables/" },
            { text: "API Client", link: "/reference/api/" },
          ],
        },
        {
          text: "Support",
          items: [
            {
              text: "Changelog",
              link: "https://github.com/plentymarkets/plentyshop-pwa/releases",
            },
            {
              text: "FAQ",
              link: "/guide/product/faq.md",
            },
            {
              text: "Troubleshooting",
              link: "/guide/introduction/troubleshooting.md",
            }
          ],
        }
      ],

      "/reference/": [
        {
          text: "Composables",
          items: typedocSidebarComposables,
        },
        {
          text: "API",
          items: typedocSidebarApi,
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/plentymarkets/plentyshop-pwa",
      },
      {
        icon: "linkedin",
        link: "https://www.linkedin.com/company/plentyone-ecommerce/",
      },
      { icon: "facebook", link: "https://www.facebook.com/plentyonecommerce/" },
      {
        icon: "instagram",
        link: "https://www.instagram.com/plentyone_ecommerce/",
      },
      { icon: "youtube", link: "https://www.youtube.com/@PlentyONE_ecommerce" },
    ],

    search: {
      provider: "local",
    },

    externalLinkIcon: true,
  },
});
