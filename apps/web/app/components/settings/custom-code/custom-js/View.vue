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

<script setup lang="ts">
</script>

<i18n lang="json">
{
  "en": {
    "label": "Custom Code Settings",
    "description": "Add custom CSS, JavaScript, metadata, and external scripts to customize your shop beyond standard settings."
  },
  "de": {
    "label": "Custom Code Settings",
    "description": "Add custom CSS, JavaScript, metadata, and external scripts to customize your shop beyond standard settings."
  }
}
</i18n>

