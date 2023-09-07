<template>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <h2 class="hidden md:block col-span-3 typography-headline-4 mb-4 font-bold mx-4 capitalize">
    {{ $t('account.ordersAndReturns.returnsHeading') }}
  </h2>
  <!-- <div v-if="!data?.length" class="col-span-3 text-center">
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
  </div> -->
  <div class="col-span-3">
    <table class="hidden md:block text-left typography-text-sm mx-4">
      <caption class="hidden">
        {{
          $t('account.ordersAndReturns.listOfOrders')
        }}
      </caption>
      <thead class="border-b-2 border-neutral-200">
        <tr>
          <th class="lg:py-4 py-2 lg:pr-4 pr-2 font-medium">{{ $t('account.ordersAndReturns.orderId') }}</th>
          <th class="lg:p-4 p-2 font-medium lg:whitespace-nowrap">{{ $t('account.ordersAndReturns.returnDate') }}</th>
          <th class="lg:p-4 p-2 font-medium">{{ $t('account.ordersAndReturns.orderDetails.paymentMethod') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="orderReturn in data.entries" :key="orderReturn.order.id" class="border-b border-neutral-200">
          <td class="lg:p-4 p-2 lg:whitespace-nowrap">{{ orderReturn.order.id }}</td>
          <td class="lg:p-4 p-2">{{ $d(new Date(orderReturn.order.dates[1].date)) }}</td>
          <td class="lg:p-4 p-2">{{ orderReturn.paymentMethodName }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'account',
});

const { fetchCustomerReturns, data } = useCustomerReturns();
await fetchCustomerReturns();
</script>
