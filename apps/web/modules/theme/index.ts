import { createResolver, defineNuxtModule, extendPages } from 'nuxt/kit';

const CHECKOUT_PAGE_NAME = 'checkout';
const OVERRIDDEN_COMPONENTS = ['AddressFormShipping', 'AddressFormBilling'];

export default defineNuxtModule({
  meta: {
    name: 'theme',
  },
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    extendPages((pages) => {
      const checkoutPage = pages.find((page) => page.name === CHECKOUT_PAGE_NAME);
      if (checkoutPage) {
        checkoutPage.file = resolve('./runtime/pages/checkout.vue');
      }
    });

    nuxt.hook('components:extend', (components) => {
      for (const component of components) {
        if (OVERRIDDEN_COMPONENTS.includes(component.pascalName)) {
          component.filePath = resolve(`./runtime/components/${component.pascalName}/${component.pascalName}.vue`);
        }
      }
    });
  },
});
