<template>
  <div
    :class="{ 'border border-primary-500': isSelected }"
    class="px-4 py-1 mb-4 rounded-md"
    data-testid="address-data"
  >
    <div class="my-2 flex justify-between">
      <div class="details">
        <AddressDisplay :address="address" />
      </div>

      <SfIconCheckCircle v-if="isSelected" class="flex justify-end text-primary-500 shrink-0 default-address" />
    </div>
    <div class="actions flex justify-end">
      <UiButton
        variant="tertiary"
        size="sm"
        class="self-start"
        @click.stop="emit('on-edit', userAddressGetters.getId(address))"
      >
        {{ $t('account.accountSettings.edit') }}
      </UiButton>
      <UiButton variant="tertiary" size="sm" class="self-start" @click.stop="emit('on-delete')">
        {{ $t('account.accountSettings.delete') }}
      </UiButton>
      <UiButton
        v-if="!isDefault && !isGuest"
        variant="tertiary"
        size="sm"
        class="self-start"
        @click.stop="emit('make-default')"
      >
        {{ $t('account.accountSettings.makeDefault') }}
      </UiButton>
    </div>

    <slot v-if="showDivider">
      <UiDivider class="col-span-3 mx-4 !w-auto md:mx-0 mt-1 mb-4" />
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { SfIconCheckCircle } from '@storefront-ui/vue';
import type { AddressProps } from './types';
import { userAddressGetters } from '@plentymarkets/shop-api';

const { address, isDefault, isSelected, showDivider } = defineProps<AddressProps>();

const { isGuest } = useCustomer();
const emit = defineEmits(['on-edit', 'on-delete', 'make-default']);
</script>
