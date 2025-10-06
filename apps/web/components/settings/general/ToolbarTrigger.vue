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
      data-testid="open-general-settings-drawer"
    >
      <NuxtImg v-if="active" width="24" height="24px" :src="gearWhite" />
      <NuxtImg v-else width="24" height="24px" :src="gearBlack" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';

import gearWhite from 'assets/icons/paths/gear-white.svg';
import gearBlack from 'assets/icons/paths/gear-black.svg';

defineProps({
  active: Boolean,
});
</script>

<i18n lang="json">
{
  "en": {
    "tooltip": "General: Manage basic settings that control the shop’s language, currency, customer defaults, security, and performance."
  },
  "de": {
    "tooltip": "General: Manage basic settings that control the shop’s language, currency, customer defaults, security, and performance."
  }
}
</i18n>
