<template>
  <div class="flex md:items-center flex-col md:flex-row justify-between mb-4">
    <h2 class="text-neutral-900 text-lg font-bold">
      {{ type === AddressType.Shipping ? $t('shipping.heading') : $t('billing.heading') }}
    </h2>
    <div class="flex justify-center">
      <AddressSelect v-if="!editing" :type="type" @edit="emit('edit', $event)" @new="emit('new')" />
      <UiButton v-else size="sm" variant="tertiary">{{ $t('saveUpdatedAddress') }}</UiButton>
      <span class="mx-2 self-center">|</span>
      <SfTooltip :label="!editing ? $t('editAddress') : ''">
        <UiButton
          v-if="!disabled && checkoutAddress"
          size="sm"
          variant="tertiary"
          @click="emit('edit', checkoutAddress)"
        >
          <template v-if="!disabled && !editing">
            {{ $t('contactInfo.edit') }}
          </template>
          <SfIconClose v-else size="sm" />
        </UiButton>
      </SfTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfTooltip } from '@storefront-ui/vue';
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
