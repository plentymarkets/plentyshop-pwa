<template>
  <div class="address-display">
    <p v-if="userAddressGetters.getCompanyName(address)">
      {{ userAddressGetters.getCompanyName(address) }}
    </p>
    <p v-if="userAddressGetters.getFirstName(address) || userAddressGetters.getLastName(address)">
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
    <p v-if="userAddressGetters.getPostNumber(address)">
      {{ t('PreferredDelivery.packstation.postNumberPlaceholder') }}: {{ userAddressGetters.getPostNumber(address) }}
    </p>
    <p>{{ countryName }}</p>
  </div>
</template>

<script lang="ts" setup>
import { userAddressGetters } from '@plentymarkets/shop-api';
import type { AddressProps } from './types';

const { address } = defineProps<AddressProps>();

const { t } = useI18n();
const countryName = computed(() =>
  address?.country ? useAggregatedCountries().localeCountryName(address.country) : '',
);
</script>
