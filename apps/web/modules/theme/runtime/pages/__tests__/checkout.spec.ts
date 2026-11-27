import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import Checkout from '../checkout.vue';

const { hasCheckoutAddress, showBillingAddressSection } = vi.hoisted(() => ({
  hasCheckoutAddress: { value: false },
  showBillingAddressSection: { value: false },
}));

mockNuxtImport('useCheckout', () => () => ({
  cart: ref({ items: [{ id: 1 }], isExportDelivery: false }),
  cartIsEmpty: ref(false),
  cartLoading: ref(false),
  persistShippingAddress: vi.fn(),
  persistBillingAddress: vi.fn(),
  setBillingSkeleton: vi.fn(),
  setShippingSkeleton: vi.fn(),
  showBillingAddressSection: toRef(showBillingAddressSection, 'value'),
}));
mockNuxtImport('useCheckoutAddress', () => () => ({
  countryHasDelivery: ref(false),
  hasCheckoutAddress: toRef(hasCheckoutAddress, 'value'),
}));
mockNuxtImport('useFeatureFlag', () => () => ref(false));
mockNuxtImport('useSiteSettings', () => () => ({ getSetting: () => '', getBooleanSetting: () => false }));
mockNuxtImport('useLocalizedPath', () => () => (path: string) => path);
mockNuxtImport('usePreferredDelivery', () => () => ({ preferredDeliveryAvailable: ref(false) }));
mockNuxtImport('usePaymentMethods', () => () => ({ fetchPaymentMethods: vi.fn() }));
mockNuxtImport('usePayPal', () => () => ({ getScript: vi.fn() }));
mockNuxtImport('useCheckoutPagePaymentAndShipping', () => () => ({
  paymentLoading: ref(false),
  shippingLoading: ref(false),
  handleShippingMethodUpdate: vi.fn(),
  handlePaymentMethodUpdate: vi.fn(),
}));
mockNuxtImport('useDynamicPaymentButtons', () => () => ({ createOrderLoading: ref(false) }));
mockNuxtImport('usePlentyEvent', () => () => ({ emit: vi.fn() }));
mockNuxtImport('useLogEvent', () => () => ({ logOpeningCheckout: vi.fn() }));
mockNuxtImport('onNuxtReady', () => () => {});
mockNuxtImport('callOnce', () => async (callback: () => Promise<void>) => callback());

const slotStub = { template: '<div><slot /></div>' };
const stubWithTestId = (testId: string) => ({ template: `<div data-testid="${testId}" />` });

const mountCheckout = () =>
  mountSuspended(Checkout, {
    global: {
      stubs: {
        NuxtLayout: slotStub,
        OrderSummary: { template: '<div data-testid="order-summary"><slot /></div>' },
        ClientOnly: slotStub,
        UiDivider: true,
        ContactInformation: stubWithTestId('contact-information'),
        AddressContainer: stubWithTestId('address-container'),
        ShippingMethod: stubWithTestId('shipping-method'),
        PreferredDeliveryPackstationFinder: true,
        PreferredDelivery: true,
        CheckoutPayment: stubWithTestId('checkout-payment'),
        CustomerReference: stubWithTestId('customer-reference'),
        CustomerWish: stubWithTestId('customer-wish'),
        CheckoutGeneralTerms: stubWithTestId('general-terms'),
        UiCartProductCard: stubWithTestId('cart-item'),
        Coupon: stubWithTestId('coupon'),
        CheckoutExportDeliveryHint: true,
        PaymentButtons: stubWithTestId('payment-buttons'),
        ModuleComponentRendering: true,
        GuaranteeNotice: true,
        GuaranteeNoticeBanner: true,
      },
    },
  });

const orderDetailTestIds = [
  'shipping-method',
  'checkout-payment',
  'customer-reference',
  'customer-wish',
  'general-terms',
  'coupon',
  'payment-buttons',
];

describe('theme checkout page', () => {
  beforeEach(() => {
    hasCheckoutAddress.value = false;
    showBillingAddressSection.value = false;
  });

  describe('without a shipping address', () => {
    it('should show contact information, shipping address, cart items and summary', async () => {
      const wrapper = await mountCheckout();

      expect(wrapper.find('[data-testid="contact-information"]').exists()).toBe(true);
      expect(wrapper.findAll('[data-testid="address-container"]')).toHaveLength(1);
      expect(wrapper.find('[data-testid="cart-item"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="order-summary"]').exists()).toBe(true);
    });

    it.each(orderDetailTestIds)('should hide %s', async (testId) => {
      const wrapper = await mountCheckout();

      expect(wrapper.find(`[data-testid="${testId}"]`).exists()).toBe(false);
    });

    it('should show the billing address when it differs from the shipping address', async () => {
      showBillingAddressSection.value = true;

      const wrapper = await mountCheckout();

      expect(wrapper.findAll('[data-testid="address-container"]')).toHaveLength(2);
    });
  });

  describe('with a shipping address', () => {
    it.each(orderDetailTestIds)('should show %s', async (testId) => {
      hasCheckoutAddress.value = true;

      const wrapper = await mountCheckout();

      expect(wrapper.find(`[data-testid="${testId}"]`).exists()).toBe(true);
    });
  });
});
