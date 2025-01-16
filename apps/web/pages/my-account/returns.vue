<template>
  <ClientOnly>
    <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
    <h2
      class="hidden md:block col-span-3 typography-headline-4 font-bold mx-4 capitalize"
      data-testid="account-returns-heading"
    >
      {{ t('account.ordersAndReturns.returnsHeading') }}
    </h2>
    <div v-if="!data?.entries.length" class="col-span-3 text-center" data-testid="account-returns-content">
      <!-- TODO: add image when we find a suitable one in a format that works. -->
      <!--      <NuxtImg-->
      <!--        src="/images/returns.png"-->
      <!--        :alt="t('account.ordersAndReturns.returnsAltText')"-->
      <!--        width="192"-->
      <!--        height="192"-->
      <!--        class="mx-auto"-->
      <!--        loading="lazy"-->
      <!--      />-->
      <h3 class="typography-headline-3 font-bold mt-6 mb-4">
        {{ t('account.ordersAndReturns.noReturns') }}
      </h3>
    </div>

    <div
      v-else
      class="relative col-span-3"
      :class="{ 'pointer-events-none opacity-50': loading }"
      data-testid="account-returns-content"
    >
      <SfLoaderCircular v-if="loading" class="absolute top-0 bottom-0 right-0 left-0 m-auto z-[999]" size="2xl" />

      <template v-if="!isTablet">
        <ul v-for="order in data.entries" :key="order.order.id" class="my-4 last-of-type:mb-0">
          <li>
            <p class="block typography-text-sm font-medium">{{ t('account.ordersAndReturns.returnId') }}</p>
            <span class="block typography-text-sm mb-2">{{ orderGetters.getId(order) }}</span>
          </li>
          <li>
            <p class="block typography-text-sm font-medium">
              {{ t('account.ordersAndReturns.returnDate') }}
            </p>
            <span class="block typography-text-sm mb-2">{{ orderGetters.getDate(order, locale) }}</span>
          </li>
          <li>
            <p class="block typography-text-sm font-medium">
              {{ t('account.ordersAndReturns.orderDetails.paymentMethod') }}
            </p>
            <span class="block typography-text-sm mb-2">{{ orderGetters.getPaymentMethodName(order) }}</span>
          </li>
          <li>
            <UiButton
              :to="localePath(generateOrderDetailsLink(order))"
              :tag="NuxtLink"
              size="sm"
              variant="tertiary"
              class="!px-0"
            >
              {{ t('account.ordersAndReturns.details') }}
            </UiButton>
          </li>
          <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
        </ul>
      </template>

      <table v-else class="md:block text-left typography-text-sm mx-4">
        <caption class="hidden">
          {{
            t('account.ordersAndReturns.listOfOrders')
          }}
        </caption>
        <thead class="border-b-2 border-neutral-200">
          <tr>
            <th class="lg:py-4 py-2 lg:pr-4 pr-2 font-medium">{{ t('account.ordersAndReturns.returnId') }}</th>
            <th class="lg:p-4 p-2 font-medium lg:whitespace-nowrap">{{ t('account.ordersAndReturns.returnDate') }}</th>
            <th class="lg:p-4 p-2 font-medium w-full">
              {{ t('account.ordersAndReturns.orderDetails.paymentMethod') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="orderReturn in data.entries" :key="orderReturn.order.id" class="border-b border-neutral-200">
            <td class="lg:p-4 p-2 lg:whitespace-nowrap">{{ orderGetters.getId(orderReturn) }}</td>
            <td class="lg:p-4 p-2 lg:whitespace-nowrap">{{ orderGetters.getDate(orderReturn, locale) }}</td>
            <td class="lg:p-4 p-2">{{ orderGetters.getPaymentMethodName(orderReturn) }}</td>
            <td>
              <UiButton
                :tag="NuxtLink"
                size="sm"
                variant="tertiary"
                :to="localePath(generateOrderDetailsLink(orderReturn))"
              >
                {{ t('account.ordersAndReturns.details') }}
              </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
      <UiPagination
        v-if="data.lastPageNumber > 1"
        :disabled="loading"
        :current-page="data.page"
        :total-items="data.totalsCount"
        :page-size="data.itemsPerPage"
        :max-visible-pages="maxVisiblePages"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { type Order, orderGetters } from '@plentymarkets/shop-api';
import { useDisclosure, SfLoaderCircular } from '@storefront-ui/vue';

definePageMeta({
  layout: 'account',
  pageType: 'static',
  middleware: ['auth-guard'],
});

const { data, fetchCustomerReturns, loading } = useCustomerReturns();
const { isOpen, close } = useDisclosure();

const viewport = useViewport();
const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();
const maxVisiblePages = ref(1);
const route = useRoute();
const { locale, t } = useI18n();
const setMaxVisiblePages = (isWide: boolean) => (maxVisiblePages.value = isWide ? 5 : 1);
const isDesktop = computed(() => viewport.isGreaterOrEquals('lg'));
const isTablet = computed(() => viewport.isGreaterOrEquals('md') && viewport.isLessThan('lg'));

onMounted(() => setMaxVisiblePages(isDesktop.value));

const handleQueryUpdate = async () => {
  await fetchCustomerReturns({
    page: Number(route.query.page as string) || defaults.DEFAULT_PAGE,
  });
};

const generateOrderDetailsLink = (order: Order) => {
  return `${paths.confirmation}/${orderGetters.getId(order)}/${orderGetters.getAccessKey(order)}`;
};

await handleQueryUpdate();

watch(isDesktop, (value) => setMaxVisiblePages(value));

watch(isTablet, (value) => {
  if (value && isOpen.value) close();
});

watch(
  () => route.query,
  async () => {
    await handleQueryUpdate();
  },
);
</script>
