<template>
    <div
    role="alert"
    class="flex items-center max-w-[600px] shadow-md bg-secondary-100 pr-2 pl-4 ring-1 ring-secondary-200 typography-text-sm md:typography-text-base py-1 rounded-md"
  >
    <SfIconInfo class="mr-2 text-secondary-700 shrink-0" />
    <p class="py-2">{{ notification.message }}</p>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo } from '@storefront-ui/vue';
import { SecondaryNotificationProps } from './types';
defineProps<SecondaryNotificationProps>();
</script>
