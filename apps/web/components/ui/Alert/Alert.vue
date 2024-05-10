<template>
  <div :class="['flex items-center justify-center', classes]">
    <slot />
  </div>
</template>

<script lang="ts">
const sizeClasses = {
  sm: 'text-xs p-1 gap-1',
  base: 'text-sm p-1.5 gap-1.5',
};
</script>

<script setup lang="ts">
import type { AlertProps } from '~/components/ui/Alert/types';

const props = withDefaults(defineProps<AlertProps>(), {
  size: 'base',
  strong: false,
  variant: 'primary',
});

const classes = computed(() => [
  sizeClasses[props.size],
  props.strong ? 'text-white font-medium rounded-none' : 'rounded-md font-normal',
  {
    [`text-black ${props.strong ? 'bg-positive-600' : 'bg-positive-100'}`]: props.variant === 'positive',
    [`text-black ${props.strong ? 'bg-negative-600' : 'bg-negative-100'}`]: props.variant === 'negative',
    [`text-black ${props.strong ? 'bg-secondary-800' : 'bg-secondary-100'}`]: props.variant === 'secondary',
    [`text-black border border-neutral-200 ${props.strong ? 'bg-neutral-600' : 'bg-neutral-100'}`]:
      props.variant === 'neutral',
    [`text-black ${props.strong ? 'bg-warning-600' : 'bg-warning-100'}  `]: props.variant === 'warning',
  },
]);
</script>
