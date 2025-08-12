<template>
  <button
    v-if="runtimeConfig.public.isDev"
    type="button"
    class="editor-button relative py-2 flex justify-center"
    :class="{ 'bg-editor-button text-white rounded-md': active }"
    aria-label="Open general settings drawer"
    data-testid="open-general-settings-drawer"
  >
    <SfIconShoppingCart width="24" height="24px" />
  </button>
</template>

<script setup lang="ts">
import { SfIconShoppingCart } from '@storefront-ui/vue';

const runtimeConfig = useRuntimeConfig();

defineProps({
  active: Boolean,
});
</script>
