<template>
  <div data-testid="notifications" class="sticky float-right w-50 right-2 max-w-[450px] z-[51] top-0 h-0">
    <div v-for="notification of notifications" class="my-2" :key="notification.id">
      <UiAlert :size="'base'" :variant="notification.type">
        <div>
          <div class="typography-text-sm" v-if="typeof notification.message === 'string'">
            {{ notification.message }}
          </div>
          <div
            v-else
            v-for="message in notification.message"
            :key="message"
            class="typography-text-sm"
            :class="{ 'h-6': message === '' }"
          >
            {{ message }}
          </div>
        </div>
        <button
          v-if="notification?.action?.onClick"
          @click="notification?.action?.onClick"
          type="button"
          class="py-1.5 px-3 md:py-2 md:px-4 rounded-md ml-auto font-medium focus-visible:outline focus-visible:outline-offset"
          :class="[getButtonClasses(notification)]"
        >
          {{ notification?.action?.text }}
        </button>
        <button
          type="button"
          @click="notification.dismiss"
          class="p-1.5 md:p-2 ml-2 rounded-md focus-visible:outline focus-visible:outline-offset"
          :class="[{ 'ml-auto': !notification?.action?.text }, getButtonClasses(notification)]"
          aria-label="Close neutral alert"
        >
          <SfIconClose class="hidden md:block" />
          <SfIconClose size="sm" class="block md:hidden" />
        </button>
      </UiAlert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';
import type { Notification } from '../../../composables/useNotification/types';
const { data: notifications } = useNotification();

const classMapper = {
  neutral: 'text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300 hover:text-neutral-800 active:text-neutral-900',
  warning: 'text-warning-700 hover:bg-warning-200 active:bg-warning-300 hover:text-warning-800 active:text-warning-900',
  positive:
    'text-positive-700 hover:bg-positive-200 active:bg-positive-300 hover:text-positive-800 active:text-positive-900',
  negative:
    'text-negative-700 hover:bg-negative-200 active:bg-negative-300 hover:text-negative-800 active:text-negative-900',
  secondary:
    'text-secondary-700 hover:bg-secondary-200 active:bg-secondary-300 hover:text-secondary-800 active:text-secondary-900',
};

const getButtonClasses = (notification: Notification) => classMapper[notification.type] ?? '';
</script>
