<template>
  <AddressDisplay :address="transformAddress(address)" :country-name="country" />
</template>

<script setup lang="ts">
import type { OrderAddressDataPropsType } from './types';
import type { Address, AddressData } from '@plentymarkets/shop-api';

const { data: countries } = useActiveShippingCountries();
const props = defineProps<OrderAddressDataPropsType>();
const country = computed(() => {
  return countries.value.find((country) => country.id === props.address.countryId)?.name ?? '';
});

const transformAddress = (address: AddressData): Address => {
  return {
    firstName: address.name2 || '',
    lastName: address.name3 || '',
    zipCode: address.postalCode,
    city: address.town,
    country: country.value,
    streetName: address.address1,
    apartment: address.address2,
    phoneNumber: '',
    primary: false,
  };
};
</script>
