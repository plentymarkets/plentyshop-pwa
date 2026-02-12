import { addComponent, createResolver, defineNuxtModule } from 'nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'paypal',
  },
  setup() {
    const resolver = createResolver(import.meta.url);

    addComponent({
      name: 'PayPalExpressButton',
      filePath: resolver.resolve('./runtime/components/PayPalExpressButton.vue'),
    });
  },
});
