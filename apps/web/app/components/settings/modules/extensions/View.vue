<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('title') }}</template>
  </SiteConfigurationView>
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": { "title": "Extensions" },
  "de": { "title": "Erweiterungen" }
}
</i18n>
