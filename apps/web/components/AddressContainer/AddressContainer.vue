<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex md:items-center flex-col md:flex-row justify-between mb-4">
      <h2 class="text-neutral-900 text-lg font-bold">
        {{ type === AddressType.Shipping ? $t('shipping.heading') : $t('billing.heading') }}
      </h2>

      <div class="flex justify-center">
        <AddressSelect v-if="!editing" :type="type" @new="showNewForm = true" />
        <UiButton v-else @click="validateAndSubmitForm" size="sm" variant="tertiary">
          {{ $t('saveUpdatedAddress') }}
        </UiButton>

        <span class="mx-2 self-center">|</span>

        <SfTooltip :label="!editing ? $t('editAddress') : ''">
          <UiButton v-if="!disabled && checkoutAddress" @click="edit(checkoutAddress)" size="sm" variant="tertiary">
            <template v-if="!editing">
              {{ $t('contactInfo.edit') }}
            </template>
            <SfIconClose v-else size="sm" />
          </UiButton>
        </SfTooltip>
      </div>
    </div>

    <div class="mt-2">
      <template v-if="isShipping">
        <AddressFormShipping v-if="showNewForm" add-address />
        <template v-else-if="hasCheckoutAddress">
          <AddressFormShipping v-if="editing" ref="addressShippingForm" :address="addressToEdit" />
          <AddressDisplay v-else :address="checkoutAddress" />
        </template>
      </template>

      <template v-if="isBilling">
        <AddressFormBilling v-if="showNewForm" add-address />
        <template v-else-if="hasCheckoutAddress && !showSameAsShippingText">
          <AddressFormBilling v-if="editing" :address="addressToEdit" />
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
import { SfIconClose, SfTooltip } from '@storefront-ui/vue';
import { type AddressContainerProps } from './types';
import { AddressType } from '@plentymarkets/shop-api';

const { disabled, type } = withDefaults(defineProps<AddressContainerProps>(), { disabled: false });

const addressShippingForm = ref(null as any);
const { checkoutAddress, hasCheckoutAddress } = useCheckoutAddress(type);
const { open: editing } = useAddressForm(type);
const { showSameAsShippingText, showNewForm, addressToEdit, isBilling, isShipping, edit } = useAddressContainer(type);

const validateAndSubmitForm = async () => {
  if (await addressShippingForm.value?.validate()) addressShippingForm.value?.submitForm();
};
</script>
