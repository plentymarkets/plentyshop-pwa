<template>
  <SfTooltip :label="getEditorTranslation('tooltip')" placement="right" class="inline-grid" :show-arrow="true">
    <button
      v-if="runtimeConfig.public.isDev"
      type="button"
      class="editor-button relative py-2 flex justify-center"
      :class="{ 'bg-editor-button text-white rounded-md': active }"
      aria-label="Open general settings drawer"
      data-testid="open-checkout-settings-drawer"
    >
      <SfIconShoppingCart width="24" height="24px" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfIconShoppingCart, SfTooltip } from '@storefront-ui/vue';

const runtimeConfig = useRuntimeConfig();

defineProps({
  active: Boolean,
});
</script>

<i18n lang="json">
{
  "en": {
    "tooltip": "Checkout: Manage settings that affect the user experience and available options during the checkout process."
  },
  "de": {
    "tooltip": "Checkout: Manage settings that affect the user experience and available options during the checkout process."
  }
}
</i18n>
