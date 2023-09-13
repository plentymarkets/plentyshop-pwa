<template>
  <div class="relative col-span-3" :class="{ 'pointer-events-none opacity-50': loading }">
    <ClientOnly>
      <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
      <h2 class="hidden md:block typography-headline-4 font-bold mx-4 capitalize col-span-3">
        {{ $t('account.ordersAndReturns.myOrders') }}
      </h2>
      <div v-if="!data" class="col-span-3 text-center mt-8">
        <NuxtImg
          src="/images/empty-cart.svg"
          :alt="$t('account.ordersAndReturns.noOrdersAltText')"
          width="192"
          height="192"
          class="mx-auto"
        />
        <h3 class="typography-headline-3 font-bold mb-4 mt-6">{{ $t('account.ordersAndReturns.noOrders') }}</h3>
        <SfButton variant="secondary" class="!ring-neutral-200">
          {{ $t('account.ordersAndReturns.continue') }}
        </SfButton>
      </div>
      <div v-else class="col-span-3">
        <SfLoaderCircular v-if="loading" class="absolute top-0 bottom-0 right-0 left-0 m-auto z-[999]" size="lg" />
        <ul class="md:hidden my-4 last-of-type:mb-0" v-for="(order, index) in data.data.entries" :key="index">
          <li>
            <p class="block typography-text-sm font-medium">{{ $t('account.ordersAndReturns.orderId') }}</p>
            <span class="block typography-text-sm mb-2">{{ orderGetters.getId(order) }}</span>
          </li>
          <li>
            <p class="block typography-text-sm font-medium">
              {{ $t('account.ordersAndReturns.orderDate') }}
            </p>
            <span class="block typography-text-sm mb-2">{{ orderGetters.getDate(order) }}</span>
          </li>
          <li>
            <p class="block typography-text-sm font-medium">{{ $t('account.ordersAndReturns.amount') }}</p>
            <span class="block typography-text-sm mb-2">{{ $n(orderGetters.getPrice(order), 'currency') }}</span>
          </li>
          <li v-if="orderGetters.getShippingDate(order)">
            <p class="block typography-text-sm font-medium">{{ $t('account.ordersAndReturns.shippingDate') }}</p>
            <span class="block typography-text-sm mb-2">{{ orderGetters.getShippingDate(order) }}</span>
          </li>
          <li class="flex flex-wrap items-center mb-2">
            <p class="block typography-text-sm -mb-1.5 font-medium flex-[100%]">
              {{ $t('account.ordersAndReturns.status') }}
            </p>
            <span class="block typography-text-sm flex-1">{{ orderGetters.getStatus(order) }}</span>
            <!--
          <SfButton :tag="NuxtLink" size="sm" variant="tertiary" :to="`${paths.accountMyOrders}/${order.order.id}`">
            {{ $t('account.ordersAndReturns.details') }}
          </SfButton>
          --></li>
          <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
        </ul>
        <table class="hidden md:block text-left typography-text-sm mx-4">
          <caption class="hidden">
            {{
              $t('account.ordersAndReturns.listOfOrders')
            }}
          </caption>
          <thead class="border-b-2 border-neutral-200">
            <tr>
              <th class="lg:py-4 py-2 lg:pr-4 pr-2 font-medium">{{ $t('account.ordersAndReturns.orderId') }}</th>
              <th class="lg:p-4 p-2 font-medium lg:whitespace-nowrap">
                {{ $t('account.ordersAndReturns.orderDate') }}
              </th>
              <th class="lg:p-4 p-2 font-medium">{{ $t('account.ordersAndReturns.amount') }}</th>
              <th class="lg:p-4 p-2 font-medium">{{ $t('account.ordersAndReturns.shippingDate') }}</th>
              <th class="lg:p-4 p-2 font-medium">{{ $t('account.ordersAndReturns.status') }}</th>
              <!-- <th class="lg:py-4 py-2 lg:pl-4 pl-2"></th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in data.data.entries" :key="index" class="border-b border-neutral-200">
              <td class="lg:py-4 py-2 lg:pr-4 pr-2 lg:whitespace-nowrap">{{ orderGetters.getId(order) }}</td>
              <td class="lg:p-4 p-2 lg:whitespace-nowrap">{{ orderGetters.getDate(order) }}</td>
              <td class="lg:p-4 p-2">{{ $n(orderGetters.getPrice(order), 'currency') }}</td>
              <td class="lg:p-4 p-2">{{ orderGetters.getShippingDate(order) ?? '' }}</td>
              <td class="lg:p-4 p-2 lg:whitespace-nowrap w-full">{{ orderGetters.getStatus(order) }}</td>
              <!--
            <td class="py-1.5 lg:pl-4 pl-2 text-right w-full">
              <SfButton :tag="NuxtLink" size="sm" variant="tertiary" :to="`${paths.accountMyOrders}/${index}`">
                {{ $t('account.ordersAndReturns.details') }}
              </SfButton>
            </td>
            --></tr>
          </tbody>
        </table>

        <UiPagination
          :disabled="loading"
          :current-page="data.data.page"
          :total-items="data.data.totalsCount"
          :page-size="data.data.itemsPerPage"
          :max-visible-pages="maxVisiblePages"
        />
      </div>

      <NuxtPage />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { SfButton } from '@storefront-ui/vue';
import { SfLoaderCircular } from '@storefront-ui/vue';
import { useMediaQuery } from '@vueuse/core';

definePageMeta({
  layout: 'account',
});

const isWideScreen = useMediaQuery(mediaQueries.desktop);
const maxVisiblePages = ref(1);

const setMaxVisiblePages = (isWide: boolean) => (maxVisiblePages.value = isWide ? 5 : 1);
const route = useRoute();

watch(isWideScreen, (value) => setMaxVisiblePages(value));
onMounted(() => setMaxVisiblePages(isWideScreen.value));

const { fetchCustomerOrders, data, loading } = useCustomerOrders();
// const NuxtLink = resolveComponent('NuxtLink');

const handleQueryUpdate = async () => {
  await fetchCustomerOrders({
    page: Number(route.query.page as string) || defaults.DEFAULT_PAGE,
  });
};

await handleQueryUpdate();

watch(
  () => route.query,
  async () => {
    await handleQueryUpdate();
  },
);
</script>
