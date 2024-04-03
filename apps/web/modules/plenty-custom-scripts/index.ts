import { createResolver, defineNuxtModule } from 'nuxt/kit';
import fs from 'node:fs';

export interface ModuleOptions {
  priority: number;
  stylesheet: string;
  scripts: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'customScripts',
  },

  defaults: {
    priority: Number(process.env.CONFIG_PRIORITY) ?? 1,
    stylesheet: process.env.STYLESHEET ?? '',
    scripts: process.env.SCRIPTS ?? '',
  },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    fs.writeFileSync(resolve('./assets/scripts.js'), options.scripts);
    fs.writeFileSync(resolve('./assets/styles.css'), options.stylesheet);

    nuxt.options.css.push(resolve('./assets/styles.css'));

    nuxt.options.app.head.script ||= [];

    nuxt.options.app.head.script?.push({
      src: resolve('./assets/scripts.js'),
    });
  },
});
