<template>
  <div class="flex flex-col items-center justify-start min-h-screen p-10">
    <UiButton class="mb-4 mt-20" @click="emitAddEvent">
      <SfIconAdd class="cursor-pointer text-xl" />
    </UiButton>
    <p class="font-bold text-lg">{{ t('homepage.emptyBlock.headline') }}</p>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
const { t } = useI18n();
const emit = defineEmits(['addNewBlock']);

const emitAddEvent = () => {
  emit('addNewBlock');
};
</script>
