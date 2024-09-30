// nuxt.config.d.ts
import { NuxtConfig } from '@nuxt/schema';

declare module '@nuxt/schema' {
  interface NuxtConfig {
    blokkli?: {
      editorOptions?: Record<string, any>;
      [key: string]: any;  
    };
  }
}
