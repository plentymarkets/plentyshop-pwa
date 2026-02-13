import { addComponentsDir, addImportsDir, addTemplate, createResolver, defineNuxtModule } from 'nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'paypal',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);

    const typesTemplate = addTemplate({
      filename: 'types/paypal.d.ts',
      getContents: () => {
        return `export * from '${resolver.resolve('./runtime/types/index')}';`;
      },
    });

    nuxt.options.alias['#paypal/types'] = typesTemplate.dst;

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
    });

    addImportsDir(resolver.resolve('./runtime/composables/**'));
  },
});
