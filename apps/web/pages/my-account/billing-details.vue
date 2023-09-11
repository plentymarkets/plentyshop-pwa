<template>
  <AddressesList
    class="col-span-3"
    :type="AddressType.Billing"
    :add-address-text="$t('account.accountSettings.billingDetails.newAddress')"
    :edit-address-text="$t('account.accountSettings.billingDetails.billingAddress')"
  />
</template>

<script setup lang="ts">
import { AddressType } from '@plentymarkets/shop-api';

definePageMeta({
  layout: 'account',
});
</script>
