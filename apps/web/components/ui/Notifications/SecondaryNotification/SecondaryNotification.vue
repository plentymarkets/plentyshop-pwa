<template>
  <div
    role="alert"
    data-testid="SecondaryNotification"
    class="flex items-start md:items-center max-w-[600px] shadow-md pr-2 pl-4 ring-1 typography-text-sm md:typography-text-base py-1 rounded-md bg-secondary-100 ring-secondary-300"
  >
    <SfIconInfo class="mr-2 text-secondary-700 shrink-0" />
    <div class="py-2 mr-2">
      <div v-if="typeof notification.message === 'string'">{{ notification.message }}</div>
      <div v-else v-for="message in notification.message" :key="message" :class="{ 'h-6': message === '' }">
        {{ message }}
      </div>
    </div>
    <button
      v-if="notification?.action?.onClick"
      @click="notification?.action?.onClick"
      type="button"
      class="py-1.5 px-3 md:py-2 md:px-4 rounded-md ml-auto font-medium focus-visible:outline focus-visible:outline-offset text-secondary-700 hover:bg-secondary-200 active:bg-secondary-300 hover:text-secondary-800 active:text-secondary-900"
    >
      {{ notification?.action?.text }}
    </button>
    <button
      type="button"
      @click="notification.dismiss"
      class="p-1.5 md:p-2 ml-2 rounded-md focus-visible:outline focus-visible:outline-offset text-secondary-700 hover:bg-secondary-200 active:bg-secondary-300 hover:text-secondary-800 active:text-secondary-900"
      :class="{ 'ml-auto': !notification?.action?.text }"
      aria-label="Close secondary alert"
    >
      <SfIconClose class="hidden md:block" />
      <SfIconClose size="sm" class="block md:hidden" />
    </button>
  </div>
</template>
<script setup lang="ts">
import { SfIconClose, SfIconInfo } from '@storefront-ui/vue';
import { SecondaryNotificationProps } from './types';

defineProps<SecondaryNotificationProps>();
</script>
