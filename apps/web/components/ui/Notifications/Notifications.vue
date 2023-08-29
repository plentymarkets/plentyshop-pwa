<template>
  <div data-testid="notifications" class="z-50 absolute w-50 right-2 top-2">
    <div v-for="notification of notifications" class="my-2">
      <Component :notification="notification" :is="getComponentByType(notification.type)"></Component>
    </div>
  </div>
</template>
<script setup lang="ts">
import PositiveNotification from './PositiveNotification/PositiveNotification.vue';
import NegativeNotification from './NegativeNotification/NegativeNotification.vue';
import WarningNotification from './WarningNotification/WarningNotification.vue';
import NeutralNotification from './NeutralNotification/NeutralNotification.vue';
import SecondaryNotification from './SecondaryNotification/SecondaryNotification.vue';

const { data: notifications } = useNotification();
const getComponentByType = (type: string) => {
    switch (type) {
        case 'positive':
            return PositiveNotification
        case 'negative':
            return NegativeNotification
        case 'secondary':
            return SecondaryNotification
        case 'neutral':
            return NeutralNotification
        case 'warning':
            return WarningNotification
        default:
            return PositiveNotification;
    }
}
</script>
