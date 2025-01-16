<template>
  <AddressDisplay :address="transformAddress(address)" />
</template>

<script setup lang="ts">
import type { OrderAddressDataPropsType } from './types';
import type { Address, AddressData } from '@plentymarkets/shop-api';

const props = defineProps<OrderAddressDataPropsType>();

const transformAddress = (address: AddressData): Address => {
  return {
    firstName: address.name2 || '',
    lastName: address.name3 || '',
    zipCode: address.postalCode,
    city: address.town,
    country: props.address.countryId.toString(),
    streetName: address.address1,
    apartment: address.address2,
    phoneNumber: '',
    primary: false,
  };
};
</script>
