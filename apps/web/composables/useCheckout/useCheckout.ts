import { AddressType } from '@plentymarkets/shop-api';
import { useDisclosure } from '@storefront-ui/vue';
import { createSharedComposable } from '@vueuse/core';

export const useCheckout = createSharedComposable(() => {
    const { isOpen: combineShippingAndBilling, toggle: toggleBillingShipping } = useDisclosure();
    combineShippingAndBilling.value = true;

    const { save: saveShipping, isLoading: shippingLoading } = useAddressForm(AddressType.Shipping);
    const { save: saveBilling, isLoading: billingLoading } = useAddressForm(AddressType.Billing);

    const isLoading = computed(() => shippingLoading.value || billingLoading.value);
    
    const save = async () => {
        await saveShipping();
        await saveBilling();
    }

    return {
        combineShippingAndBilling,
        toggleBillingShipping,
        save,
        isLoading
    };
});