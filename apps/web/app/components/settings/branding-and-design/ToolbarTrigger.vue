<template>
  <SfTooltip :label="getEditorTranslation('tooltip')" placement="right" class="inline-grid" :show-arrow="true">
    <button
      type="button"
      class="editor-button relative py-2 flex justify-center"
      :class="{ 'bg-editor-button text-white rounded-md': active }"
      aria-label="Open design drawer"
      data-testid="open-design-drawer"
    >
      <NuxtImg v-if="active" width="24" height="24px" :src="paintBrushWhite" />
      <NuxtImg v-else width="24" height="24px" :src="paintBrushBlack" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';
import paintBrushWhite from '~/assets/icons/paths/paint-brush-white.svg';
import paintBrushBlack from '~/assets/icons/paths/paint-brush-black.svg';

defineProps({
  active: Boolean,
});
</script>

<i18n lang="json">
{
  "en": {
    "tooltip": "Branding & design: Manage your logo, customize colors, typography, and more."
  },
  "de": {
    "tooltip": "Branding & design: Manage your logo, customize colors, typography, and more."
  }
}
</i18n>
