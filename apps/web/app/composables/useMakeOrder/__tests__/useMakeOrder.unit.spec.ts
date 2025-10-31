import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useMakeOrder } from '../useMakeOrder';
import { ApiError } from '@plentymarkets/shop-api';

describe('useMakeOrder', () => {
  describe('createOrder', () => {
    beforeEach(() => {
      vi.resetAllMocks();
      vi.clearAllMocks();
    });

    const { useSdk } = vi.hoisted(() => {
      return {
        useSdk: vi.fn().mockReturnValue({
          plentysystems: {},
        }),
      };
    });

    const { useHandleError } = vi.hoisted(() => {
      return {
        useHandleError: vi.fn(),
      };
    });

    mockNuxtImport('useSdk', () => {
      return useSdk;
    });

    mockNuxtImport('useHandleError', () => {
      return useHandleError;
    });

    it('should call useHandleError if doPreparePayment fails', async () => {
      const preparePaymentSpy = vi.fn().mockImplementation(() => {
        throw new ApiError({
          key: 'error',
          code: '500',
          message: 'error',
          cause: {},
        });
      });

      useSdk.mockImplementation(() => {
        return {
          plentysystems: {
            doPreparePayment: preparePaymentSpy,
            doPlaceOrder: vi.fn(),
            doExecutePayment: vi.fn(),
          },
        };
      });

      const { createOrder } = useMakeOrder();

      await createOrder({
        paymentId: 1,
        shippingPrivacyHintAccepted: true,
      });
      expect(useHandleError).toHaveBeenCalled();
    });

    it('should call useHandleError if doPlaceOrder fails', async () => {
      const placeOrderSpy = vi.fn().mockImplementation(() => {
        throw new ApiError({
          key: 'error',
          code: '500',
          message: 'error',
          cause: {},
        });
      });

      useSdk.mockImplementation(() => {
        return {
          plentysystems: {
            doPreparePayment: vi.fn(),
            doPlaceOrder: placeOrderSpy,
            doExecutePayment: vi.fn(),
          },
        };
      });

      const { createOrder } = useMakeOrder();

      await createOrder({
        paymentId: 1,
        shippingPrivacyHintAccepted: true,
      });
      expect(useHandleError).toHaveBeenCalled();
    });

    it('should call useHandleError if doExecutePayment fails', async () => {
      const executePaymentSpy = vi.fn().mockImplementation(() => {
        throw new ApiError({
          key: 'error',
          code: '500',
          message: 'error',
          cause: {},
        });
      });

      useSdk.mockImplementation(() => {
        return {
          plentysystems: {
            doPreparePayment: vi.fn(),
            doPlaceOrder: vi.fn(),
            doExecutePayment: executePaymentSpy,
          },
        };
      });

      const { createOrder } = useMakeOrder();

      await createOrder({
        paymentId: 1,
        shippingPrivacyHintAccepted: true,
      });
      expect(useHandleError).toHaveBeenCalled();
    });

    it('should set processingOrder to false if any call fails', async () => {
      useSdk.mockImplementation(() => {
        return {
          plentysystems: {
            doPreparePayment: vi.fn(),
            doPlaceOrder: vi.fn(),
            doExecutePayment: vi.fn(),
          },
        };
      });

      const { createOrder } = useMakeOrder();

      await createOrder({
        paymentId: 1,
        shippingPrivacyHintAccepted: true,
      });
      expect(useProcessingOrder().processingOrder.value).toBe(false);
    });

    it('should set loading to false if any call fails', async () => {
      const orderFailSpy = vi.fn().mockImplementation(() => {
        throw new ApiError({
          key: 'error',
          code: '500',
          message: 'error',
          cause: {},
        });
      });

      useSdk.mockImplementation(() => {
        return {
          plentysystems: {
            doPreparePayment: vi.fn(),
            doPlaceOrder: orderFailSpy,
            doExecutePayment: vi.fn(),
          },
        };
      });

      const { createOrder, loading } = useMakeOrder();

      await createOrder({
        paymentId: 1,
        shippingPrivacyHintAccepted: true,
      });
      expect(loading.value).toBe(false);
    });

    it('should not continue if doPreparePayment fails', async () => {
      const preparePaymentSpy = vi.fn().mockImplementation(() => {
        throw new ApiError({
          key: 'error',
          code: '500',
          message: 'error',
          cause: {},
        });
      });

      const doPlaceOrderSpy = vi.fn();

      useSdk.mockImplementation(() => {
        return {
          plentysystems: {
            doPreparePayment: preparePaymentSpy,
            doPlaceOrder: doPlaceOrderSpy,
            doExecutePayment: vi.fn(),
          },
        };
      });

      const { createOrder } = useMakeOrder();

      await createOrder({
        paymentId: 1,
        shippingPrivacyHintAccepted: true,
      });
      expect(doPlaceOrderSpy).not.toHaveBeenCalled();
    });

    it('should not continue if doPlaceOrder fails', async () => {
      const placeOrderSpy = vi.fn().mockImplementation(() => {
        throw new ApiError({
          key: 'error',
          code: '500',
          message: 'error',
          cause: {},
        });
      });

      const doExecutePaymentSpy = vi.fn();

      useSdk.mockImplementation(() => {
        return {
          plentysystems: {
            doPreparePayment: vi.fn(),
            doPlaceOrder: placeOrderSpy,
            doExecutePayment: doExecutePaymentSpy,
          },
        };
      });

      const { createOrder } = useMakeOrder();

      await createOrder({
        paymentId: 1,
        shippingPrivacyHintAccepted: true,
      });
      expect(doExecutePaymentSpy).not.toHaveBeenCalled();
    });

    it('should call the error handling if doPreparePayment returns a error as http 200', async () => {
      const doPreparePayment = vi.fn().mockImplementation(() => {
        return {
          data: {
            type: 'errorCode',
            value: 'my prepayment error',
          },
        };
      });

      useSdk.mockImplementation(() => {
        return {
          plentysystems: {
            doPreparePayment: doPreparePayment,
            doPlaceOrder: vi.fn(),
            doExecutePayment: vi.fn(),
          },
        };
      });

      const { createOrder } = useMakeOrder();
      await createOrder({
        paymentId: 1,
        shippingPrivacyHintAccepted: true,
      });
      expect(useHandleError).toHaveBeenCalledWith(
        new ApiError({
          key: '',
          code: '400',
          message: 'my prepayment error',
          cause: 'my prepayment error',
        }),
      );
    });

    it('should always reset the order object when creating new order', async () => {
      const doPlaceOrder = vi.fn().mockImplementation(() => {
        return {
          data: {
            id: 1337,
          },
        };
      });

      const doPreparePaymentSuccess = vi.fn().mockImplementation(() => {
        return {
          data: {
            type: 'continue',
            value: 'my prepayment value',
          },
        };
      });

      useSdk.mockImplementation(() => {
        return {
          plentysystems: {
            doPreparePayment: doPreparePaymentSuccess,
            doPlaceOrder: doPlaceOrder,
            doExecutePayment: vi.fn(),
          },
        };
      });

      const { createOrder, data } = useMakeOrder();

      await createOrder({
        paymentId: 1,
        shippingPrivacyHintAccepted: true,
      });

      expect(data.value).toEqual({ id: 1337 });

      const doPreparePayment = vi.fn().mockImplementation(() => {
        return {
          data: {
            type: 'errorCode',
            value: 'my prepayment error',
          },
        };
      });

      useSdk.mockImplementation(() => {
        return {
          plentysystems: {
            doPreparePayment: doPreparePayment,
            doPlaceOrder: vi.fn(),
            doExecutePayment: vi.fn(),
          },
        };
      });

      await createOrder({
        paymentId: 1,
        shippingPrivacyHintAccepted: true,
      });
      expect(data.value).toEqual(null);
    });

    it('should return null if any call in createOrder fails', async () => {
      useSdk.mockImplementation(() => {
        return {
          plentysystems: {
            doPreparePayment: vi.fn(),
            doPlaceOrder: vi.fn(),
            doExecutePayment: vi.fn(),
          },
        };
      });

      const { createOrder } = useMakeOrder();

      const order = await createOrder({
        paymentId: 1,
        shippingPrivacyHintAccepted: true,
      });
      expect(order).toBeNull();
    });
  });
});
