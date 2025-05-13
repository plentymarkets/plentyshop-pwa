<template>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <h2
    class="hidden md:block col-span-3 typography-headline-4 font-bold mx-4 capitalize"
    data-testid="account-orders-heading"
  >
    {{ t('account.accountSettings.section.shippingDetails') }}
  </h2>
  <AddressesList
    class="col-span-3"
    :type="AddressType.Shipping"
    :add-address-text="t('account.accountSettings.shippingDetails.newAddress')"
    :edit-address-text="t('account.accountSettings.shippingDetails.shippingAddress')"
  />
</template>

<script setup lang="ts">
import { AddressType } from '@plentymarkets/shop-api';

definePageMeta({
  layout: 'account',
  pageType: 'static',
  middleware: ['auth-guard'],
});
const { t } = useI18n();
</script>
