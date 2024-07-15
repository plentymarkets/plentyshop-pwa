import { AddressType } from '@plentymarkets/shop-api';

export const useCheckout = (cacheKey = '') => {

    const state = useState('useCheckout' + cacheKey, () => ({
        combineShippingAndBilling: true,
        init: false
    }));

    const { hasDisplayAddress: hasShippingAddress } = useAddress(AddressType.Shipping);
    const { hasDisplayAddress: hasBillingAddress } = useAddress(AddressType.Billing);
    const { save: saveShipping, isLoading: shippingLoading, isValid: shippingValid, open: shippingOpen, saveShippingAndBilling } = useAddressForm(AddressType.Shipping);
    const { save: saveBilling, isLoading: billingLoading, isValid: billingValid, open: billingOpen } = useAddressForm(AddressType.Billing);
    const isLoading = computed(() => shippingLoading.value || billingLoading.value);
    const isValid = computed(() => shippingValid.value && billingValid.value);
    const hasOpenForms = computed(() => (shippingOpen.value || billingOpen.value));

    if (!state.value.init) {
        shippingOpen.value = true;
        billingOpen.value = true;
        state.value.init = true;
        if (hasBillingAddress.value) {
            state.value.combineShippingAndBilling = false;
        }
    }

    if (hasShippingAddress.value) {
        shippingOpen.value = false;
        billingOpen.value = false;
    }

    watch(hasShippingAddress, (value) => {
        if (!value) {
            shippingOpen.value = true;
        }
    })

    watch(() => state.value.combineShippingAndBilling, (value) => {
        if (!value) {
            if (!hasBillingAddress.value) {
                billingOpen.value = true;
            }
        } else {
            billingOpen.value = false;
        }
    });

    const save = async () => {

        if (state.value.combineShippingAndBilling && shippingOpen.value) {
            await saveShippingAndBilling()
            return;
        }
        if (shippingOpen.value) {
            await saveShipping();
        }
        if (billingOpen.value) {
            await saveBilling();
        }

    }

    return {
        ...toRefs(state.value),
        save,
        isValid,
        isLoading,
        hasOpenForms,
        shippingOpen,
        billingOpen
    };
};