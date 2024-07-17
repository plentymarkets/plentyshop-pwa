<template>
  <div
    :class="[
      'inline-flex items-center justify-center rounded-md',
      strong ? 'font-medium' : 'font-normal',
      getVariantClasses,
      sizeClasses,
    ]"
    data-testid="tag"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
import { type TagProps, TagSize } from '~/components/ui/Tag/types';

const props = withDefaults(defineProps<TagProps>(), {
  variant: 'primary',
  strong: false,
  size: 'base',
});

const sizeClasses = computed(() =>
  props.size.toString() === TagSize.sm ? 'text-xs p-1 gap-1' : 'text-sm p-1.5 gap-1.5',
);

const getVariantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary': {
      return ['text-secondary-800', 'bg-secondary-200'];
    }
    case 'negative': {
      return ['text-negative-800', props.strong ? 'bg-negative-200' : 'bg-negative-100'];
    }
    case 'positive': {
      return ['text-green-800', props.strong ? 'bg-green-200' : 'bg-green-100'];
    }
    default: {
      return ['text-primary-800', props.strong ? 'bg-primary-200' : 'bg-primary-100'];
    }
  }
});
</script>
