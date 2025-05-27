import { cartGetters, orderGetters } from '@plentymarkets/shop-api';
import type {ApplepayType, ConfigResponse, PayPalAddToCartCallback} from '~/components/PayPal/types';

const loadExternalScript = async () => {
  return new Promise((resolve, reject) => {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js';
    scriptElement.type = 'text/javascript';
    scriptElement.addEventListener('error', reject);
    scriptElement.addEventListener('load', resolve);
    document.head.append(scriptElement);
  });
};

const showErrorNotification = (message: string) => {
  useNotification().send({
    type: 'negative',
    message,
  });
};

export const useApplePay = () => {
  const state = useState(`useApplePay`, () => ({
    scriptLoaded: false,
    script: {} as ApplepayType,
    config: {} as ConfigResponse,
  }));

  const initialize = async () => {
    const { data: cart } = useCart();
    const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
    const { getScript } = usePayPal();
    const script = await getScript(currency.value, true);

    if (!script) return false;

    if (!state.value.scriptLoaded) {
      await loadExternalScript();
      state.value.scriptLoaded = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state.value.script = (script as any).Applepay() as ApplepayType;
    state.value.config = await state.value.script.config();

    return true;
  };

  const createPaymentRequest = () => {
    const { data: cart } = useCart();
    return {
      countryCode: state.value.config.countryCode,
      merchantCapabilities: state.value.config.merchantCapabilities,
      supportedNetworks: state.value.config.supportedNetworks,
      currencyCode: state.value.config.currencyCode,
      requiredShippingContactFields: [],
      requiredBillingContactFields: ['postalAddress'],
      total: {
        type: 'final',
        label: useRuntimeConfig().public.storename ?? 'PlentyONE Shop',
        amount: cartGetters.getTotals(cart.value).total.toString(),
      },
    } as ApplePayJS.ApplePayPaymentRequest;
  };

  const processPayment = (emits: { (event: "button-clicked", callback: PayPalAddToCartCallback): Promise<void> }) => {
    const { processingOrder } = useProcessingOrder();
    const { createTransaction, captureOrder, createPlentyOrder, createPlentyPaymentFromPayPalOrder } = usePayPal();
    const { clearCartItems } = useCart();
    const localePath = useLocalePath();
    const { $i18n } = useNuxtApp();
    const { emit } = usePlentyEvent();

    try {
      const paymentRequest = createPaymentRequest();
      const paymentSession = new ApplePaySession(14, paymentRequest);

      paymentSession.onvalidatemerchant = async (event: ApplePayJS.ApplePayValidateMerchantEvent) => {
        try {
          console.log('onvalidatemerchant', event);
          await emits('button-clicked', async (successfully: boolean) => {
            console.log('button-clicked', successfully);
            if (!successfully) {
              paymentSession.abort();
              return;
            }
          });

          const validationData = await state.value.script.validateMerchant({
            validationUrl: event.validationURL,
          });
          paymentSession.completeMerchantValidation(validationData.merchantSession);
        } catch(e) {
          console.log(e);
          paymentSession.abort();
        }
      };

      paymentSession.onpaymentauthorized = async (event: ApplePayJS.ApplePayPaymentAuthorizedEvent) => {
        try {
          const transaction = await createTransaction({
            type: 'basket',
          });
          if (!transaction || !transaction.id) {
            showErrorNotification($i18n.t('storefrontError.order.createFailed'));
            return;
          }

          const order = await createPlentyOrder();
          if (!order || !order.order || !order.order.id) {
            showErrorNotification($i18n.t('storefrontError.order.createFailed'));
            return;
          }

          try {
            await state.value.script.confirmOrder({
              orderId: transaction.id,
              token: event.payment.token,
              billingContact: event.payment.billingContact,
            });
          } catch (error) {
            showErrorNotification(error?.toString() ?? $i18n.t('errorMessages.paymentFailed'));
            return;
          }

          await captureOrder(transaction.id);
          await createPlentyPaymentFromPayPalOrder(transaction.id, order.order.id);

          processingOrder.value = true;
          paymentSession.completePayment(ApplePaySession.STATUS_SUCCESS);
          emit('module:clearCart', null);
          clearCartItems();

          emit('frontend:orderCreated', order);
          navigateTo(localePath(paths.confirmation + '/' + order.order.id + '/' + order.order.accessKey));
        } catch (error: unknown) {
          showErrorNotification(error?.toString() ?? $i18n.t('errorMessages.paymentFailed'));
          paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
        }
      };

      paymentSession.addEventListener('cancel', () => {
        paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
      });

      paymentSession.begin();
    } catch(e) {
      console.log(e);
    }
  };

  const checkIsEligible = async () => {
    try {
      if (
        (await initialize()) &&
        typeof ApplePaySession !== 'undefined' &&
        state.value.script &&
        ApplePaySession &&
        ApplePaySession.canMakePayments() &&
        state.value.config.isEligible
      ) {
        await useSdk().plentysystems.doHandleAllowPaymentApplePay({
          canMakePayments: true,
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    initialize,
    checkIsEligible,
    processPayment,
    ...toRefs(state.value),
  };
};
