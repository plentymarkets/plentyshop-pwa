<template>
  <form v-if="order" class="grid grid-cols-1 md:grid-cols-[50%_1fr_120px] gap-4">
    {{ order.order.order.orderItems }}
    <!-- <div v-for="item in order.order.order.orderItems" :key="item.id">
      {{ item.id }}
      <OrderReturnForm :cartItem="item"></OrderReturnForm>
    </div> -->
    <div class="md:col-span-3 flex flex-col-reverse md:flex-row justify-end mt-6 gap-4">
      <SfButton> send return </SfButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { OrderReturnProps } from './types';
const order = defineProps<OrderReturnProps>();
</script>
