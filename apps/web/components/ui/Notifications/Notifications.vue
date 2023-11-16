<template>
  <div data-testid="notifications" class="sticky float-right w-50 right-2 max-w-[450px] z-[51] top-0">
    <div v-for="notification of notifications" class="my-2" :key="notification.id">
      <Component
        :notification="notification"
        :is="componentsMapper[notification.type] || PositiveNotification"
      ></Component>
    </div>
  </div>
</template>

<script setup lang="ts">
import NegativeNotification from './NegativeNotification/NegativeNotification.vue';
import NeutralNotification from './NeutralNotification/NeutralNotification.vue';
import PositiveNotification from './PositiveNotification/PositiveNotification.vue';
import SecondaryNotification from './SecondaryNotification/SecondaryNotification.vue';
import WarningNotification from './WarningNotification/WarningNotification.vue';
import { ComponentsMapper } from './types';

const { data: notifications } = useNotification();

const componentsMapper: ComponentsMapper = {
  positive: PositiveNotification,
  negative: NegativeNotification,
  secondary: SecondaryNotification,
  neutral: NeutralNotification,
  warning: WarningNotification,
};
</script>
