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
    "groups-title": "Privacy",
    "description": "Configure settings related to customer data tracking and privacy compliance."
  },
  "de": {
    "groups-title": "Privacy",
    "description": "Configure settings related to customer data tracking and privacy compliance."
  }
}
</i18n>
