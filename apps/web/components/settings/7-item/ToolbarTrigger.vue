<template>
  <SfTooltip :label="itemLabel" placement="right" class="inline-grid" :show-arrow="true">
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
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfIconSell, SfTooltip } from '@storefront-ui/vue';

const itemLabel = 'Product page settings: control which product information is displayed on product detail pages.';

defineProps({
  active: Boolean,
});

const runtimeConfig = useRuntimeConfig();
</script>
