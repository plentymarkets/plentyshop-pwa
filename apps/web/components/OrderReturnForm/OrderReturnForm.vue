<template>
  <div>
    <SfScrollable direction="vertical" buttons-placement="none" class="!w-full max-h-[680px]">
      <div v-for="item in orderGetters.getItems(order)" :key="item.id">
        <OrderReturnProductCard :order="order" :order-item="item" />
      </div>
    </SfScrollable>
  </div>
</template>

<script setup lang="ts">
import { OrderReturnProps } from './types';
import { orderGetters } from '@plentymarkets/shop-sdk';
defineProps<OrderReturnProps>();
</script>
