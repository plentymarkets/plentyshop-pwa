<template>
  <AddressesList
    class="col-span-3"
    :type="AddressType.Shipping"
    :add-address-text="$t('account.accountSettings.shippingDetails.newAddress')"
    :edit-address-text="$t('account.accountSettings.shippingDetails.shippingAddress')"
  />
</template>

<script setup lang="ts">
import { AddressType } from '@plentymarkets/shop-api';

definePageMeta({
  layout: 'account',
  pageType: 'static',
});
</script>
