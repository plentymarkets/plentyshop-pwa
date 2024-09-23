import { shippingProviderGetters } from '@plentymarkets/shop-api';
import { scrollToHTMLObject } from '~/utils/scollHelper';

const ID_SHIPPING_CHECKBOX = '#shipping-agreement-checkbox';

export const useCheckoutPagePaymentAndShipping = () => {
  const { loading: loadPayment, data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
  const { shippingPrivacyAgreement, setShippingPrivacyAgreement, setShippingPrivacyAgreementErrors } =
    useAdditionalInformation();
  const { selectedMethod } = useCartShippingMethods();
  const { getCart, data: cart } = useCart();

  const {
    loading: loadShipping,
    data: shippingMethodData,
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

    setShippingPrivacyAgreement(false);
  };

  const handlePaymentMethodUpdate = async (paymentMethodId: number) => {
    await savePaymentMethod(paymentMethodId);
    await getShippingMethods();
  };

  const validateShippingTerms = () => {
    const shouldAcceptAgreement = selectedMethod.value
      ? shippingProviderGetters.getDataPrivacyAgreementHint(selectedMethod.value)
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
