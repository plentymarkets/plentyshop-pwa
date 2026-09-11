<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('title') }}</template>
    <template #setting-description>
      <div class="flex flex-col px-4 text-sm">
        <p class="pb-2">{{ getEditorTranslation('description') }}</p>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "title": "Modules",
    "description": "Enable or disable installed modules. Changes take effect immediately without a server restart."
  },
  "de": {
    "title": "Module",
    "description": "Installierte Module aktivieren oder deaktivieren. Änderungen werden sofort ohne Serverneustart wirksam."
  }
}
</i18n>
