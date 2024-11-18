import { mockNuxtImport } from '@nuxt/test-utils/runtime';

vi.mock('@plentymarkets/shop-api', () => ({
  paymentProviderGetters: {
    isPaymentMethodExcluded: vi.fn(),
    isPaymentMethodUnavailable: vi.fn(),
  },
  shippingProviderGetters: {
    getShippingProviders: vi.fn(),
    getDataPrivacyAgreementHint: vi.fn(),
  },
}));

vi.mock('~/utils/scollHelper', () => ({
  scrollToHTMLObject: vi.fn(),
}));

describe('useCheckoutPagePaymentAndShipping', () => {
  let composable: ReturnType<typeof import('../useCheckoutPagePaymentAndShipping')['useCheckoutPagePaymentAndShipping']>;

  beforeEach(() => {
    composable = require('~/composables/useCheckoutPagePaymentAndShipping').useCheckoutPagePaymentAndShipping();
  });

  afterEach(() => {
    clearNuxtState();
    vi.resetAllMocks();
  });

  it('should handle shipping method update correctly', async () => {
    const mockSaveShippingMethod = vi.fn().mockResolvedValue({});
    const mockFetchPaymentMethods = vi.fn().mockResolvedValue({});
    const mockGetCart = vi.fn().mockResolvedValue({});
    const mockSavePaymentMethod = vi.fn().mockResolvedValue({});
    const mockSend = vi.fn().mockResolvedValue({});

    const mockCart = { value: { methodOfPaymentId: 1 } };
    const mockSelectedShippingMethod = { value: {} };
    const mockPaymentMethods = { value: { list: [{ id: 2 }] } };

    mockNuxtImport('useCart', () => ({
      getCart: mockGetCart,
      data: mockCart,
    }));

    mockNuxtImport('usePaymentMethods', () => ({
      savePaymentMethod: mockSavePaymentMethod,
      fetchPaymentMethods: mockFetchPaymentMethods,
    }));

    mockNuxtImport('useCartShippingMethods', () => ({
      saveShippingMethod: mockSaveShippingMethod,
      selectedMethod: mockSelectedShippingMethod,
    }));

    mockNuxtImport('useNotification', () => ({
      send: mockSend,
    }));

    const { isPaymentMethodExcluded, isPaymentMethodUnavailable } = require('@plentymarkets/shop-api').paymentProviderGetters;

    isPaymentMethodExcluded.mockReturnValue(true);
    isPaymentMethodUnavailable.mockReturnValue(false);

    await composable.handleShippingMethodUpdate('1');

    expect(mockSaveShippingMethod).toHaveBeenCalledWith(1);
    expect(mockFetchPaymentMethods).toHaveBeenCalled();
    expect(mockGetCart).toHaveBeenCalled();
    expect(mockSend).toHaveBeenCalledWith({
      message: 'billing.methodChanged',
      type: 'warning',
    });
    expect(mockSavePaymentMethod).toHaveBeenCalledWith(2);
  });

  it('should validate shipping terms correctly', () => {
    const mockSetShippingPrivacyAgreementErrors = vi.fn();
    const mockScrollToHTMLObject = require('~/utils/scollHelper').scrollToHTMLObject;

    const mockShippingPrivacyAgreement = { value: false };
    const mockSelectedShippingMethod = { value: { id: 1 } };

    mockNuxtImport('useAdditionalInformation', () => ({
      shippingPrivacyAgreement: mockShippingPrivacyAgreement,
      setShippingPrivacyAgreementErrors: mockSetShippingPrivacyAgreementErrors,
    }));

    const { getDataPrivacyAgreementHint } = require('@plentymarkets/shop-api').shippingProviderGetters;
    getDataPrivacyAgreementHint.mockReturnValue(true);

    const result = composable.validateShippingTerms();

    expect(mockSetShippingPrivacyAgreementErrors).toHaveBeenCalledWith(true);
    expect(mockScrollToHTMLObject).toHaveBeenCalledWith('#shipping-agreement-checkbox');
    expect(result).toBe(false);
  });
});