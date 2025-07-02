<template>
  <UiButton class="mt-4 w-full cursor-pointer" variant="secondary" @click="handleTrackingUrl()">
    {{ t('returns.returnItems') }}
  </UiButton>

  <UiModal v-model="openModal">
    Placeholder
  </UiModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { OrderTrackingButtonProps } from './types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { order } = defineProps<OrderTrackingButtonProps>();
const openModal = ref(false);

const handleTrackingUrl = () => {
  if (order.order.tracking?.trackingURLs.length && (order.order.tracking.trackingURLs.length > 1)) {
    const url = order.order.tracking.trackingURLs[0];
    window.open(url, '_blank');
    // navigator.clipboard.writeText(url); // if i have to copy to clipboard
  } else {
    openModal.value = true;
  }
};
</script>
