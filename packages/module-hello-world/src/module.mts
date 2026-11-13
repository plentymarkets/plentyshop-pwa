import { defineNuxtModule, createResolver, addPlugin, addComponentsDir, addImportsDir } from '@nuxt/kit';

export interface ModuleOptions {
  enabled: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    // Must match package.json "name" and runtime/extension.config.ts
    name: '@plentymarkets/hello-world',
    configKey: 'plentymarketsHelloWorld',
  },
  defaults: {
    enabled: true,
  },
  setup(options) {
    if (!options.enabled) {
      return;
    }

    const resolver = createResolver(import.meta.url);
    addPlugin(resolver.resolve('./runtime/plugins/hello-world.plugin'));
    addComponentsDir({ path: resolver.resolve('./runtime/components') });
    addImportsDir(resolver.resolve('./runtime/composables'));
  },
});
