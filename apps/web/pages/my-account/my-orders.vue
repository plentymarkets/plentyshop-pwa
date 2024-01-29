<template>
  <ClientOnly>
    <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
    <h2
      class="hidden md:block col-span-3 typography-headline-4 font-bold mx-4 capitalize"
      data-testid="account-orders-heading"
    >
      {{ $t('account.ordersAndReturns.myOrders') }}
    </h2>
    <div
      v-if="!data || data.data.entries.length === 0"
      class="col-span-3 text-center mt-8"
      data-testid="account-orders-content"
    >
      <NuxtImg
        src="/images/empty-cart.svg"
        :alt="$t('account.ordersAndReturns.noOrdersAltText')"
        width="192"
        height="192"
        class="mx-auto"
      />
      <h3 class="typography-headline-3 font-bold mb-4 mt-6">{{ $t('account.ordersAndReturns.noOrders') }}</h3>
      <SfButton :tag="NuxtLink" :to="localePath(paths.category)" variant="secondary" class="!ring-neutral-200">
        {{ $t('account.ordersAndReturns.continue') }}
      </SfButton>
    </div>
    <div v-else class="col-span-3" data-testid="account-orders-content">
      <div class="relative col-span-3" :class="{ 'pointer-events-none opacity-50': loading }">
        <SfLoaderCircular v-if="loading" class="absolute top-0 bottom-0 right-0 left-0 m-auto z-[999]" size="2xl" />
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
            <SfButton :tag="NuxtLink" size="sm" variant="tertiary" :to="localePath(generateOrderDetailsLink(order))">
              {{ $t('account.ordersAndReturns.details') }}
            </SfButton>
          </li>
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
              <th class="lg:p-4 p-2 font-medium"></th>
              <th class="lg:py-4 py-2 lg:pl-4 pl-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in data.data.entries" :key="index" class="border-b border-neutral-200">
              <td class="lg:py-4 py-2 lg:pr-4 pr-2 lg:whitespace-nowrap">{{ orderGetters.getId(order) }}</td>
              <td class="lg:p-4 p-2 lg:whitespace-nowrap">{{ orderGetters.getDate(order) }}</td>
              <td class="lg:p-4 p-2">{{ $n(orderGetters.getPrice(order), 'currency') }}</td>
              <td class="lg:p-4 p-2">{{ orderGetters.getShippingDate(order) ?? '' }}</td>
              <td class="lg:p-4 p-2 lg:whitespace-nowrap w-full">{{ orderGetters.getStatus(order) }}</td>
              <td class="lg:p-4 p-2 lg:whitespace-nowrap w-full">
                <SfButton @click="openReturn(order)" size="sm" variant="tertiary"> Return </SfButton>
              </td>
              <td class="py-1.5 lg:pl-4 pl-2 text-right w-full">
                <SfButton
                  :tag="NuxtLink"
                  size="sm"
                  variant="tertiary"
                  :to="localePath(generateOrderDetailsLink(order))"
                >
                  {{ $t('account.ordersAndReturns.details') }}
                </SfButton>
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
        <UiModal
          v-model="isOpen"
          tag="section"
          role="dialog"
          class="h-full w-fit md:h-fit"
          aria-labelledby="return-modal-title"
        >
          <div v-if="!isSelected">
            <div v-if="selectedOrder" class="flex justify-between mb-5">
              <span class="text-neutral-900 mb-4">
                <span class="font-bold"> Return for order: </span> # {{ orderGetters.getId(selectedOrder) }}
              </span>
              <span class="text-neutral-900 mb-4">
                <span class="font-bold">Order date </span>
                : {{ orderGetters.getDate(selectedOrder) }}</span
              >
              <div
                class="bg-white align-center align-baseline text-center border-2 border-primary-800 text-primary-800 rounded-lg px-3 py-1"
              >
                <SfCheckbox class="text-primary-800 mt-2" id="checkbox" v-model="checkAll" value="value" />
                <label class="ml-3 text-primary-800" for="checkbox"> {{ $t('returns.selectAll') }} </label>
              </div>
            </div>
            <div class="w-full" v-if="selectedOrder">
              <OrderReturnForm :order="selectedOrder" />
            </div>
            <div class="flex flex-row justify-between mt-5">
              <SfButton @click="close()" variant="secondary"> {{ $t('return.cancel') }} </SfButton>
              <SfButton @click="isSelected = true">
                {{ $t('returns.initiateReturn') }}
                <SfIconArrowForward />
              </SfButton>
            </div>
          </div>
          <div v-else class="w-80">
            <header>
              <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
                <SfIconClose />
              </SfButton>
            </header>
            <div class="text-2xl font-bold">{{ $t('returns.returnItems') }}</div>
            <div></div>
            <div class="my-5">
              <ul class="list-disc ml-7 font-medium">
                <li>1 x Item1</li>
                <li>2 x Item2</li>
                <li>1 x Item3</li>
              </ul>
            </div>
            <div class="mt-2">{{ $t('returns.commentOptional') }}</div>
            <div class="w-full">
              <SfTextarea :placeholder="$t('returns.tellUsMore')" class="w-full block" />
            </div>
            <div class="flex flex-row justify-between mt-5">
              <SfButton @click="isSelected = false" variant="secondary"> {{ $t('returns.cancel') }} </SfButton>
              <SfButton> {{ $t('returns.confirmReturn') }} </SfButton>
            </div>
          </div>
        </UiModal>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Order } from '@plentymarkets/shop-api';
import { orderGetters } from '@plentymarkets/shop-sdk';
import {
  SfLoaderCircular,
  SfButton,
  useDisclosure,
  SfCheckbox,
  SfTextarea,
  SfIconClose,
  SfIconArrowForward,
} from '@storefront-ui/vue';
import { ref, Ref } from 'vue';
definePageMeta({
  layout: 'account',
  pageType: 'static',
});

const localePath = useLocalePath();
const selectedOrder: Ref<Order | null> = ref(null);

const { isDesktop } = useBreakpoints();
const maxVisiblePages = ref(1);
const { isOpen, open, close } = useDisclosure();
const isSelected = ref(false);
const openReturn = (orderObject: Order) => {
  selectedOrder.value = orderObject;
  open();
};
const setMaxVisiblePages = (isWide: boolean) => (maxVisiblePages.value = isWide ? 5 : 1);
const route = useRoute();
const checkAll = ref(null);

const NuxtLink = resolveComponent('NuxtLink');
watch(isDesktop, (value) => setMaxVisiblePages(value));
onMounted(() => setMaxVisiblePages(isDesktop.value));

const { fetchCustomerOrders, data, loading } = useCustomerOrders();

const generateOrderDetailsLink = (order: Order) => {
  return `${paths.thankYou}/?orderId=${orderGetters.getId(order)}&accessKey=${orderGetters.getAccessKey(order)}`;
};

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
