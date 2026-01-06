<template>
  <UiButton class="mt-4 w-full cursor-pointer" variant="secondary" @click="openReturn()">
    {{ t('returns.returnItems') }}
  </UiButton>

  <OrderReturnForm :is-open="isReturnOpen" @close="closeReturn" />
</template>

<script setup lang="ts">
import { useDisclosure } from '@storefront-ui/vue';
import type { OrderReturnItemsProps } from './types';

const props = defineProps<OrderReturnItemsProps>();

const { isOpen: isReturnOpen, open: openReturnForm, close: closeReturn } = useDisclosure();
const { t } = useI18n();
const { setCurrentReturnOrder } = useReturnOrder();

const openReturn = () => {
  setCurrentReturnOrder(props.order);
  openReturnForm();
};
</script>
