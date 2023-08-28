<template>
 <div
    role="alert"
    class="bg-neutral-100 max-w-[600px] shadow-md pr-2 pl-4 ring-1 ring-neutral-300 typography-text-sm md:typography-text-base py-1 rounded-md"
  >
    <p class="py-2">{{ notification.message }}</p>
  </div>
</template>
<script setup lang="ts">
import { NeutralNotificationProps } from './types';
defineProps<NeutralNotificationProps>();
</script>
