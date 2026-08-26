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
    "description": "Enable or disable installed modules. Changes take effect immediately for route access. A server restart is required for full module deregistration."
  },
  "de": {
    "title": "Module",
    "description": "Installierte Module aktivieren oder deaktivieren. Routenänderungen wirken sofort. Ein Neustart ist für die vollständige Deregistrierung erforderlich."
  }
}
</i18n>
