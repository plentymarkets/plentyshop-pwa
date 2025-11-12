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
      aria-label="Open localization settings drawer"
      data-testid="open-localization-settings-drawer"
    >
      <SfIconLanguage width="24" height="24px" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfIconLanguage, SfTooltip } from '@storefront-ui/vue';

defineProps({
  active: Boolean,
});
</script>

<i18n lang="json">
{
  "en": {
    "tooltip": "Localization: Manage translations for static texts inside the shop."
  },
  "de": {
    "tooltip": "Localization: Manage translations for static texts inside the shop."
  }
}
</i18n>
