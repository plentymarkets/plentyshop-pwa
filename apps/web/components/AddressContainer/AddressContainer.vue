<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <AddressContainerHeader @edit="edit($event)" :disabled="disabled" :type="type" />
    <div class="mt-2">
        <template v-if="type === AddressType.Shipping">
          <AddressFormShipping v-if="newAddress" new />
          <AddressFormShipping v-if="editing" :address="address" />
          <AddressDisplay v-else :address="checkoutAddress" />
        </template>
        <template v-else>
          <div v-if="sameAsShippingAddress" class="mt-2">{{ $t('addressContainer.sameAsShippingAddress') }}</div>
          <div v-else>
            <AddressFormBilling v-if="newAddress" new />
            <AddressFormBilling v-if="editing" :address="address"  />
            <AddressDisplay v-else :address="checkoutAddress" />
          </div>
        </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type AddressContainerProps } from './types';
import { Address, AddressType } from '@plentymarkets/shop-api';

const { disabled, type } = withDefaults(defineProps<AddressContainerProps>(), { disabled: false });
const { checkoutAddress, set } = useCheckoutAddress(type);
const { open: editing } = useAddressForm(type);
const { shippingAsBilling } = useShippingAsBilling();
const address: Ref<Address> = ref({} as Address);
const newAddress = ref(false);

watch(
  checkoutAddress,
  () => {
    if (!checkoutAddress.value.id) {
      shippingAsBilling.value = true;
      if (type === AddressType.Billing) {
        newAddress.value = false;
      } else {
        newAddress.value = true;
      }
    }
  },
  { immediate: true },
);

const edit = (addressToEdit: Address) => {
  if (editing.value) {
    editing.value = false;
    newAddress.value = false;
    return;
  }
  address.value = addressToEdit;
  editing.value = true;
};

const sameAsShippingAddress = computed(() => {
  if (type === AddressType.Billing) {
    const { checkoutAddress: shippingAddress } = useCheckoutAddress(AddressType.Shipping);

    if (Number(checkoutAddress.value.id) === Number(shippingAddress.value.id)) {
      return true;
    }
  }
  return false;
});
</script>
