<template>
  <UiOverlay visible>
    <UiModal
      v-if="data"
      v-model="isOpen"
      as="section"
      role="dialog"
      class="h-full w-full overflow-auto !p-4 md:!p-10 md:max-w-[770px] md:h-fit"
    >
      <header
        class="flex justify-between bg-white items-center typography-headline-4 md:typography-headline-3 font-bold"
      >
        <h3>{{ $t('account.ordersAndReturns.orderDetails.heading') }}</h3>
        <UiButton
          square
          variant="tertiary"
          :tag="NuxtLink"
          :to="localePath(paths.accountMyOrders)"
          class="md:absolute md:top-2 md:right-2"
        >
          <SfIconClose class="text-neutral-500" />
        </UiButton>
      </header>
      <main class="mt-6">
        <ul class="bg-neutral-100 p-4 rounded-md md:columns-2 mb-6">
          <li>
            <p class="font-medium">{{ $t('account.ordersAndReturns.orderDetails.orderId') }}</p>
            <span>{{ orderGetters.getId(data) }}</span>
          </li>
          <li class="my-4 md:mb-0">
            <p class="font-medium">{{ $t('account.ordersAndReturns.orderDetails.orderDate') }}</p>
            <span>{{ orderGetters.getDate(data, locale) }}</span>
          </li>
          <li>
            <p class="font-medium">{{ $t('account.ordersAndReturns.orderDetails.paymentAmount') }}</p>
            <span>{{ $n(orderGetters.getTotal(data.totals), 'currency') }}</span>
          </li>
          <li class="mt-4">
            <p class="font-medium">{{ $t('account.ordersAndReturns.orderDetails.status') }}</p>
            <span>{{ orderGetters.getStatus(data) }}</span>
          </li>
        </ul>
        <div v-for="(variation, i) in data.variations" :key="i" class="md:hidden border-t border-neutral-200">
          <!--
          <UiProductCardHorizontal :product="product" />
          <ul class="flex">
            <li class="flex-grow pr-4 py-4">
              <p class="font-medium typography-text-sm">{{ $t('account.ordersAndReturns.orderDetails.price') }}</p>
              <span>${{ product.price?.regularPrice.amount }}</span>
            </li>
            <li class="flex-grow p-4">
              <p class="font-medium typography-text-sm">{{ $t('account.ordersAndReturns.orderDetails.quantity') }}</p>
              <span>{{ product.quantity }}</span>
            </li>
            <li class="flex-[50%] justify-self-end text-right pl-4 py-4">
              <p class="font-medium typography-text-sm">{{ $t('account.ordersAndReturns.orderDetails.subtotal') }}</p>
              <span>${{ product.price?.regularPrice.precisionAmount }}</span>
            </li>
          </ul>
          -->
        </div>
        <table class="hidden md:table w-full text-left typography-text-sm mx-4 md:mx-0">
          <caption class="hidden">
            {{
              $t('account.ordersAndReturns.orderDetails.tableCaption')
            }}
          </caption>
          <thead>
            <tr class="border-b-2 border-neutral-200">
              <th class="py-3 font-medium">{{ $t('account.ordersAndReturns.orderDetails.product') }}</th>
              <th class="py-3 px-4 font-medium lg:whitespace-nowrap">
                {{ $t('account.ordersAndReturns.orderDetails.price') }}
              </th>
              <th class="py-3 px-4 font-medium">{{ $t('account.ordersAndReturns.orderDetails.quantity') }}</th>
              <th class="py-3 px-4 font-medium">{{ $t('account.ordersAndReturns.orderDetails.subtotal') }}</th>
            </tr>
          </thead>
          <tbody>
            <!--
            <tr v-for="(product, i) in data?.products" :key="i" class="border-b border-neutral-200 align-top">
              <td class="pb-4 pr-4 lg:whitespace-nowrap typography-text-base">
                <UiProductCardHorizontal :product="product" />
              </td>
              <td class="p-4 lg:whitespace-nowrap typography-text-base">${{ product.price?.regularPrice.amount }}</td>
              <td class="p-4 typography-text-base">{{ product.quantity }}</td>
              <td class="p-4 typography-text-base">${{ product.price?.regularPrice.precisionAmount }}</td>
            </tr>
            -->
          </tbody>
        </table>

        <div class="flex justify-between pt-4 border-t border-neutral-200 md:border-0">
          <p>{{ $t('account.ordersAndReturns.orderDetails.itemsSubtotal') }}</p>
          <span>${{ orderGetters.getSubTotal(data.totals) }}</span>
        </div>
        <div class="flex justify-between my-2">
          <p>{{ $t('account.ordersAndReturns.orderDetails.delivery') }}</p>
          <span>{{ orderGetters.getShippingCost(data) }}</span>
        </div>
        <div class="flex justify-between border-b pb-4 border-neutral-200">
          <p>{{ $t('account.ordersAndReturns.orderDetails.estimatedTax') }}</p>
          <span>${{ orderGetters.getVatAmount(data.totals) }}</span>
        </div>
        <div class="flex justify-between border-b py-4 border-neutral-200 typography-text-lg font-medium">
          <p>{{ $t('account.ordersAndReturns.orderDetails.total') }}</p>
          <span>${{ orderGetters.getTotal(data.totals) }}</span>
        </div>
        <!--
        <ul class="md:columns-2 mt-6">
          <li class="mb-4">
            <p class="typography-text-sm font-medium mb-2">
              {{ $t('account.ordersAndReturns.orderDetails.billingAddress') }}
            </p>
            <span>{{ data?.billingAddress.firstName }} {{ data?.billingAddress.lastName }}</span>
            <span class="block">{{ data?.billingAddress.phoneNumber }}</span>
            <span>{{ data?.billingAddress.address1 }} {{ data?.billingAddress.address2 }}</span>
            <span class="block">
              {{ data?.billingAddress.city }}, {{ data?.billingAddress.state }}
              {{ data?.billingAddress.postalCode }}
            </span>
          </li>
          <li class="mb-4 md:mb-0">
            <p class="typography-text-sm font-medium mb-2">
              {{ $t('account.ordersAndReturns.orderDetails.paymentMethod') }}
            </p>
            <span>{{ data?.paymentMethod }}</span>
          </li>
          <li class="mb-4">
            <p class="typography-text-sm font-medium mb-2">
              {{ $t('account.ordersAndReturns.orderDetails.shippingAddress') }}
            </p>
            <span>{{ data?.shippingAddress.firstName }} {{ data?.shippingAddress.lastName }}</span>
            <span class="block">{{ data?.shippingAddress.phoneNumber }}</span>
            <span>{{ data?.shippingAddress.address1 }} {{ data?.shippingAddress.address2 }}</span>
            <span class="block">
              {{ data?.shippingAddress.city }}, {{ data?.shippingAddress.state }}
              {{ data?.shippingAddress.postalCode }}
            </span>
          </li>
          <li class="mb-4 md:mb-0">
            <p class="typography-text-sm font-medium mb-2">
              {{ $t('account.ordersAndReturns.orderDetails.paymentMethod') }}
            </p>
            <span>{{ data?.shipping }}</span>
          </li>
        </ul>
        -->
      </main>
    </UiModal>
  </UiOverlay>
  <NuxtPage />
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-api';
import { SfIconClose, useDisclosure } from '@storefront-ui/vue';
import { paths } from '~/utils/paths';

const route = useRoute();
const localePath = useLocalePath();
const { locale } = useI18n();
const { isOpen } = useDisclosure({ initialValue: true });
const { fetchOrder, data } = useCustomerOrder(route.params.id as string);

definePageMeta({
  layout: 'account',
  pageType: 'static',
  middleware: ['auth-guard'],
});

onMounted(async () => {
  // without nextTick data on first click does not load data
  await nextTick();
  await fetchOrder({
    orderId: route.params.id as string,
  });
});

watch(
  isOpen,
  (isOpen) => {
    if (!isOpen) navigateTo(localePath(paths.accountMyOrders));
  },
  { immediate: true },
);

const NuxtLink = resolveComponent('NuxtLink');
</script>
