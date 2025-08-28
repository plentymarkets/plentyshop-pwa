<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>
    <template #setting-description>
      <div class="flex flex-col px-4 py-5 border-t text-sm">
        <p class="pb-2">
          <SfIconInfo size="sm" />
          <span class="px-2 align-middle font-bold">{{ getEditorTranslation('description') }}</span>
        </p>
        <p>{{ getEditorTranslation('hint') }}</p>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
import { SfIconInfo } from '@storefront-ui/vue';
</script>

<i18n lang="json">
{
  "en": {
    "label": "Improve product listings in search engines",
    "description": "Control how item details are shown in search results. This helps search engines display your items more clearly and attractively.",
    "hint": ""
  },
  "de": {
    "label": "Improve product listings in search engines",
    "description": "Control how item details are shown in search results. This helps search engines display your items more clearly and attractively.",
    "hint": ""
  }
}
</i18n>
