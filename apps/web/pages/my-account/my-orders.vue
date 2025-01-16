<template>
  <ClientOnly>
    <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
    <h2
      class="hidden md:block col-span-3 typography-headline-4 font-bold mx-4 capitalize"
      data-testid="account-orders-heading"
    >
      {{ t('account.ordersAndReturns.myOrders') }}
    </h2>

    <div v-if="loading">
      <SfLoaderCircular v-if="loading" class="absolute top-0 bottom-0 right-0 left-0 m-auto z-[999]" size="2xl" />
    </div>

    <div
      v-if="!data || data.data.entries.length === 0"
      class="col-span-3 text-center"
      data-testid="account-orders-content"
    >
      <h3 class="typography-headline-3 font-bold mt-6 mb-4">{{ t('account.ordersAndReturns.noOrders') }}</h3>
      <UiButton :tag="NuxtLink" :to="localePath(paths.category)" variant="secondary" class="!ring-neutral-200">
        {{ t('account.ordersAndReturns.continue') }}
      </UiButton>
    </div>
    <div v-else class="col-span-3" data-testid="account-orders-content">
      <div class="relative col-span-3" :class="{ 'pointer-events-none opacity-50': loading }">
        <template v-if="viewport.isLessThan('md')">
          <ul v-for="(order, index) in data.data.entries" :key="index" class="my-4 last-of-type:mb-0">
            <li>
              <p class="block typography-text-sm font-medium">{{ t('account.ordersAndReturns.orderId') }}</p>
              <span class="block typography-text-sm mb-2">{{ orderGetters.getId(order) }}</span>
            </li>
            <li>
              <p class="block typography-text-sm font-medium">
                {{ t('account.ordersAndReturns.orderDate') }}
              </p>
              <span class="block typography-text-sm mb-2">{{ orderGetters.getDate(order, locale) }}</span>
            </li>
            <li>
              <p class="block typography-text-sm font-medium">{{ t('account.ordersAndReturns.amount') }}</p>
              <span class="block typography-text-sm mb-2">{{ n(orderGetters.getPrice(order), 'currency') }}</span>
            </li>
            <li v-if="orderGetters.getShippingDate(order)">
              <p class="block typography-text-sm font-medium">{{ t('account.ordersAndReturns.shippingDate') }}</p>
              <span class="block typography-text-sm mb-2">{{ orderGetters.getShippingDate(order) }}</span>
            </li>
            <li class="flex flex-wrap items-center mb-2">
              <p class="block typography-text-sm -mb-1.5 font-medium flex-[100%]">
                {{ t('account.ordersAndReturns.status') }}
              </p>
              <span class="block typography-text-sm flex-1">{{ orderGetters.getStatus(order) }}</span>
              <UiButton :tag="NuxtLink" size="sm" variant="tertiary" :to="localePath(generateOrderDetailsLink(order))">
                {{ t('account.ordersAndReturns.details') }}
              </UiButton>
              <UiDropdown class="relative">
                <template #trigger>
                  <UiButton variant="tertiary">
                    <SfIconMoreHoriz size="sm" />
                  </UiButton>
                </template>
                <ul
                  class="rounded bg-white relative shadow-md border border-neutral-100 text-neutral-900 min-w-[152px] py-2"
                >
                  <li>
                    <SfListItem tag="button" class="text-left" @click="openOrderAgainModal(order)">
                      {{ t('account.ordersAndReturns.orderAgain.heading') }}
                    </SfListItem>
                  </li>
                  <li>
                    <NuxtLink :to="localePath(generateNewReturnLink(order))">
                      <SfListItem v-if="orderGetters.isReturnable(order)" tag="button" class="text-left">
                        {{ t('returns.return') }}
                      </SfListItem>
                    </NuxtLink>
                  </li>
                </ul>
              </UiDropdown>
            </li>
            <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
          </ul>
        </template>
        <table v-else class="md:block md:overflow-x-auto text-left typography-text-sm w-auto mx-4 scrollbar-hidden">
          <caption class="hidden">
            {{
              t('account.ordersAndReturns.listOfOrders')
            }}
          </caption>
          <thead class="border-b-2 border-neutral-200">
            <tr>
              <th class="lg:py-4 py-2 lg:pr-4 pr-2 font-medium">{{ t('account.ordersAndReturns.orderId') }}</th>
              <th class="lg:p-4 p-2 font-medium lg:whitespace-nowrap">
                {{ t('account.ordersAndReturns.orderDate') }}
              </th>
              <th class="lg:p-4 p-2 font-medium">{{ t('account.ordersAndReturns.amount') }}</th>
              <th class="lg:p-4 p-2 font-medium">{{ t('account.ordersAndReturns.shippingDate') }}</th>
              <th class="lg:p-4 p-2 font-medium">{{ t('account.ordersAndReturns.status') }}</th>
              <th class="lg:py-4 py-2 lg:pl-4 pl-2 font-medium">{{ t('account.ordersAndReturns.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in data.data.entries" :key="index" class="border-b border-neutral-200">
              <td class="lg:py-4 py-2 lg:pr-4 pr-2 lg:whitespace-nowrap">{{ orderGetters.getId(order) }}</td>
              <td class="lg:p-4 p-2 lg:whitespace-nowrap">{{ orderGetters.getDate(order, locale) }}</td>
              <td class="lg:p-4 p-2">{{ n(orderGetters.getPrice(order), 'currency') }}</td>
              <td class="lg:p-4 p-2">{{ orderGetters.getShippingDate(order) ?? '' }}</td>
              <td class="lg:p-4 p-2 lg:whitespace-nowrap w-full">{{ orderGetters.getStatus(order) }}</td>
              <td class="py-1.5 lg:pl-1.5 pl-2 text-right w-full flex">
                <UiButton
                  :tag="NuxtLink"
                  size="sm"
                  variant="tertiary"
                  :to="localePath(generateOrderDetailsLink(order))"
                >
                  {{ t('account.ordersAndReturns.details') }}
                </UiButton>
                <UiDropdown class="relative">
                  <template #trigger>
                    <UiButton variant="tertiary">
                      <SfIconMoreHoriz size="sm" />
                    </UiButton>
                  </template>
                  <ul
                    class="rounded bg-white relative shadow-md border border-neutral-100 text-neutral-900 min-w-[152px] py-2"
                  >
                    <li>
                      <SfListItem tag="button" class="text-left" @click="openOrderAgainModal(order)">
                        {{ t('account.ordersAndReturns.orderAgain.heading') }}
                      </SfListItem>
                    </li>
                    <li>
                      <NuxtLink :to="localePath(generateNewReturnLink(order))">
                        <SfListItem v-if="orderGetters.isReturnable(order)" tag="button" class="text-left">
                          {{ t('returns.return') }}
                        </SfListItem>
                      </NuxtLink>
                    </li>
                  </ul>
                </UiDropdown>
              </td>
            </tr>
          </tbody>
        </table>
        <UiPagination
          v-if="data.data.lastPageNumber > 1"
          :disabled="loading"
          :current-page="data.data.page"
          :total-items="data.data.totalsCount"
          :page-size="data.data.itemsPerPage"
          :max-visible-pages="maxVisiblePages"
        />
      </div>
    </div>
  </ClientOnly>
  <OrderAgain v-if="selectedOrder" :order="selectedOrder" />
</template>

<script setup lang="ts">
import { type Order, orderGetters } from '@plentymarkets/shop-api';
import { SfIconMoreHoriz, SfListItem, SfLoaderCircular } from '@storefront-ui/vue';
import { paths } from '~/utils/paths';

const NuxtLink = resolveComponent('NuxtLink');
const { openOrderAgainModal, order: selectedOrder } = useOrderAgain();
const route = useRoute();
const localePath = useLocalePath();
const { t, n, locale } = useI18n();
const viewport = useViewport();
const maxVisiblePages = ref(1);
const setMaxVisiblePages = (isWide: boolean) => (maxVisiblePages.value = isWide ? 5 : 1);
const isDesktop = computed(() => viewport.isGreaterOrEquals('lg'));

definePageMeta({
  layout: 'account',
  pageType: 'static',
  middleware: ['auth-guard'],
});

onMounted(() => setMaxVisiblePages(isDesktop.value));

const { fetchCustomerOrders, data, loading } = useCustomerOrders();
const generateOrderDetailsLink = (order: Order) => {
  return `${paths.confirmation}/${orderGetters.getId(order)}/${orderGetters.getAccessKey(order)}`;
};

const generateNewReturnLink = (order: Order) => {
  return `${paths.accountNewReturn}/${orderGetters.getId(order)}/${orderGetters.getAccessKey(order)}`;
};
const handleQueryUpdate = async () => {
  await fetchCustomerOrders({
    page: Number(route.query.page as string) || defaults.DEFAULT_PAGE,
  });
};
handleQueryUpdate();

watch(isDesktop, (value) => setMaxVisiblePages(value));
watch(
  () => route.query,
  () => {
    handleQueryUpdate();
  },
);
</script>
