<template>
  <div class="flex flex-col items-center justify-center py-16">
    <SfIconWarning class="mb-6 text-secondary-500" size="lg" />
    <p class="text-lg font-semibold text-gray-700 mb-4">
      {{ getEditorTranslation('empty-content-title') }}
    </p>
    <p class="text-base text-gray-500 mb-6">
      {{ getEditorTranslation('empty-content-description') }}
    </p>
    <SfButton variant="primary" class="mb-4">
      <NuxtLink to="/" class="btn btn-primary bg-primary-500 hover:bg-primary-600">
        {{ getEditorTranslation('empty-content-cta') }}
      </NuxtLink>
    </SfButton>
  </div>
</template>

<script setup lang="ts">
import { SfIconWarning, SfButton } from '@storefront-ui/vue';
</script>

<i18n lang="json">
{
  "en": {
    "empty-content-title": "This page has no content yet.",
    "empty-content-description": "Some informational text.",
    "empty-content-cta": "Go to homepage"
  },
  "de": {
    "empty-content-title": "Diese Seite enthält noch keinen Inhalt.",
    "empty-content-description": "Some informational text.",
    "empty-content-cta": "Zur Startseite"
  }
}
</i18n>
