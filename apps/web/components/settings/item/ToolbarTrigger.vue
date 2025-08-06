<template>
  <button
    v-if="runtimeConfig.public.isDev"
    type="button"
    class="editor-button relative py-2 flex justify-center"
    :class="{ 'bg-editor-button text-white rounded-md': active }"
    aria-label="Open general settings drawer"
    data-testid="open-general-settings-drawer"
  >
    <SfIconSell v-if="active" class="text-white" />
    <SfIconSell v-else class="text-black" />
  </button>
</template>

<script setup lang="ts">
import { SfIconSell } from '@storefront-ui/vue';

const runtimeConfig = useRuntimeConfig();

defineProps({
  active: Boolean,
});
</script>
