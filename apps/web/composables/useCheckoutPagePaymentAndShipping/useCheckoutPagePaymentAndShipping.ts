import { paymentProviderGetters, shippingProviderGetters } from '@plentymarkets/shop-api';
import { scrollToHTMLObject } from '~/utils/scollHelper';

const ID_SHIPPING_CHECKBOX = '#shipping-agreement-checkbox';

export const useCheckoutPagePaymentAndShipping = () => {
  const { $i18n } = useNuxtApp();
  const { send } = useNotification();
  const { getCart, data: cart } = useCart();
  const { loading: loadPayment, data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
  const { shippingPrivacyAgreement, setShippingPrivacyAgreement, setShippingPrivacyAgreementErrors } =
    useAdditionalInformation();

  const {
    loading: loadShipping,
    data: shippingMethodData,
    selectedMethod: selectedShippingMethod,
    getShippingMethods,
    saveShippingMethod,
  } = useCartShippingMethods();

  const paymentMethods = computed(() => paymentMethodData.value);
  const shippingMethods = computed(() => shippingProviderGetters.getShippingProviders(shippingMethodData.value));
  const selectedPaymentId = computed(() => cart.value.methodOfPaymentId);

  const handleShippingMethodUpdate = async (shippingMethodId: string) => {
    await saveShippingMethod(Number(shippingMethodId));
    await fetchPaymentMethods();
    await getCart();

    if (
      paymentProviderGetters.isPaymentMethodExcluded(selectedShippingMethod.value, selectedPaymentId.value) ||
      paymentProviderGetters.isPaymentMethodUnavailable(paymentMethods.value.list, selectedPaymentId.value)
    ) {
      send({ message: $i18n.t('billing.methodChanged'), type: 'warning' });
      await savePaymentMethod(paymentMethods.value.list[0].id);
    }

    setShippingPrivacyAgreement(false);
  };

  const handlePaymentMethodUpdate = async (paymentMethodId: number) => {
    await savePaymentMethod(paymentMethodId);
    await getShippingMethods();
  };

  const validateShippingTerms = () => {
    const shouldAcceptAgreement = selectedShippingMethod.value
      ? shippingProviderGetters.getDataPrivacyAgreementHint(selectedShippingMethod.value)
      : false;

    if (shouldAcceptAgreement) {
      setShippingPrivacyAgreementErrors(!shippingPrivacyAgreement.value);
      if (!shippingPrivacyAgreement.value) scrollToHTMLObject(ID_SHIPPING_CHECKBOX);
    }

    return shouldAcceptAgreement ? shippingPrivacyAgreement.value : true;
  };

  return {
    loadPayment,
    loadShipping,
    paymentMethods,
    shippingMethods,
    selectedPaymentId,
    handleShippingMethodUpdate,
    handlePaymentMethodUpdate,
    validateShippingTerms,
  };
};
