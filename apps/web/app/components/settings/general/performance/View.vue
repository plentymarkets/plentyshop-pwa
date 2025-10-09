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
    "groups-title": "Performance",
    "description": "Settings that control the performance of the shop."
  },
  "de": {
    "groups-title": "Performance",
    "description": "Settings that control the performance of the shop."
  }
}
</i18n>
