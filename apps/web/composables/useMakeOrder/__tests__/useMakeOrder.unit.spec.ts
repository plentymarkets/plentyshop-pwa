import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useMakeOrder } from '../useMakeOrder';
import { ApiError } from '@plentymarkets/shop-api';

describe('useMakeOrder', () => {

    describe('createOrder', () => {

        const { useSdk } = vi.hoisted(() => {
            return {
                useSdk: vi.fn().mockReturnValue({
                    plentysystems: {}
                })
            }
        });

        const { useHandleError } = vi.hoisted(() => {
            return {
                useHandleError: vi.fn()
            }
        });

        mockNuxtImport('useSdk', () => {
            return useSdk
        });

        mockNuxtImport('useHandleError', () => {
            return useHandleError
        });

        it('should add shippingPrivacyHintAccepted to additionalInformation', async () => {
            const { createOrder } = useMakeOrder();
            const additionalInformationSpy = vi.fn();

            useSdk.mockImplementation(() => {
                return {
                    plentysystems: {
                        doAdditionalInformation: additionalInformationSpy,
                        doPreparePayment: vi.fn(),
                        doPlaceOrder: vi.fn(),
                        doExecutePayment: vi.fn()
                    }
                }
            });

            await createOrder({
                paymentId: 1,
                shippingPrivacyHintAccepted: true,
            });

            expect(additionalInformationSpy).toHaveBeenCalledWith({
                orderContactWish: null,
                orderCustomerSign: null,
                shippingPrivacyHintAccepted: true,
                templateType: 'checkout',
            });
        });

        it('should call useHandleError if additionalInformation fails', async () => {
            const additionalInformationSpy = vi.fn().mockImplementation(() => {
                throw new ApiError({
                    key: 'error',
                    code: '500',
                    message: 'error',
                    cause: {},
                });
            });
            const handleErrorSpy = vi.fn();

            useSdk.mockImplementation(() => {
                return {
                    plentysystems: {
                        doAdditionalInformation: additionalInformationSpy,
                        doPreparePayment: vi.fn(),
                        doPlaceOrder: vi.fn(),
                        doExecutePayment: vi.fn()
                    }
                }
            });

            const { createOrder } = useMakeOrder();

            try {
                await createOrder({
                    paymentId: 1,
                    shippingPrivacyHintAccepted: true,
                });
            } catch (error) {
                expect(handleErrorSpy).toHaveBeenCalled();
            }
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
            const handleErrorSpy = vi.fn();

            useSdk.mockImplementation(() => {
                return {
                    plentysystems: {
                        doAdditionalInformation: vi.fn(),
                        doPreparePayment: preparePaymentSpy,
                        doPlaceOrder: vi.fn(),
                        doExecutePayment: vi.fn()
                    }
                }
            });

            const { createOrder } = useMakeOrder();

            try {
                await createOrder({
                    paymentId: 1,
                    shippingPrivacyHintAccepted: true,
                });
            } catch (error) {
                expect(handleErrorSpy).toHaveBeenCalled();
            }
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
            const handleErrorSpy = vi.fn();

            useSdk.mockImplementation(() => {
                return {
                    plentysystems: {
                        doAdditionalInformation: vi.fn(),
                        doPreparePayment: vi.fn(),
                        doPlaceOrder: placeOrderSpy,
                        doExecutePayment: vi.fn()
                    }
                }
            });

            const { createOrder } = useMakeOrder();

            try {
                await createOrder({
                    paymentId: 1,
                    shippingPrivacyHintAccepted: true,
                });
            } catch (error) {
                expect(handleErrorSpy).toHaveBeenCalled();
            }
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
            const handleErrorSpy = vi.fn();

            useSdk.mockImplementation(() => {
                return {
                    plentysystems: {
                        doAdditionalInformation: vi.fn(),
                        doPreparePayment: vi.fn(),
                        doPlaceOrder: vi.fn(),
                        doExecutePayment: executePaymentSpy
                    }
                }
            });

            const { createOrder } = useMakeOrder();

            try {
                await createOrder({
                    paymentId: 1,
                    shippingPrivacyHintAccepted: true,
                });
            } catch (error) {
                expect(handleErrorSpy).toHaveBeenCalled();
            }
        });

        it('should set processingOrder to false if any call fails', async () => {
            const additionalInformationSpy = vi.fn().mockImplementation(() => {
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
                        doAdditionalInformation: additionalInformationSpy,
                        doPreparePayment: vi.fn(),
                        doPlaceOrder: vi.fn(),
                        doExecutePayment: vi.fn()
                    }
                }
            });

            const { createOrder } = useMakeOrder();

            try {
                await createOrder({
                    paymentId: 1,
                    shippingPrivacyHintAccepted: true,
                });
            } catch (error) {
                expect(useProcessingOrder().processingOrder.value).toBe(false);
            }
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
                        doAdditionalInformation: vi.fn(),
                        doPreparePayment: vi.fn(),
                        doPlaceOrder: orderFailSpy,
                        doExecutePayment: vi.fn()
                    }
                }
            });

            const { createOrder, loading } = useMakeOrder();

            try {
                await createOrder({
                    paymentId: 1,
                    shippingPrivacyHintAccepted: true,
                });
            } catch (error) {
                expect(loading.value).toBe(false);
            }
        });

        it('should not continue if doAdditionalInformation fails', async () => {
            const additionalInformationSpy = vi.fn().mockImplementation(() => {
                throw new ApiError({
                    key: 'error',
                    code: '500',
                    message: 'error',
                    cause: {},
                });
            });

            const doPreparePaymentSpy = vi.fn();

            useSdk.mockImplementation(() => {
                return {
                    plentysystems: {
                        doAdditionalInformation: additionalInformationSpy,
                        doPreparePayment: doPreparePaymentSpy,
                        doPlaceOrder: vi.fn(),
                        doExecutePayment: vi.fn()
                    }
                }
            });

            const { createOrder } = useMakeOrder();

            try {
                await createOrder({
                    paymentId: 1,
                    shippingPrivacyHintAccepted: true,
                });
            } catch (error) {
                expect(doPreparePaymentSpy).not.toHaveBeenCalled();
            }
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
                        doAdditionalInformation: vi.fn(),
                        doPreparePayment: preparePaymentSpy,
                        doPlaceOrder: doPlaceOrderSpy,
                        doExecutePayment: vi.fn()
                    }
                }
            });

            const { createOrder } = useMakeOrder();

            try {
                await createOrder({
                    paymentId: 1,
                    shippingPrivacyHintAccepted: true,
                });
            } catch (error) {
                expect(doPlaceOrderSpy).not.toHaveBeenCalled();
            }
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
                        doAdditionalInformation: vi.fn(),
                        doPreparePayment: vi.fn(),
                        doPlaceOrder: placeOrderSpy,
                        doExecutePayment: doExecutePaymentSpy
                    }
                }
            });

            const { createOrder } = useMakeOrder();

            try {
                await createOrder({
                    paymentId: 1,
                    shippingPrivacyHintAccepted: true,
                });
            } catch (error) {
                expect(doExecutePaymentSpy).not.toHaveBeenCalled();
            }
        });
    });

});