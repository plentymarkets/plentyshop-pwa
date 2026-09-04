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
      aria-label="Open modules settings drawer"
      data-testid="open-modules-settings-drawer"
    >
      <NuxtImg v-if="active" width="24" height="24px" :src="layersWhite" />
      <NuxtImg v-else width="24" height="24px" :src="layersBlack" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';
import layersWhite from '~/assets/icons/paths/layers-white.svg';
import layersBlack from '~/assets/icons/paths/layers-black.svg';

defineProps({
  active: Boolean,
});
</script>

<i18n lang="json">
{
  "en": { "tooltip": "Modules: Enable or disable installed modules." },
  "de": { "tooltip": "Module: Installierte Module aktivieren oder deaktivieren." }
}
</i18n>
