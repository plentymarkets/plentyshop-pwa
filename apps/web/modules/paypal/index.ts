import {
  addComponentsDir,
  addComponent,
  addImportsDir,
  addTemplate,
  createResolver,
  defineNuxtModule,
  addPlugin,
} from 'nuxt/kit';

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
      priority: 1,
    });
    addComponent({
      name: 'PayPalButtons',
      filePath: resolver.resolve('./runtime/components/PayPalButtons.vue'),
      global: true,
      priority: 100,
    });

    addImportsDir(resolver.resolve('./runtime/composables/**'));

    addPlugin({
      src: resolver.resolve('./runtime/plugins/registerPaymentComponent'),
      mode: 'all',
    });
  },
});
