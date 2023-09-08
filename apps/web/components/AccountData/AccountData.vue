<template>
  <div class="md:mx-4" data-testid="account-data">
    <div class="flex justify-between my-2">
      <h2 class="typography-headline-4 font-bold">{{ header }}</h2>
    </div>
    <div class="my-2">
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AccountDataProps } from './types';

defineProps<AccountDataProps>();
defineEmits(['on-click']);
</script>
