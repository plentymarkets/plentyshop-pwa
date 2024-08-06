<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <AddressContainerHeader @edit="edit($event)" @new="showNewForm = true" :disabled="disabled" :type="type" />
    <div class="mt-2">
      <template v-if="isShipping">
        <AddressFormShipping v-if="showNewForm" :countries="activeShippingCountries" add-address />
        <template v-else-if="hasCheckoutAddress">
          <AddressFormShipping v-if="editing" :countries="activeShippingCountries" :address="addressToEdit" />
          <AddressDisplay v-else :address="checkoutAddress" />
        </template>
      </template>
      <template v-if="isBilling">
        <AddressFormBilling v-if="showNewForm" :countries="activeShippingCountries" add-address />
        <template v-else-if="hasCheckoutAddress && !showSameAsShippingText">
          <AddressFormBilling v-if="editing" :countries="activeShippingCountries" :address="addressToEdit" />
          <AddressDisplay v-else :address="checkoutAddress" />
        </template>
        <div v-if="showSameAsShippingText" class="mt-2">
          {{ $t('addressContainer.sameAsShippingAddress') }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type AddressContainerProps } from './types';

const { disabled, type } = withDefaults(defineProps<AddressContainerProps>(), { disabled: false });
const { checkoutAddress, hasCheckoutAddress } = useCheckoutAddress(type);
const { open: editing } = useAddressForm(type);
const { data: activeShippingCountries } = useActiveShippingCountries();
const { showSameAsShippingText, showNewForm, addressToEdit, isBilling, isShipping, edit } = useAddressContainer(type);
</script>
