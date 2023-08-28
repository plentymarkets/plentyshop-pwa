<template>
  <div
    role="alert"
    class="flex items-start bg-warning-100 max-w-[600px] shadow-md pr-2 pl-4 ring-1 ring-warning-200 typography-text-sm md:typography-text-base py-1 rounded-md"
  >
    <SfIconWarning class="mt-2 mr-2 text-warning-700 shrink-0" />
    <p class="py-2">{{ notification.message }}</p>
    <button
      type="button"
      @click="notification?.action?.onClick"
      class="py-1.5 px-3 md:py-2 md:px-4 rounded-md text-warning-700 hover:bg-warning-200 active:bg-warning-300 hover:text-warning-800 active:text-warning-900 ml-auto font-medium focus-visible:outline focus-visible:outline-offset"
    >
      {{ notification?.action?.text }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { SfIconWarning } from '@storefront-ui/vue';
import { WarningNotificationProps } from './types';
defineProps<WarningNotificationProps>();
</script>
