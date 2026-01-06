<template>
  <div
    v-if="visible"
    class="w-full h-full top-0 bottom-0 left-0 right-0 bg-neutral-500/50 fixed z-50"
    data-testid="overlay"
  >
    <transition
      enter-active-class="transition duration-500 ease-in-out"
      leave-active-class="transition duration-500 ease-in-out"
      :enter-from-class="placement === 'left' ? '-translate-x-full' : 'translate-x-full'"
      :enter-to-class="placement === 'left' ? 'translate-x-0' : 'translate-x-0'"
      :leave-from-class="placement === 'left' ? 'translate-x-0' : 'translate-x-0'"
      :leave-to-class="placement === 'left' ? '-translate-x-full' : 'translate-x-full'"
    >
      <slot />
    </transition>
  </div>
</template>
<script setup lang="ts">
import type { OverlayProps } from '~/components/ui/Overlay/types';
import type { SfDrawerPlacement } from '@storefront-ui/vue';
const placement = ref<`${SfDrawerPlacement}`>('left');

defineProps<OverlayProps>();
</script>
