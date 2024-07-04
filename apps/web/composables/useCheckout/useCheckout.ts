import { AddressType } from '@plentymarkets/shop-api';
import { useDisclosure } from '@storefront-ui/vue';
import { createSharedComposable } from '@vueuse/core';

export const useCheckout = createSharedComposable(() => {
    const { isOpen: combineShippingAndBilling, toggle: toggleBillingShipping } = useDisclosure();
    combineShippingAndBilling.value = true;

    const { save: saveShipping, isLoading: shippingLoading } = useAddressFormShipping();
    const { save: saveBilling, isLoading: billingLoading } = useAddressFormBilling();

    const isLoading = computed(() => shippingLoading.value || billingLoading.value);
    
    const save = async () => {
        await saveShipping();

        if (!combineShippingAndBilling.value) {
            await saveBilling();
        }
    }

    return {
        combineShippingAndBilling,
        toggleBillingShipping,
        save,
        isLoading
    };
});