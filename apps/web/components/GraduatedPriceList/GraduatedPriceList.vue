<template>
  <div class="typography-text-sm font-bold" v-if="graduatedList.length > 0">
    {{ $t('graduatedPrices.title') }}
  </div>
  <table class="w-full text-left typography-text-sm mb-2" v-if="graduatedList.length > 0">
    <thead class="border-b-2 border-neutral-200">
      <tr class="w-full">
        <th class="lg:py-4 py-2 lg:pr-4 pr-2 font-medium">{{ $t('graduatedPrices.price') }}</th>
        <th class="lg:p-4 p-2 font-medium lg:whitespace-nowrap">{{ $t('graduatedPrices.quantity') }}</th>
        <th class="lg:p-4 p-2 font-medium">{{ $t('graduatedPrices.discount') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(list, index) in graduatedList" :key="index" class="border-b border-neutral-200">
        <td class="lg:py-4 py-2 lg:pr-4 pr-2 lg:whitespace-nowrap">{{ $n(list.price, 'currency') }}</td>
        <td class="lg:p-4 p-2 lg:whitespace-nowrap">{{ list.quantity }}</td>
        <td class="lg:p-4 p-2">{{ list.discount }} %</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-sdk';
import { GraduatedPriceListProps } from '~/components/GraduatedPriceList/types';

const { product } = defineProps<GraduatedPriceListProps>();
const graduatedList = computed(() => productGetters.getGraduatedList(product));
</script>
