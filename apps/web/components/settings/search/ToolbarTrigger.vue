<template>
  <SfTooltip :label="getEditorTranslation('tooltip')" placement="right" class="inline-grid" :show-arrow="true">
    <button
      v-if="runtimeConfig.public.isDev"
      type="button"
      class="editor-button relative py-2 flex justify-center"
      :class="{ 'bg-editor-button text-white rounded-md': active }"
      aria-label="Open general settings drawer"
      data-testid="open-item-settings-drawer"
    >
      <SfIconSearch v-if="active" class="text-white" />
      <SfIconSearch v-else class="text-black" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfIconSearch, SfTooltip } from '@storefront-ui/vue';

defineProps({
  active: Boolean,
});

const runtimeConfig = useRuntimeConfig();
</script>

<i18n lang="json">
{
  "en": {
    "tooltip": "Search: Manage settings that control search and search results in the shop."
  },
  "de": {
    "tooltip": "Search: Manage settings that control search and search results in the shop."
  }
}
</i18n>
