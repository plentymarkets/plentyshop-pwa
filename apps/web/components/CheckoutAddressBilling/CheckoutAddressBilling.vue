<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">
        {{ $t('billing.heading') }}
      </h2>
      <SfButton v-if="!disabled && addresses.length > 0 && !open" size="sm" variant="tertiary" @click="open = true">
        {{ t('contactInfo.edit') }}
      </SfButton>
    </div>
    <div v-if="displayAddress && !open" class="mt-2 md:w-[520px]">
      <AddressDisplay :address="displayAddress" />
    </div>

    <div v-if="open">
      <AddressFormBilling/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue';
import { CheckoutAddressNewProps } from './types';
import { AddressType } from '@plentymarkets/shop-api';

const { t } = useI18n();
const { disabled } = withDefaults(defineProps<CheckoutAddressNewProps>(), {
  disabled: false,
});
const { data: addresses, displayAddress } = useAddress(AddressType.Billing);
const { open } = useAddressFormBilling();

</script>
