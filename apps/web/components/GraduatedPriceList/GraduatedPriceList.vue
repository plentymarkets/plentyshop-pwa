<template>
  <div v-if="graduatedList.length > 0" class="typography-text-sm font-bold mt-5">
    {{ $t('graduatedPrices.title') }}
  </div>
  <table v-if="graduatedList.length > 0" class="w-full text-left typography-text-sm mb-2">
    <thead class="border-b-2 border-neutral-200">
      <tr>
        <th class="lg:py-4 py-2 lg:pr-4 pr-2 font-medium">{{ $t('graduatedPrices.price') }}</th>
        <th class="lg:p-4 p-2 font-medium lg:whitespace-nowrap">{{ $t('graduatedPrices.quantity') }}</th>
        <th class="lg:p-4 p-2 font-medium">{{ $t('graduatedPrices.discount') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(list, index) in graduatedList"
        :key="index"
        class="border-b border-neutral-200"
        :class="{ 'bg-gray-200': list.price === selectedList?.price.value }"
      >
        <td class="lg:py-4 py-2 lg:pr-4 pr-2 lg:whitespace-nowrap h-[38px]">{{ $n(list.price, 'currency') }}</td>
        <td class="lg:p-4 p-2 lg:whitespace-nowrap h-[38px]">{{ list.quantity }}</td>
        <td class="lg:p-4 p-2 flex h-[38px]">
          <div>{{ list.discount }} %</div>
          <SfIconCheck
            v-if="selectedList && list.price === selectedList.price.value"
            class="ml-auto text-primary-400"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { GraduatedPriceListProps } from '~/components/GraduatedPriceList/types';
import { SfIconCheck } from '@storefront-ui/vue';

const { product, count = 0 } = defineProps<GraduatedPriceListProps>();
const graduatedList = computed(() => productGetters.getGraduatedList(product));
const selectedList = computed(() => productGetters.getGraduatedPriceByQuantity(product, count));
</script>
