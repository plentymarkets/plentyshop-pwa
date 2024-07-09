import { AddressType } from '@plentymarkets/shop-api';
import { useDisclosure } from '@storefront-ui/vue';
import { createSharedComposable } from '@vueuse/core';

export const useCheckout = createSharedComposable(() => {
    const { isOpen: combineShippingAndBilling, toggle: toggleBillingShipping } = useDisclosure();
    combineShippingAndBilling.value = true;

    const { save: saveShipping, isLoading: shippingLoading, isValid: shippingValid } = useAddressForm(AddressType.Shipping);
    const { save: saveBilling, isLoading: billingLoading, isValid: billingValid } = useAddressForm(AddressType.Billing);

    const isLoading = computed(() => shippingLoading.value || billingLoading.value);
    const isValid = computed(() => shippingValid.value && billingValid.value);

    const save = async () => {
        saveShipping();

        if (!combineShippingAndBilling.value) {
            saveBilling();
        }
    }

    return {
        combineShippingAndBilling,
        toggleBillingShipping,
        save,
        isValid,
        isLoading
    };
});