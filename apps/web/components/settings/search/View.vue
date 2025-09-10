<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>

    <template #setting-description>
      <div class="flex flex-col px-4 text-sm">
        <p class="pb-2">
          <span class="align-middle font-bold">{{ getEditorTranslation('description') }}</span>
        </p>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "Search",
    "description": "Manage settings that control search and search results in the shop."
  },
  "de": {
    "label": "Search",
    "description": "Manage settings that control search and search results in the shop."
  }
}
</i18n>
