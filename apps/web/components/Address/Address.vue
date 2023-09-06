<template>
  <div class="md:mx-4" data-testid="address-data">
    <div class="my-2">
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
    <div class="actions flex justify-end">
      <SfButton variant="tertiary" size="sm" class="self-start" @click="$emit('on-click')">
        {{ $t('account.accountSettings.billingDetails.edit') }}
      </SfButton>
      <SfButton variant="tertiary" size="sm" class="self-start" @click="$emit('on-click')">
        {{ $t('account.accountSettings.billingDetails.delete') }}
      </SfButton>
      <SfButton variant="tertiary" size="sm" class="self-start" @click="$emit('on-click')">
        {{ $t('account.accountSettings.billingDetails.make-default') }}
      </SfButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { userAddressGetters } from '@plentymarkets/shop-sdk';
import { SfButton } from '@storefront-ui/vue';
import { AddressProps } from './types';

console.log('address: ', address)

defineProps<AddressProps>();
defineEmits(['on-click']);
</script>
