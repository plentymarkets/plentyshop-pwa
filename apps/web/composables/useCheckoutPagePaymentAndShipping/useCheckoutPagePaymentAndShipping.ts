import { shippingProviderGetters } from "@plentymarkets/shop-api";

export const useCheckoutPagePaymentAndShipping = () => {

    const { loading: loadPayment, data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
    const { shippingPrivacyAgreement, setShippingPrivacyAgreement } = useAdditionalInformation();

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


    onNuxtReady(() => {
        fetchPaymentMethods();
        getShippingMethods();
    });

    return {
        loadPayment,
        loadShipping,
        paymentMethods,
        shippingMethods,
        selectedPaymentId,
        handleShippingMethodUpdate,
        handlePaymentMethodUpdate,
        shippingPrivacyAgreement,
    }
};