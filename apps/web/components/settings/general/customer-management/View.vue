<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('groups-title') }}</template>

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
    "groups-title": "Customer Management",
    "description": "Assign default customer classes for B2C and B2B customers."
  },
  "de": {
    "groups-title": "Customer Management",
    "description": "Assign default customer classes for B2C and B2B customers."
  }
}
</i18n>
