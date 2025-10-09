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
    "label": "SEO Settings",
    "description": "Manage SEO-relevant settings, like controlling the behaviour of webcrawling robots or defining meta and schema data."
  },
  "de": {
    "label": "SEO Settings",
    "description": "Manage SEO-relevant settings, like controlling the behaviour of webcrawling robots or defining meta and schema data."
  }
}
</i18n>
