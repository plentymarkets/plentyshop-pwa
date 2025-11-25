<template>
  <SfTooltip
    :label="getEditorTranslation('tooltip')"
    placement="right"
    class="inline-grid font-editor"
    :show-arrow="true"
  >
    <button
      type="button"
      class="editor-button relative py-2 flex justify-center"
      :class="{ 'bg-editor-button text-white rounded-md': active }"
      aria-label="Open general settings drawer"
      data-testid="open-item-settings-drawer"
    >
      <SfIconSell v-if="active" class="text-white" />
      <SfIconSell v-else class="text-black" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfIconSell, SfTooltip } from '@storefront-ui/vue';

defineProps({
  active: Boolean,
});
</script>

<i18n lang="json">
{
  "en": {
    "tooltip": "Item: Manage settings that affect the user experience on item pages."
  },
  "de": {
    "tooltip": "Item: Manage settings that affect the user experience on item pages."
  }
}
</i18n>
