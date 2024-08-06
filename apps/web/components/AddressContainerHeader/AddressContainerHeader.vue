<template>
  <div class="flex md:items-center flex-col md:flex-row justify-between mb-4">
    <h2 class="text-neutral-900 text-lg font-bold">
      {{ type === AddressType.Shipping ? $t('shipping.heading') : $t('billing.heading') }}
    </h2>
    <div>
      <AddressSelect @edit="emit('edit', $event)" @new="emit('new')" :type="type" />
      <span v-if="!editing" class="mx-2">|</span>
      <SfTooltip label="Edit address">
        <SfButton
          v-if="!disabled && checkoutAddress"
          size="sm"
          variant="tertiary"
          @click="emit('edit', checkoutAddress)"
        >
          <span v-if="!disabled && !editing">{{ $t('contactInfo.edit') }}</span>
          <SfIconClose v-else></SfIconClose>
        </SfButton>
      </SfTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton, SfIconClose, SfTooltip } from '@storefront-ui/vue';
import { Address, AddressType } from '@plentymarkets/shop-api';
import { AddressContainerHeaderProps } from './types';
const { disabled, type } = withDefaults(defineProps<AddressContainerHeaderProps>(), { disabled: false });
const { checkoutAddress } = useCheckoutAddress(type);
const { open: editing } = useAddressForm(type);

const emit = defineEmits<{
  (event: 'edit', address: Address): void;
  (event: 'new'): void;
}>();
</script>
