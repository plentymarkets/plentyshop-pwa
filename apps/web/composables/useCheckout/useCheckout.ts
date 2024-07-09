import { AddressType } from '@plentymarkets/shop-api';
import { useDisclosure } from '@storefront-ui/vue';
import { createSharedComposable } from '@vueuse/core';

export const useCheckout = createSharedComposable(() => {
    const { isOpen: combineShippingAndBilling, toggle: toggleBillingShipping } = useDisclosure();
    const { isGuest } = useCustomer();
    combineShippingAndBilling.value = true;


    const { displayAddress: displayAddressShipping } = useAddress(AddressType.Shipping);
    const { displayAddress: displayAddressBilling } = useAddress(AddressType.Billing);
    const { save: saveShipping, isLoading: shippingLoading, isValid: shippingValid, open: shippingOpen } = useAddressForm(AddressType.Shipping);
    const { save: saveBilling, isLoading: billingLoading, isValid: billingValid, open: billingOpen} = useAddressForm(AddressType.Billing);
    const isLoading = computed(() => shippingLoading.value || billingLoading.value);
    const isValid = computed(() => shippingValid.value && billingValid.value);
    const hasOpenForms = computed(() => (shippingOpen.value || billingOpen.value));

    if (isGuest.value) {
        shippingOpen.value = true;
        billingOpen.value = true;
    }

    if (!displayAddressShipping.value && !displayAddressBilling.value) {
        shippingOpen.value = true;
        billingOpen.value = true;
    }


    const save = async () => {
        if (shippingOpen.value) {
            await saveShipping();
        }
        if (billingOpen.value) {
            await saveBilling();
        }
        if (combineShippingAndBilling.value) {
            // saveShippingAndBilling
            // saveBilling();
        }
    }

    return {
        combineShippingAndBilling,
        toggleBillingShipping,
        save,
        isValid,
        isLoading,
        hasOpenForms,
        shippingOpen,
        billingOpen
    };
});