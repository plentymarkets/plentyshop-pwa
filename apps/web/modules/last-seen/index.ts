import { addComponentsDir, addImports, addPlugin, createResolver, defineNuxtModule } from 'nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'last-seen',
    configKey: 'lastSeen',
  },
  defaults: {
    enabled: true,
    maxItems: 10,
  },
  setup() {
    const resolver = createResolver(import.meta.url);

    addImports({
      name: 'useLastSeen',
      as: 'useLastSeen',
      from: resolver.resolve('runtime/composables/useLastSeen'),
    });

    addComponentsDir({
      path: resolver.resolve('runtime/components'),
      global: true,
    });

    addPlugin(resolver.resolve('./runtime/plugin/addLastSeen.ts'));
  },
});
