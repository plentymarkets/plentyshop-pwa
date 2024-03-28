<template>
  <div class="address-display">
    <p>
      {{ `${userAddressGetters.getFirstName(address)} ${userAddressGetters.getLastName(address)}` }}
    </p>
    <p>{{ userAddressGetters.getPhone(address) }}</p>
    <p>
      {{ userAddressGetters.getStreetName(address) }}
      {{ userAddressGetters.getStreetNumber(address) }}
    </p>
    <p>
      {{ `${userAddressGetters.getPostCode(address)} ${userAddressGetters.getCity(address)}` }}
    </p>
    <p>
      {{ countryName }}
    </p>
  </div>
</template>
<script lang="ts" setup>
import { userAddressGetters } from '@plentymarkets/shop-sdk';
import type { AddressProps } from './types';
defineProps<AddressProps>();

defineEmits(['on-click', 'on-edit', 'on-delete', 'make-default']);
</script>
