<template>
  <p>
    {{ address.name1 }}
    {{ address.name2 }}
    {{ address.name3 }}
    {{ address.name4 }}
  </p>
  <p>
    {{ address.address1 }}
    {{ address.address2 }}
    {{ address.address3 }}
    {{ address.address4 }}
  </p>
  <p>{{ address.postalCode }} {{ address.town }}</p>
  <p>{{ country }}</p>
</template>

<script setup lang="ts">
import type { OrderAddressDataPropsType } from './types';

const { data: countries } = useActiveShippingCountries();
const props = defineProps<OrderAddressDataPropsType>();
const country = computed(() => {
  return countries.value.find((country) => country.id === props.address.countryId)?.name ?? '';
});
</script>
