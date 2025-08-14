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
    "label": "SEO Settings",
    "description": "Global defaults",
    "hint": "The settings below apply to any page without its own, page-specific settings."
  },
  "de": {
    "label": "SEO Settings",
    "description": "Global defaults",
    "hint": "The settings below apply to any page without its own, page-specific settings."
  }
}
</i18n>
