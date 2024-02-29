<template>
  <div
    :class="{ 'border border-primary-700 mb-4 pb-1 pt-4': isDefault }"
    class="pl-4 pr-4 pt-1"
    data-testid="address-data"
  >
    <div class="my-2 flex justify-between">
      <div class="details">
        <p>
          {{ `${userAddressGetters.getFirstName(address)} ${userAddressGetters.getLastName(address)}` }}
        </p>
        <p>{{ userAddressGetters.getPhone(address) }}</p>
        <p>
          {{ userAddressGetters.getStreetName(address) }}
          {{ userAddressGetters.getStreetNumber(address) }}
        </p>
        <p>
          {{ `${userAddressGetters.getCity(address)} ${userAddressGetters.getPostCode(address)}` }}
        </p>
      </div>

      <div v-if="isDefault" class="default-address flex justify-end">
        <SfIconCheckCircle class="text-primary-700 shrink-0" />
      </div>
    </div>
    <div class="actions flex justify-end">
      <SfButton variant="tertiary" size="sm" class="self-start" @click="$emit('on-edit')">
        {{ t('account.accountSettings.edit') }}
      </SfButton>
      <SfButton variant="tertiary" size="sm" class="self-start" @click="$emit('on-delete')">
        {{ t('account.accountSettings.delete') }}
      </SfButton>
      <SfButton v-if="!isDefault" variant="tertiary" size="sm" class="self-start" @click="$emit('make-default')">
        {{ t('account.accountSettings.makeDefault') }}
      </SfButton>
    </div>

    <UiDivider v-if="!isDefault" class="col-span-3 mx-4 !w-auto md:mx-0 mt-1 mb-4" />
  </div>
</template>
<script lang="ts" setup>
import { userAddressGetters } from '@plentymarkets/shop-sdk';
import { SfIconCheckCircle } from '@storefront-ui/vue';
import { SfButton } from '@storefront-ui/vue';
import type { AddressProps } from './types';

const { t } = useI18n();

defineProps<AddressProps>();
defineEmits(['on-click', 'on-edit', 'on-delete', 'make-default']);
</script>
