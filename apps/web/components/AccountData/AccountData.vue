<template>
  <div class="mx-4" data-testid="account-data">
    <div class="flex justify-between my-2 mx-4 md:mx-0 px-4 md:px-0">
      <h2 class="typography-headline-4 font-medium">{{ header }}</h2>
      <UiButton v-if="showEditButton" variant="tertiary" size="sm" class="self-start" @click="$emit('on-click')">
        {{ buttonText }}
      </UiButton>
    </div>
    <div class="my-2 mx-4 md:mx-0 px-4 md:px-0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccountDataProps } from '~/components/AccountData/types';

const { showEditButton = false } = defineProps<AccountDataProps>();
defineEmits(['on-click']);
</script>
