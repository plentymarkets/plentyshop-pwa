<template>
  <div data-testid="notifications" class="sticky float-right w-50 right-2 max-w-[450px] z-[51] top-0 h-0">
    <div v-for="notification of notifications" :key="notification.id" class="my-2">
      <UiAlert :size="'base'" :variant="notification.type" class="pl-4">
        <component
          :is="getIconComponent(notification)"
          v-if="getIconComponent(notification) && getIconClass(notification)"
          class="!m-0"
          :class="getIconClass(notification)"
        />

        <div>
          <div v-if="typeof notification.message === 'string'" class="typography-text-sm">
            {{ notification.message }}
          </div>
          <div
            v-for="message in notification.message"
            v-else
            :key="message"
            class="typography-text-sm"
            :class="{ 'h-6': message === '' }"
          >
            {{ message }}
          </div>
        </div>
        <button
          v-if="notification?.action?.onClick"
          type="button"
          class="py-1.5 px-3 md:py-2 md:px-4 rounded-md ml-auto font-medium focus-visible:outline focus-visible:outline-offset"
          :class="[getButtonClasses(notification)]"
          @click="notification?.action?.onClick"
        >
          {{ notification?.action?.text }}
        </button>
        <button
          type="button"
          class="p-1.5 md:p-2 ml-2 rounded-md focus-visible:outline focus-visible:outline-offset"
          :class="[{ 'ml-auto': !notification?.action?.text }, getButtonClasses(notification)]"
          aria-label="Close neutral alert"
          @click="notification.dismiss"
        >
          <SfIconClose class="hidden md:block" />
          <SfIconClose size="sm" class="block md:hidden" />
        </button>
      </UiAlert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconCheckCircle, SfIconInfo, SfIconWarning, SfIconError } from '@storefront-ui/vue';
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
    'text-secondary-500 hover:bg-secondary-50 active:bg-secondary-100 hover:text-secondary-600 active:text-secondary-700',
};

const iconMapper = {
  positive: {
    component: SfIconCheckCircle,
    class: 'my-2 mr-2 text-positive-700 shrink-0',
  },
  secondary: {
    component: SfIconInfo,
    class: 'mr-2 text-secondary-700 shrink-0',
  },
  warning: {
    component: SfIconWarning,
    class: 'mt-2 mr-2 text-warning-700 shrink-0',
  },
  negative: {
    component: SfIconError,
    class: 'mt-2 mr-2 text-negative-700 shrink-0',
  },
  neutral: null,
};

const getIconComponent = (notification: Notification) => iconMapper[notification.type]?.component ?? null;
const getIconClass = (notification: Notification) => iconMapper[notification.type]?.class ?? null;
const getButtonClasses = (notification: Notification) => classMapper[notification.type] ?? '';
</script>
