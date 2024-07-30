<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex md:items-center flex-col md:flex-row justify-between mb-4">
      <h2 class="text-neutral-900 text-lg font-bold">
        {{ type === AddressType.Shipping ?  $t('shipping.heading') : $t('billing.heading') }}
      </h2>
      <div>
        <AddressSelect @edit="" :type="type" />
        <span v-if="!editing" class="mx-2">|</span>
        <SfTooltip label="Edit address">
          <SfButton
            v-if="!disabled && checkoutAddress"
            size="sm"
            variant="tertiary"
            @click=""
          >
            <span v-if="!disabled && !editing">{{ $t('contactInfo.edit') }}</span>
            <SfIconClose v-else></SfIconClose>
          </SfButton>
        </SfTooltip>
      </div>
    </div>
    <div class="flex justify-between">
      <div>
        <template v-if="type === AddressType.Shipping">
          <div v-if="checkoutAddress && !editing" class="mt-2">
            <AddressDisplay :address="checkoutAddress" />
          </div>
        </template>
        <template v-else>
          <div v-if="sameAsShippingAddress">{{ $t('addressContainer.sameAsShippingAddress') }}</div>
          <div v-else class="mt-2">
            <AddressDisplay :address="checkoutAddress" />
          </div>
        </template>
      </div>
    </div>

    <div v-if="editing && !disabled">
      <AddressFormShipping v-if="type === AddressType.Shipping" />
      <AddressFormBilling v-if="type === AddressType.Billing" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton, SfIconClose, SfTooltip } from '@storefront-ui/vue';
import { type AddressContainerProps } from './types';
import { AddressType } from '@plentymarkets/shop-api';

const { disabled, type } = withDefaults(defineProps<AddressContainerProps>(), { disabled: false });
const { checkoutAddress } = useCheckoutAddress(type);
const { open: editing } = useAddressForm(type);

const sameAsShippingAddress = computed(() => {
  if (type === AddressType.Billing && checkoutAddress) {
    const { checkoutAddress: shippingAddress } = useCheckoutAddress(AddressType.Shipping);

    if (checkoutAddress && shippingAddress && checkoutAddress.value.id === shippingAddress.value.id) {
      return true;
    }
  }
  return false;
});

/* const editForm = (address: Address) => {
  editing.value = !editing.value;
  if (editing.value) setDisplayAddress(address, false);
}; */

</script>
