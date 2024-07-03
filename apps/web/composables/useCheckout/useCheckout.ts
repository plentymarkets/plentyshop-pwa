import { useDisclosure } from '@storefront-ui/vue';
import { createSharedComposable } from '@vueuse/core';

export const useCheckout = createSharedComposable(() => {
    const { isOpen: combineShippingAndBilling, toggle: toggleBillingShipping } = useDisclosure();

    combineShippingAndBilling.value = true;

    return {
        combineShippingAndBilling,
        toggleBillingShipping
    };
});