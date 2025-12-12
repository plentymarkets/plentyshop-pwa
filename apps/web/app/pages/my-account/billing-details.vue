<template>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <h2
    class="hidden md:block col-span-3 typography-headline-4 font-bold mx-4 capitalize"
    data-testid="account-orders-heading"
  >
    {{ t('account.accountSettings.section.billingDetails') }}
  </h2>
  <AddressesList
    class="col-span-3"
    :type="AddressType.Billing"
    :add-address-text="t('account.accountSettings.billingDetails.newAddress')"
    :edit-address-text="t('account.accountSettings.billingDetails.billingAddress')"
  />
</template>

<script setup lang="ts">
import { AddressType } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});
definePageMeta({
  layout: 'account',
  pageType: 'static',
  middleware: ['auth-guard'],
});
</script>
