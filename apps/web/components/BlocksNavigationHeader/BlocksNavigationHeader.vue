<template>
  <div class="flex items-center justify-between px-5 py-6 border-b border-[#F1F3F5]">
    <div class="font-bold text-[#062633]">{{ getEditorTranslation('label') }}</div>
    <button @click="drawerOpen = false">
      <SfIconClose />
    </button>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';
const { drawerOpen } = useSiteConfiguration();
</script>

<i18n lang="json">
{
  "en": {
    "label": "Add block"
  },
  "de": {
    "label": "Add block"
  }
}
</i18n>
