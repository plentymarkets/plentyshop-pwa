import { type Address, AddressType } from '@plentymarkets/shop-api';

export const useAddressContainer = (type: AddressType) => {
  const isBilling = type === AddressType.Billing;
  const isShipping = type === AddressType.Shipping;
  const { checkoutAddress, hasCheckoutAddress } = useCheckoutAddress(type);
  const { open: editing } = useAddressForm(type);
  const { shippingAsBilling } = useShippingAsBilling();
  const addressToEdit: Ref<Address> = ref({} as Address);
  const showNewForm = ref(false);

  const sameAsShippingAddress = computed(() => {
    return isBilling
      ? checkoutAddress.value.id === useCheckoutAddress(AddressType.Shipping).checkoutAddress.value.id
      : false;
  });

  const showSameAsShippingText = computed(
    () => sameAsShippingAddress.value && !showNewForm.value && !editing.value && shippingAsBilling.value,
  );

  const edit = (address: Address) => {
    addressToEdit.value = editing.value ? ({} as Address) : address;
    editing.value = !editing.value;
    showNewForm.value = false;
  };

  // watch(
  //   checkoutAddress,
  //   () => {
  //     if (hasCheckoutAddress.value) {
  //       shippingAsBilling.value = false;
  //       showNewForm.value = false;
  //       return;
  //     }

  //     showNewForm.value = !isBilling;
  //     if (!isBilling) shippingAsBilling.value = true;
  //   },
  //   { immediate: true },
  // );

  watch(shippingAsBilling, () => {
    if (isBilling && !hasCheckoutAddress.value) showNewForm.value = !shippingAsBilling.value;
  });

  watch(sameAsShippingAddress, () => {
    if (sameAsShippingAddress.value) shippingAsBilling.value = true;
  });

  return {
    isBilling,
    isShipping,
    showNewForm,
    showSameAsShippingText,
    addressToEdit,
    edit,
  };
};
