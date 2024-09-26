<template>
  <component :is="tag" :class="className" data-testid="heading">
    {{ title }}
  </component>
</template>

<script setup lang="ts">
import type { HeadingProps } from '~/components/Heading/types';

const { tag = 'h1', className = 'text-center mb-6 font-bold typography-headline-3 md:typography-headline-2' } =
  defineProps<HeadingProps>();
</script>
