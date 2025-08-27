<template>
  <div class="py-2">
    to change
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="robots"
        :options="robotOptions"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-robots"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('robots');

const robots = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const robotOptions = ['all', 'noindex', 'nofollow', 'noindex, nofollow'];
</script>

<i18n lang="json">
{
  "en": {
    "label": "Edit Robots.txt",
    "description": "The robots.txt file tells search engines which parts of your shop they are allowed or not allowed to crawl. You can use the Allow and Disallow directives to control access to specific pages or sections.",
    "placeholder": "Edit Robots.txt"
  },
  "de": {
    "label": "Robots",
    "description": "Controls how search engines should treat pages that are automatically generated. Choose \"all\" to allow indexing and following links, or select other options to restrict them.",
    "placeholder": "Select robots meta tag"
  }
}
</i18n>
