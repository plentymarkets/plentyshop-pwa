<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <AddressContainerHeader @edit="edit($event)" @new="openNewForm = true" :disabled="disabled" :type="type" />
    <div class="mt-2">
      <template v-if="isShipping">
        <AddressFormShipping v-if="openNewForm" new />
        <template v-else-if="hasCheckoutAddress">
          <AddressFormShipping v-if="editing" :address="addressToEdit" />
          <AddressDisplay v-else :address="checkoutAddress" />
        </template>
      </template>
      <template v-if="isBilling">
        <div>
          <AddressFormBilling v-if="openNewForm" new />
          <template v-else-if="hasCheckoutAddress">
            <AddressFormBilling v-if="editing" :address="addressToEdit" />
            <AddressDisplay v-else :address="checkoutAddress" />
          </template>
        </div>
        <div v-if="sameAsShippingAddress && !openNewForm" class="mt-2">
          {{ $t('addressContainer.sameAsShippingAddress') }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type AddressContainerProps } from './types';
import { Address, AddressType } from '@plentymarkets/shop-api';

const { disabled, type } = withDefaults(defineProps<AddressContainerProps>(), { disabled: false });
const isBilling = type === AddressType.Billing;
const isShipping = type === AddressType.Shipping;
const { checkoutAddress, hasCheckoutAddress } = useCheckoutAddress(type);
const { open: editing } = useAddressForm(type);
const { shippingAsBilling } = useShippingAsBilling();
const addressToEdit: Ref<Address> = ref({} as Address);
const openNewForm = ref(false);

const sameAsShippingAddress = computed(() => {
  if (isBilling) {
    const { checkoutAddress: shippingAddress } = useCheckoutAddress(AddressType.Shipping);

    if (checkoutAddress.value.id === shippingAddress.value.id) {
      return true;
    }
  }
  return false;
});

const handleCheckoutAddressChange = () => {
  if (!hasCheckoutAddress.value) {
    if (isBilling) {
      openNewForm.value = false;
    } else {
      shippingAsBilling.value = true;
      openNewForm.value = true;
    }
  } else {
    shippingAsBilling.value = false;
    openNewForm.value = false;
  }
};

const handleShippingAsBillingChange = () => {
  if (isBilling && !hasCheckoutAddress.value) {
    openNewForm.value = !shippingAsBilling.value;
  }
};

const edit = (address: Address) => {
  if (editing.value) {
    editing.value = false;
    openNewForm.value = false;
    return;
  }
  addressToEdit.value = address;
  editing.value = true;
};

watch(checkoutAddress, handleCheckoutAddressChange, { immediate: true });
watch(shippingAsBilling, handleShippingAsBillingChange);
</script>
