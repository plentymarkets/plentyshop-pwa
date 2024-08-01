import { Address, AddressType } from '@plentymarkets/shop-api';
export const useAddressContainer = (type: AddressType) => {
    const isBilling = type === AddressType.Billing;
    const isShipping = type === AddressType.Shipping;
    const { checkoutAddress, hasCheckoutAddress } = useCheckoutAddress(type);
    const { open: editing } = useAddressForm(type);
    const { shippingAsBilling } = useShippingAsBilling();
    const addressToEdit: Ref<Address> = ref({} as Address);
    const showNewForm = ref(false);

    const sameAsShippingAddress = computed(() => {
        if (isBilling) {
            const { checkoutAddress: shippingAddress } = useCheckoutAddress(AddressType.Shipping);

            if (checkoutAddress.value.id === shippingAddress.value.id) {
                return true;
            }
        }
        return false;
    });

    const showSameAsShippingText = computed(() => {
        return sameAsShippingAddress.value && !showNewForm.value && !editing.value && shippingAsBilling.value;
    });

    const handleCheckoutAddressChange = () => {
        if (!hasCheckoutAddress.value) {
            if (isBilling) {
                showNewForm.value = false;
            } else {
                shippingAsBilling.value = true;
                showNewForm.value = true;
            }
        } else {
            shippingAsBilling.value = false;
            showNewForm.value = false;
        }
    };

    const handleShippingAsBillingChange = () => {
        if (isBilling ) {
            if (!hasCheckoutAddress.value) {
                showNewForm.value = !shippingAsBilling.value;
            }
        }
    };

    const edit = (address: Address) => {
        if (editing.value) {
            editing.value = false;
            showNewForm.value = false;
            return;
        }
        addressToEdit.value = address;
        editing.value = true;
    };

    watch(checkoutAddress, handleCheckoutAddressChange, { immediate: true });
    watch(shippingAsBilling, handleShippingAsBillingChange);
    watch(sameAsShippingAddress, () => {
        if (sameAsShippingAddress.value) {
            shippingAsBilling.value = true;
        }
    })

    return {
        isBilling,
        isShipping,
        showNewForm, 
        showSameAsShippingText, 
        addressToEdit,
        edit,
    };
}