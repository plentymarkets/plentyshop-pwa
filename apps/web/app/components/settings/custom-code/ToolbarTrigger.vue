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
      data-testid="open-checkout-settings-drawer"
    >
      <SfIconUnfoldMore class="rotate-90" width="24" height="24px" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfIconUnfoldMore, SfTooltip } from '@storefront-ui/vue';

defineProps({
  active: Boolean,
});
</script>

<i18n lang="json">
{
  "en": {
    "tooltip": "Custom Code: Manage custom CSS, JavaScript, Meta Tags and external scripts"
  },
  "de": {
    "tooltip": "Custom Code: Verwalte benutzerdefiniertes CSS, JavaScript, Meta-Tags und externe Skripte"
  }
}
</i18n>
