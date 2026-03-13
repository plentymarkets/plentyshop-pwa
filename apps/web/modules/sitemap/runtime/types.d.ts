declare module '#sitemap-data' {
  import type { NuxtPage } from '@nuxt/schema';
  export const sitemapPages: NuxtPage[];
  export const buildTime: string;
}
