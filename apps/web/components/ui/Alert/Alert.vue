<template>
  <div :class="['flex items-center justify-center', classes]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { AlertProps } from '~/components/ui/Alert/types';

const sizeClasses = {
  sm: 'text-xs p-1 gap-1',
  base: 'text-sm p-1.5 gap-1.5',
};

const { size = 'base', strong = false, variant = 'primary' } = defineProps<AlertProps>();

const classes = computed(() => [
  sizeClasses[size],
  strong ? 'text-white font-medium rounded-none' : 'rounded-md font-normal',
  {
    [`text-black ${strong ? 'bg-positive-600' : 'bg-positive-100'}`]: variant === 'positive',
    [`text-black ${strong ? 'bg-negative-600' : 'bg-negative-100'}`]: variant === 'negative',
    [`text-black ${strong ? 'bg-secondary-600' : 'bg-secondary-100'}`]: variant === 'secondary',
    [`text-black border border-neutral-200 ${strong ? 'bg-neutral-600' : 'bg-neutral-100'}`]: variant === 'neutral',
    [`text-black ${strong ? 'bg-warning-600' : 'bg-warning-100'}  `]: variant === 'warning',
  },
]);
</script>
