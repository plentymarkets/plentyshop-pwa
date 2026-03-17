declare module '#sitemap-data' {
  import type { NuxtPage } from '@nuxt/schema';
  export const sitemapPages: string[];
  export const buildTime: string;
}
