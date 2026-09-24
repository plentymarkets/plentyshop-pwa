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
    "label": "Legal guarantee",
    "description": "Choose how the legal guarantee of conformity appears during checkout."
  },
  "de": {
    "label": "Legal guarantee",
    "description": "Choose how the legal guarantee of conformity appears during checkout."
  }
}
</i18n>
