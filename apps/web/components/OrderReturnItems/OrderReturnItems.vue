<template>
  <SfButton class="mt-4 w-full cursor-pointer" variant="secondary" @click="openReturn()">
    {{ $t('returns.returnItems') }}
  </SfButton>

  <OrderReturnForm :is-open="isReturnOpen" @close="closeReturn" />
</template>

<script setup lang="ts">
import { SfButton, useDisclosure } from '@storefront-ui/vue';
import type { OrderReturnItemsProps } from './types';

const props = defineProps<OrderReturnItemsProps>();

const { isOpen: isReturnOpen, open: openReturnForm, close: closeReturn } = useDisclosure();

const { setCurrentReturnOrder } = useReturnOrder();

const openReturn = () => {
  setCurrentReturnOrder(props.order);
  openReturnForm();
};
</script>
