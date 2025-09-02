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
    "label": "Social Media",
    "description": "Control how your shop is presented when shared online"
  },
  "de": {
    "label": "Social Media",
    "description": "Control how your shop is presented when shared online"
  }
}
</i18n>
