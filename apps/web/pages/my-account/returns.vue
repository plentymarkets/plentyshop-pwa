<template>
  <div class="relative col-span-3" :class="{ 'pointer-events-none opacity-50': loading }">
    <SfLoaderCircular v-if="loading" class="absolute top-0 bottom-0 right-0 left-0 m-auto z-[999]" size="2xl" />
    <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
    <h2 class="hidden md:block col-span-3 typography-headline-4 mb-4 font-bold mx-4 capitalize">
      {{ $t('account.ordersAndReturns.returnsHeading') }}
    </h2>
    <div v-if="!data?.length" class="col-span-3 text-center">
      <NuxtImg
        src="/images/returns.png"
        :alt="$t('account.ordersAndReturns.returnsAltText')"
        width="192"
        height="192"
        class="mx-auto"
      />
      <h3 class="typography-headline-3 font-bold mt-6 mb-4">
        {{ $t('account.ordersAndReturns.noOrders') }}
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';

definePageMeta({
  layout: 'account',
});

const { data, fetchCustomerReturns, loading } = useCustomerReturns();

await fetchCustomerReturns();
</script>
