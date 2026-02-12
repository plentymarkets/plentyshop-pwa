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

    addComponent({
      name: 'ApplePayButton',
      filePath: resolver.resolve('./runtime/components/ApplePayButton.vue'),
    });

    addComponent({
      name: 'GooglePayButton',
      filePath: resolver.resolve('./runtime/components/GooglePayButton.vue'),
    });

    addComponent({
      name: 'PayPalAPM',
      filePath: resolver.resolve('./runtime/components/PayPalAPM.vue'),
    });

    addComponent({
      name: 'PayPalCreditCardBuyButton',
      filePath: resolver.resolve('./runtime/components/PayPalCreditCardBuyButton.vue'),
    });

    addComponent({
      name: 'PayPalCreditCardForm',
      filePath: resolver.resolve('./runtime/components/PayPalCreditCardForm.vue'),
    });

    addComponent({
      name: 'PayPalInvoiceDetails',
      filePath: resolver.resolve('./runtime/components/PayPalInvoiceDetails.vue'),
    });

    addComponent({
      name: 'PayPalPayLaterBanner',
      filePath: resolver.resolve('./runtime/components/PayPalPayLaterBanner.vue'),
    });

    addComponent({
      name: 'PayPalPayUponInvoiceForm',
      filePath: resolver.resolve('./runtime/components/PayPalPayUponInvoiceForm.vue'),
    });
  },
});
