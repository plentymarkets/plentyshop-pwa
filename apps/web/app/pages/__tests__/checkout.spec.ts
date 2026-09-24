import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import Checkout from '../checkout.vue';

const { useCheckoutMock, useFeatureFlagMock, useSiteSettingsMock } = vi.hoisted(() => ({
  useCheckoutMock: vi.fn(),
  useFeatureFlagMock: vi.fn(),
  useSiteSettingsMock: vi.fn(),
}));

mockNuxtImport('useCheckout', () => useCheckoutMock);
mockNuxtImport('useFeatureFlag', () => useFeatureFlagMock);
mockNuxtImport('useSiteSettings', () => useSiteSettingsMock);
mockNuxtImport('useLocalizedPath', () => () => (path: string) => path);
mockNuxtImport('useCheckoutAddress', () => () => ({ countryHasDelivery: ref(false), hasCheckoutAddress: ref(false) }));
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

const noticeStub = {
  setup: () => ({ visible: useSiteSettings('showGuaranteeNotice').getBooleanSetting(true) }),
  template: '<div v-if="visible" data-testid="notice-link" />',
};
const bannerStub = { template: '<div data-testid="notice-banner" />' };
const slotStub = { template: '<div><slot /></div>' };
const emptyStub = { template: '<div />' };

describe('checkout guarantee notice', () => {
  const enabled = ref(true);
  const visible = ref<boolean | undefined>(undefined);
  const mode = ref('');

  const mountCheckout = () =>
    mountSuspended(Checkout, {
      global: {
        stubs: {
          NuxtLayout: slotStub,
          OrderSummary: slotStub,
          ClientOnly: slotStub,
          GuaranteeNotice: noticeStub,
          GuaranteeNoticeBanner: bannerStub,
          UiDivider: emptyStub,
          ContactInformation: emptyStub,
          AddressContainer: emptyStub,
          ShippingMethod: emptyStub,
          PreferredDeliveryPackstationFinder: emptyStub,
          PreferredDelivery: emptyStub,
          CheckoutPayment: emptyStub,
          CustomerReference: emptyStub,
          CustomerWish: emptyStub,
          CheckoutGeneralTerms: emptyStub,
          UiCartProductCard: emptyStub,
          Coupon: emptyStub,
          CheckoutExportDeliveryHint: emptyStub,
          PaymentButtons: emptyStub,
          ModuleComponentRendering: emptyStub,
        },
      },
    });

  beforeEach(() => {
    vi.clearAllMocks();
    enabled.value = true;
    visible.value = undefined;
    mode.value = '';
    useFeatureFlagMock.mockReturnValue(enabled);
    useCheckoutMock.mockReturnValue({
      cart: ref({ items: [], isExportDelivery: false }),
      cartIsEmpty: ref(false),
      cartLoading: ref(false),
      persistShippingAddress: vi.fn(),
      persistBillingAddress: vi.fn(),
      setBillingSkeleton: vi.fn(),
      setShippingSkeleton: vi.fn(),
      showBillingAddressSection: ref(false),
    });
    useSiteSettingsMock.mockImplementation((key: string) => ({
      getSetting: () => (key === GUARANTEE_NOTICE_DISPLAY_MODE_SETTING ? mode.value : ''),
      getBooleanSetting: (fallback = false) => visible.value ?? fallback,
    }));
  });

  it('should show the link and dialog by default', async () => {
    const wrapper = await mountCheckout();

    expect(wrapper.find('[data-testid="notice-link"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="notice-banner"]').exists()).toBe(false);
  });

  it('should show the link and dialog for an unknown mode', async () => {
    mode.value = 'unknown';
    const wrapper = await mountCheckout();

    expect(wrapper.find('[data-testid="notice-link"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="notice-banner"]').exists()).toBe(false);
  });

  it('should show the banner directly for inline mode', async () => {
    mode.value = GUARANTEE_NOTICE_DISPLAY_MODE.Inline;
    const wrapper = await mountCheckout();

    expect(wrapper.find('[data-testid="notice-banner"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="notice-link"]').exists()).toBe(false);
  });

  it('should hide both variants when the visibility setting is disabled', async () => {
    mode.value = GUARANTEE_NOTICE_DISPLAY_MODE.Inline;
    visible.value = false;
    const wrapper = await mountCheckout();

    expect(wrapper.find('[data-testid="notice-banner"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="notice-link"]').exists()).toBe(false);
  });

  it('should hide both variants when the feature flag is disabled', async () => {
    enabled.value = false;
    const wrapper = await mountCheckout();

    expect(wrapper.find('[data-testid="notice-banner"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="notice-link"]').exists()).toBe(false);
  });
});
