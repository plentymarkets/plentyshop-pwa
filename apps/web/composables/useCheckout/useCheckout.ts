import { AddressType } from '@plentymarkets/shop-api';
import { useDisclosure } from '@storefront-ui/vue';
import { createSharedComposable } from '@vueuse/core';

export const useCheckout = () => {
    const { isOpen: combineShippingAndBilling, toggle: toggleBillingShipping } = useDisclosure();

    const { displayAddress: displayAddressShipping, hasDisplayAddress: hasShippingAddress } = useAddress(AddressType.Shipping);
    const { displayAddress: displayAddressBilling, hasDisplayAddress: hasBillingAddress } = useAddress(AddressType.Billing);
    const { save: saveShipping, isLoading: shippingLoading, isValid: shippingValid, open: shippingOpen } = useAddressForm(AddressType.Shipping);
    const { save: saveBilling, isLoading: billingLoading, isValid: billingValid, open: billingOpen} = useAddressForm(AddressType.Billing);
    const isLoading = computed(() => shippingLoading.value || billingLoading.value);
    const isValid = computed(() => shippingValid.value && billingValid.value);
    const hasOpenForms = computed(() => (shippingOpen.value || billingOpen.value));

    shippingOpen.value = true;
    billingOpen.value = true;
    combineShippingAndBilling.value = true;

    if (hasShippingAddress.value) {
        shippingOpen.value = false;
        billingOpen.value = false;
    }

    if (hasBillingAddress.value) {
        combineShippingAndBilling.value = false;
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
};