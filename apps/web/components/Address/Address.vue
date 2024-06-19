<template>
  <div
    :class="{ 'border border-primary-700 mb-4 pb-1 pt-4': isSelected }"
    class="pl-4 pr-4 pt-1"
    data-testid="address-data"
  >
    <div class="my-2 flex justify-between">
      <div class="details">
        <AddressDisplay :address="address" />
      </div>

      <SfIconCheckCircle v-if="isSelected" class="flex justify-end text-primary-700 shrink-0 default-address" />
    </div>
    <div class="actions flex justify-end">
      <SfButton
        variant="tertiary"
        size="sm"
        class="self-start"
        @click.stop="$emit('on-edit', userAddressGetters.getId(address))"
      >
        {{ $t('account.accountSettings.edit') }}
      </SfButton>
      <SfButton variant="tertiary" size="sm" class="self-start" @click.stop="$emit('on-delete')">
        {{ $t('account.accountSettings.delete') }}
      </SfButton>
      <SfButton v-if="!isDefault" variant="tertiary" size="sm" class="self-start" @click.stop="$emit('make-default')">
        {{ $t('account.accountSettings.makeDefault') }}
      </SfButton>
    </div>

    <UiDivider v-if="!isDefault" class="col-span-3 mx-4 !w-auto md:mx-0 mt-1 mb-4" />
  </div>
</template>
<script lang="ts" setup>
import { SfIconCheckCircle } from '@storefront-ui/vue';
import { SfButton } from '@storefront-ui/vue';
import type { AddressProps } from './types';
import { userAddressGetters } from '@plentymarkets/shop-api';

defineProps<AddressProps>();
defineEmits(['on-edit', 'on-delete', 'make-default']);
</script>
