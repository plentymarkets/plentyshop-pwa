import { createResolver, defineNuxtModule, addPlugin, addComponent, addImports, extendPages } from 'nuxt/kit';

export interface ModuleOptions {
  priority: number;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'starter',
  },

  defaults: {
    priority: Number(process.env.STARTER_PRIORITY) ?? 1,
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // addComponent({
    //   name: 'HelloWorld',
    //   filePath: resolver.resolve('./components/HelloWorld'),
    // });

    // addComponent({
    //   name: 'MegaMenu',
    //   filePath: resolver.resolve('./components/MegaMenu'),
    //   priority: options.priority,
    // });

    // addPlugin(resolver.resolve('./runtime/plugin'));

    // extendPages((pages) => {
    //   pages.unshift({
    //     name: 'Home',
    //     path: '/',
    //     file: resolver.resolve('./pages/HomePage'),
    //   });
    // });
  },
});
