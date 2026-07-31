<template>
  <div class="bg-warning-200 p-2" role="alert" aria-live="polite">
    <div class="flex items-start gap-2 mb-1">
      <SfIconWarning class="shrink-0 text-yellow-700" aria-hidden="true" />
      <div class="font-semibold text-neutral-800 typography-text-base">{{ title }}</div>
    </div>
    <div class="text-neutral-600 typography-text-sm">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { SfIconWarning } from '@storefront-ui/vue';
import type { AdmonitionWarningProps } from './types';

defineProps<AdmonitionWarningProps>();
</script>
